let isInFrame;
const cloakingStatus = localStorage.getItem("AB") || "on";

try {
  isInFrame = window !== top;
} catch (e) {
  isInFrame = true;
  localStorage.setItem("re", "true");
}

if (cloakingStatus === "o") {
  // Change Before publish to "on"
  if (!isInFrame && !navigator.userAgent.includes("Firefox")) {
    const popupWindow = window.open("about:blank", "_blank");

    if (!popupWindow || popupWindow.closed) {
      alert(
        "Please Allow Popup & Redirects so this tab cloaks into about://blank, if you cannot for whatever reason you can turn this message off in settings!",
      );
    } else {
      const popupDocument = popupWindow.document;
      const iframeElement = popupDocument.createElement("iframe");
      const iframeStyle = iframeElement.style;
      const faviconLink = popupDocument.createElement("link");

      const pageTitle = localStorage.getItem("name") || "Home - Google Drive";
      const pageIcon =
        localStorage.getItem("icon") ||
        "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png";

      popupDocument.title = pageTitle;
      faviconLink.rel = "icon";
      faviconLink.href = pageIcon;

      iframeElement.src = location.href;
      Object.assign(iframeStyle, {
        position: "fixed",
        top: "0",
        bottom: "0",
        left: "0",
        right: "0",
        border: "none",
        outline: "none",
        width: "100vw",
        height: "100vh",
      });

      popupDocument.head.appendChild(faviconLink);
      popupDocument.body.appendChild(iframeElement);

      const redirectLink =
        localStorage.getItem(encodeURI("redirlink")) ||
        "https://www.google.com";
      location.replace(redirectLink);
    }
  }
} else {
  console.log("Tab Cloaking is off");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js?v=3", { scope: __uv$config.prefix })
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

function promptForChoice(
  message,
  yesUrl,
  noUrl,
  yesChoice = "A",
  noChoice = "B",
) {
  let choice = prompt(message);
  if (choice) {
    choice = choice.toUpperCase();
    if (choice === yesChoice) {
      localStorage.setItem(
        "Iframe",
        __uv$config.prefix + __uv$config.encodeUrl(yesUrl),
      );
      window.location.href = "./g";
    } else if (choice === noChoice) {
      window.location.href = noUrl;
    } else {
      console.log(
        `Invalid choice. Please choose '${yesChoice}' or '${noChoice}'.`,
      );
    }
  } else {
    console.log("You didn't choose anything.");
  }
}

function ocgh() {
  promptForChoice(
    `Would you like Github to be Proxied or not?\nType the letter of the corresponding choice:\nA - Yes - Use Github Proxied\nB - No  - Use Github Not Proxied`,
    "https://github.com/GoStarLight/StarLight",
    "https://github.com/GoStarLight/StarLight",
  );
}

function ocdc() {
  promptForChoice(
    `Would you like Discord to be Proxied or not?\nType the letter of the corresponding choice:\nA - Yes | Use Discord Proxied\nB - No  | Use Discord Not Proxied`,
    "https://discord.gg/H65c2HqfY8",
    "https://discord.gg/H65c2HqfY8",
  );
}

const input = document.getElementById("search-input");
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    enter();
  }
});

function enter() {
  const input = document.getElementById("search-input").value.trim();
  let baseUrl;
  let url;
  const urlRegex = /^(https?:\/\/)?(?:\w+\.)+\w{2,}(?:\/\S*)?$/;

  if (urlRegex.test(input)) {
    url =
      input.includes("www") ||
      input.startsWith("http://") ||
      input.startsWith("https://")
        ? input
        : `https://www.${input.includes("www.") ? input : `www.${input}`}`;
  } else {
    baseUrl = localStorage.getItem("se") || "https://www.google.com/search?q=";
    url = `${baseUrl}${input}`;
  }

  localStorage.setItem(
    "Iframe",
    __uv$config.prefix + __uv$config.encodeUrl(url),
  );
  window.location.href = "./g";
}

// Search engine picker
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const suggestionsList = document.getElementById("suggestions-list");
  const dropdown = document.getElementById("search-engine");

  function setSearchEngine(engine, url, placeholder) {
    localStorage.setItem("se", url);
    localStorage.setItem("sevalue", engine);
    searchInput.placeholder = placeholder;
  }

  function getSI() {
    const SIvalue = localStorage.getItem("sevalue") || "google";
    setSearchEngine(
      SIvalue,
      `https://www.${SIvalue}.com/search?q=`,
      `Search with ${SIvalue} or with a URL`,
    );
    dropdown.value = SIvalue;
  }

  dropdown.addEventListener("change", (event) => {
    const selectedOption = event.target.value;
    switch (selectedOption) {
      case "brave":
        setSearchEngine(
          "brave",
          "https://search.brave.com/search?q=",
          "Search with Brave or with a URL",
        );
        break;
      case "google":
        setSearchEngine(
          "google",
          "https://www.google.com/search?q=",
          "Search with Google or with a URL",
        );
        break;
      case "bing":
        setSearchEngine(
          "bing",
          "https://www.bing.com/search?q=",
          "Search with Bing or with a URL",
        );
        break;
      case "duckduckgo":
        setSearchEngine(
          "duckduckgo",
          "https://duckduckgo.com/?q=",
          "Search with DuckDuckGo or with a URL",
        );
        break;
    }
  });

  searchInput.addEventListener("click", (event) => {
    const inputRect = searchInput.getBoundingClientRect();
    const clickX = event.clientX - inputRect.left;
    if (clickX <= 34) {
      event.preventDefault();
      enter();
    }
  });

  searchInput.placeholder = `Search with ${localStorage.getItem("sevalue")} or with a url`;

  let debounceTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(async () => {
      const query = searchInput.value;
      if (query.length > 0) {
        try {
          const baseUrl = `${window.location.protocol}//${window.location.host}`;
          const response = await fetch(`${baseUrl}/suggest?q=${query}`);
          const suggestions = await response.json();
          renderSuggestions(suggestions);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          suggestionsList.innerHTML = "";
        }
      } else {
        suggestionsList.innerHTML = "";
      }
    }, 300);
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => {
      suggestionsList.innerHTML = "";
    }, 100);
  });

  document.addEventListener("click", (e) => {
    if (!suggestionsList.contains(e.target) && e.target !== searchInput) {
      suggestionsList.innerHTML = "";
    }
  });

  suggestionsList.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("suggestion-item") ||
      e.target.parentNode.classList.contains("suggestion-item") ||
      (e.target.tagName === "LI" && suggestionsList.contains(e.target))
    ) {
      searchInput.value = e.target.textContent.trim();
      suggestionsList.innerHTML = "";
      enter();
    }
  });

  function renderSuggestions(suggestions) {
    suggestionsList.innerHTML = suggestions
      .map(
        (suggestion) =>
          `<li><div class="suggestion-item"><img class="search-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjZGQ2ZjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1zZWFyY2giPjxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiLz48cGF0aCBkPSJtMjEgMjEtNC4zLTQuMyIvPjwvc3ZnPg==" alt="StarLight">${suggestion}</div></li>`,
      )
      .join("");
  }

  getSI();
});
