if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js?v=3", { scope: __uv$config.prefix })
      .then((registration) =>
        console.log(
          "Service Worker registered with scope:",
          registration.scope,
        ),
      )
      .catch((error) =>
        console.error("Service Worker registration failed:", error),
      );
  });
}

const tabimg = document.getElementById("tabimg");
const iframe = document.createElement("iframe");
iframe.className = "iframe";
iframe.sandbox =
  "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-same-origin allow-scripts";
iframe.id = "iframeWindow";

window.onload = async function () {
  tabimg.style.backgroundImage = `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXBhbmVsLXJpZ2h0Ij48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIi8+PHBhdGggZD0iTTE1IDN2MTgiLz48L3N2Zz4=")`;
  let connection = new BareMux.BareMuxConnection("/b/worker.js");
  let bareUrl =
    (location.protocol === "https:" ? "https" : "http") +
    "://" +
    location.host +
    "/bs/";
  if ((await connection.getTransport()) !== "/bm/index.mjs") {
    await connection.setTransport("/bm/index.mjs", [bareUrl]);
  }
  let encUrl = localStorage.getItem("Iframe");
  iframe.src = encUrl;
  document.body.appendChild(iframe);
  setInterval(updateUrl, 1000);
  setInterval(updateF, 1000);
};

function updateF() {
  const contentWindow = iframe.contentWindow;
  const faviconLink = contentWindow.document.querySelector("link[rel*='icon']");
  let faviconUrl = `${contentWindow.__uv$location.origin}/favicon.ico`;

  if (faviconLink instanceof HTMLLinkElement) {
    faviconUrl = faviconLink.href;
  }

  const faviconDiv = document.getElementById("favicon");
  if (faviconDiv) {
    faviconDiv.style.backgroundImage = `url(${faviconUrl})`;
  }
}

let previousUrl = "";
function updateUrl() {
  const currentUrl = iframe.contentWindow.__uv$location.href;
  const inpute = document.getElementById("search-input");
  if (currentUrl !== previousUrl) {
    inpute.value = `${currentUrl}`;
  }
  previousUrl = currentUrl;
}

function refresh() {
  iframe.src = iframe.contentWindow.location.href;
}

function home() {
  window.location.href = "./";
}

function forw() {
  iframe.contentWindow.history.forward();
}

function ba() {
  iframe.contentWindow.history.back();
}

function toggleFullScreen() {
  iframe.fullscreenElement
    ? iframe.exitFullscreen()
    : iframe.requestFullscreen();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    toggleFullScreen();
  }
});

const inpu = document.getElementById("search-input");
inpu.addEventListener("keydown", function (event) {
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
    if (!input.includes(".") || !input.includes("https")) {
      url = "https://www." + input;
    } else {
      if (!input.includes("www.")) {
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
  encUrl = localStorage.getItem("Iframe");
  iframe.src = encUrl;
  document.body.appendChild(iframe);
}

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
