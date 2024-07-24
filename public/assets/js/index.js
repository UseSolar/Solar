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
        "Please Allow Popup & Redirects so this tab cloaks into about://blank, if you cannot for whatever reason you can turn this message off in settings!"
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
      iframeStyle.position = "fixed";
      iframeStyle.top = "0";
      iframeStyle.bottom = "0";
      iframeStyle.left = "0";
      iframeStyle.right = "0";
      iframeStyle.border = "none";
      iframeStyle.outline = "none";
      iframeStyle.width = "100vw";
      iframeStyle.height = "100vh";

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
          registration.scope
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

function ocgh() {
  let choice = prompt(`Would you like Github to be Proxied or not?
  Type the letter of the corresponding choice:
  A - Yes - Use Github Proxied
  B - No  - Use Github Not Proxied`);

  if (choice) {
    choice = choice.toUpperCase();
    if (choice === "A") {
      let url = "https://github.com/GoStarLight/StarLight";
      localStorage.setItem(
        "Iframe",
        __uv$config.prefix + __uv$config.encodeUrl(url)
      );
      window.location.href = "./g";
    } else if (choice === "B") {
      window.location.href = "https://github.com/GoStarLight/StarLight";
    } else {
      console.log("Invalid choice. Please choose 'A' or 'B'.");
    }
  } else {
    console.log("You didn't choose anything.");
  }
}

function ocdc() {
  let choice = prompt(`Would you like Discord to be Proxied or not?
  Type the letter of the corresponding choice:
  A - Yes | Use Discord Proxied
  B - No  | Use Discord Not Proxied`);

  if (choice) {
    choice = choice.toUpperCase();
    if (choice === "A") {
      let url = "https://discord.gg/H65c2HqfY8";
      localStorage.setItem(
        "Iframe",
        __uv$config.prefix + __uv$config.encodeUrl(url)
      );
      window.location.href = "./g";
    } else if (choice === "B") {
      window.location.href = "https://discord.gg/H65c2HqfY8";
    } else {
      console.log("Invalid choice. Please choose 'A' or 'B'.");
    }
  } else {
    console.log("You didn't choose anything.");
  }
}

const input = document.getElementById("search-input");
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    enter();
  }
});

function enter() {
  let input = document.getElementById("search-input").value.trim();
  let baseUrl;
  let url;
  const urlRegex = /^(https?:\/\/)?(?:\w+\.)+\w{2,}(?:\/\S*)?$/;

  if (urlRegex.test(input)) {
    if (
      !input.includes("www") &&
      !input.startsWith("http://") &&
      !input.startsWith("https://")
    ) {
      url = "https://www." + input;
    } else {
      if (!input.includes("www.")) {
        url = "https://www." + input;
      } else {
        url = input;
      }
    }
  } else {
    baseUrl = localStorage.getItem("se") || "https://www.google.com/search?q=";
    url = baseUrl + input;
  }

  localStorage.setItem(
    "Iframe",
    __uv$config.prefix + __uv$config.encodeUrl(url)
  );
  window.location.href = "./g";
}

// search engine picker
getSI();

function getSI() {
  let SIvalue = localStorage.getItem("sevalue");
  if (!SIvalue) {
    SIvalue = "google";
    localStorage.setItem("sevalue", SIvalue);
  }
  const dropdown = document.getElementById("search-engine");
  dropdown.value = SIvalue;
}
document.getElementById("search-engine").addEventListener("change", function (event) {
  const selectedOption = event.target.value;
  let searchInput = document.getElementById("search-input");

  if (selectedOption == "brave") {
    localStorage.setItem("se", "https://search.brave.com/search?q=");
    localStorage.setItem("sevalue", "brave");
    searchInput.placeholder = "Search with Brave or with a URL";
  } else if (selectedOption == "google") {
    localStorage.setItem("se", "https://www.google.com/search?q=");
    localStorage.setItem("sevalue", "google");
    searchInput.placeholder = "Search with Google or with a URL";
  } else if (selectedOption == "bing") {
    localStorage.setItem("se", "https://www.bing.com/search?q=");
    localStorage.setItem("sevalue", "bing");
    searchInput.placeholder = "Search with Bing or with a URL";
  } else if (selectedOption == "duckduckgo") {
    localStorage.setItem("se", "https://duckduckgo.com/?q=");
    localStorage.setItem("sevalue", "duckduckgo");
    searchInput.placeholder = "Search with DuckDuckGo or with a URL";
  } else if (selectedOption == "startpage") {
    localStorage.setItem("se", "https://startpage.com/sp/search?q=");
    localStorage.setItem("sevalue", "startpage");
    searchInput.placeholder = "Search with Startpage or with a URL";
  }
});

document.getElementById("search-input").addEventListener("click", (event) => {
  const input = event.target;
  const imageWidth = 29;
  const inputRect = input.getBoundingClientRect();
  const clickX = event.clientX - inputRect.left;

  const imageOffsetX = 10;

  if (clickX <= imageOffsetX + imageWidth) {
    event.preventDefault();
    enter();
  }
});

let searchInput = document.getElementById("search-input");
searchInput.placeholder =
  "Search with " + localStorage.getItem("sevalue") + " or with a url"
  
// Search Suggestions
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const suggestionsList = document.getElementById("suggestions-list");

  async function fetchSuggestions(query) {
    try {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const response = await fetch(`${baseUrl}/suggest?q=${query}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  }

  function renderSuggestions(suggestions) {
    suggestionsList.innerHTML = suggestions
      .map(
        (suggestion) =>
          `<li><div class="suggestion-item"><img class="search-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjZGQ2ZjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1zZWFyY2giPjxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiLz48cGF0aCBkPSJtMjEgMjEtNC4zLTQuMyIvPjwvc3ZnPg==" alt="StarLight">${suggestion}</div></li>`
      )
      .join("");
  }

  searchInput.addEventListener("input", async () => {
    const query = searchInput.value;
    if (query.length > 0) {
      const suggestions = await fetchSuggestions(query);
      renderSuggestions(suggestions);
    } else {
      suggestionsList.innerHTML = "";
    }
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => {
      suggestionsList.innerHTML = "";
    }, 100);
  });

  document.addEventListener("click", (e) => {
    if (
      !suggestionsList.contains(e.target) &&
      e.target !== searchInput
    ) {
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
});
