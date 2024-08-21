const data = {
  items: [
    {
      favicon:
        "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png",
      title: "Home - Google Drive",
      redir: "https://drive.google.com/drive/u/0/home",
    },
    {
      favicon:
        "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png",
      title: "Home",
      redir: "https://classroom.google.com/",
    },
    {
      favicon: "",
      title: "Grades & Attendance",
      redir: "https://www.powerschool.com/sign-in/",
    },
    {
      favicon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico",
      title: "Gmail",
      redir: "https://mail.google.com/mail/u/1/#inbox",
    },
    {
      favicon: "https://static.canva.com/static/images/favicon-1.ico",
      title: "Home - Canva",
      redir: "https://canva.com",
    },
  ],
};

const windowName = "tbclk";
if (window.name !== windowName) {
  const win = window.open("", windowName);
  if (!win || win.closed) {
    alert("Consider allowing popups to use about:blank");
    const randomItem =
      data.items[Math.floor(Math.random() * data.items.length)];
    let link =
      document.querySelector("link[rel='icon']") ||
      document.createElement("link");
    link.rel = "icon";
    link.href = randomItem.favicon;
    document.head.appendChild(link);
    document.title = randomItem.title;
  }
  if (win) {
    win.document.body.style.margin = "0";
    win.document.body.style.height = "100vh";
    let iframe = win.document.querySelector("iframe");
    if (!iframe) {
      iframe = win.document.createElement("iframe");
      iframe.style.border = "none";
      iframe.style.width = "100vw";
      iframe.style.height = "100vh";
      iframe.style.margin = "0";
      iframe.src = location.href;
      win.document.body.appendChild(iframe);
      const randomItem =
        data.items[Math.floor(Math.random() * data.items.length)];
      let link =
        win.document.querySelector("link[rel='icon']") ||
        win.document.createElement("link");
      link.rel = "icon";
      link.href = randomItem.favicon;
      win.document.head.appendChild(link);
      win.document.title = randomItem.title;
      location.replace(randomItem.redir);
    }
  } else {
    console.info("Failed to open the new window.");
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js?v=3", { scope: __uv$config.prefix })
      .then(({ scope }) =>
        console.log("Service Worker registered with scope:", scope),
      )
      .catch((error) =>
        console.error("Service Worker registration failed:", error),
      );
  });
}

function handleProxyChoice(service, url) {
  const choice = prompt(
    `Would you like ${service} to be Proxied or not?\nA - Yes | Use ${service} Proxied\nB - No  | Use ${service} Not Proxied`,
  );

  if (choice) {
    const upperChoice = choice.toUpperCase();
    if (upperChoice === "A") {
      localStorage.setItem(
        "Iframe",
        __uv$config.prefix + __uv$config.encodeUrl(url),
      );
      window.location.href = "./g";
    } else if (upperChoice === "B") {
      location.replace(url);
    } else {
      console.log("Invalid choice. Please choose 'A' or 'B'.");
    }
  } else {
    console.log("You didn't choose anything.");
  }
}

function ocgh() {
  handleProxyChoice("Github", "https://github.com/usesolar/solar");
}
function ocdc() {
  handleProxyChoice("Discord", "https://dsc.gg/usesolar");
}

const input = document.getElementById("search-input");
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    enter();
  }
});

function enter() {
  localStorage.setItem("transtype", "epoxy");
  const inputValue = input.value.trim();
  const urlRegex = /^(https?:\/\/)?(?:\w+\.)+\w{2,}(?:\/\S*)?$/;

  let url = urlRegex.test(inputValue)
    ? inputValue.startsWith("http")
      ? inputValue
      : `https://www.${inputValue}`
    : (localStorage.getItem("se") || "https://www.google.com/search?q=") +
      inputValue;

  localStorage.setItem(
    "Iframe",
    __uv$config.prefix + __uv$config.encodeUrl(url),
  );
  window.location.href = "./g";
}

function initializeSearchEngine() {
  const defaultEngine = "google";
  const searchEngines = {
    brave: "https://search.brave.com/search?q=",
    google: "https://www.google.com/search?q=",
    bing: "https://www.bing.com/search?q=",
    duckduckgo: "https://duckduckgo.com/?q=",
  };

  let sevalue = localStorage.getItem("sevalue") || defaultEngine;
  localStorage.setItem("sevalue", sevalue);

  const dropdown = document.getElementById("search-engine");
  dropdown.value = sevalue;
  input.placeholder = `Search with ${sevalue} or with a URL`;

  dropdown.addEventListener("change", ({ target: { value } }) => {
    if (searchEngines[value]) {
      localStorage.setItem("se", searchEngines[value]);
      localStorage.setItem("sevalue", value);
      input.placeholder = `Search with ${value} or with a URL`;
    }
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const suggestionsList = document.getElementById("suggestions-list");

  async function fetchSuggestions(query) {
    try {
      const response = await fetch(`/suggest?q=${query}`);
      return response.ok ? await response.json() : [];
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return [];
    }
  }

  function renderSuggestions(suggestions) {
    suggestionsList.innerHTML = suggestions
      .map(
        (suggestion) =>
          `<li><div class="suggestion-item"><img class="search-icon" src="data:image/svg+xml;base64,..." alt="StarLight">${suggestion}</div></li>`,
      )
      .join("");
  }

  input.addEventListener("input", async () => {
    const query = input.value.trim();
    suggestionsList.innerHTML = query.length
      ? await fetchSuggestions(query).then(renderSuggestions)
      : "";
  });

  input.addEventListener("blur", () =>
    setTimeout(() => (suggestionsList.innerHTML = ""), 100),
  );

  document.addEventListener("click", (e) => {
    if (!suggestionsList.contains(e.target) && e.target !== input) {
      suggestionsList.innerHTML = "";
    }
  });

  suggestionsList.addEventListener("click", (e) => {
    if (e.target.closest(".suggestion-item")) {
      input.value = e.target.closest(".suggestion-item").textContent.trim();
      suggestionsList.innerHTML = "";
      enter();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  initializeSearchEngine();
});
