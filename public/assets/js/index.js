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
        __uv$config.prefix + __uv$config.encodeUrl(url),
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
        __uv$config.prefix + __uv$config.encodeUrl(url),
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
  localStorage.setItem("transtype", "epoxy");
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
    __uv$config.prefix + __uv$config.encodeUrl(url),
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
document
  .getElementById("search-engine")
  .addEventListener("change", function (event) {
    const { value: selectedOption } = event.target;
    const searchEngines = {
      brave: "https://search.brave.com/search?q=",
      google: "https://www.google.com/search?q=",
      bing: "https://www.bing.com/search?q=",
      duckduckgo: "https://duckduckgo.com/?q=",
    };
    const placeholders = {
      brave: "Search with Brave or with a URL",
      google: "Search with Google or with a URL",
      bing: "Search with Bing or with a URL",
      duckduckgo: "Search with DuckDuckGo or with a URL",
    };

    if (searchEngines[selectedOption]) {
      localStorage.setItem("se", searchEngines[selectedOption]);
      localStorage.setItem("sevalue", selectedOption);
      document.getElementById("search-input").placeholder =
        placeholders[selectedOption];
    }
  });

document.getElementById("search-input").addEventListener("click", (event) => {
  const input = event.target;
  const imageWidth = 24;
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
  "Search with " + localStorage.getItem("sevalue") + " or with a url";

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
          `<li><div class="suggestion-item"><img class="search-icon" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjZGQ2ZjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1zZWFyY2giPjxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiLz48cGF0aCBkPSJtMjEgMjEtNC4zLTQuMyIvPjwvc3ZnPg==" alt="StarLight">${suggestion}</div></li>`,
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
});

function toggleSettingsMenu() {
  const menu = document.getElementById("settings-menu");
  const isVisible = menu.classList.toggle("visible");
  localStorage.setItem("getsetvis", isVisible);
}

function toggleFeature() {
  const button = document.getElementById("toggle-btn");
  if (button.textContent === "On") {
    button.textContent = "Off";
    localStorage.setItem("abcloak", "0");
    console.error("abcloak is off");
  } else {
    button.textContent = "On";
    localStorage.setItem("abcloak", "1");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const getsetvis = localStorage.getItem("getsetvis");
  if (getsetvis === "true") {
    toggleSettingsMenu();
  }

  const abcloak = localStorage.getItem("abcloak");
  const button = document.getElementById("toggle-btn");
  if (abcloak === "1") {
    button.textContent = "On";
  } else {
    button.textContent = "Off";
  }

  document
    .getElementById("settings")
    .addEventListener("click", toggleSettingsMenu);
  button.addEventListener("click", toggleFeature);
});
