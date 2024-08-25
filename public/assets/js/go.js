async function getData() {
  try {
    const response = await fetch("../assets/json/tabs.json");
    if (!response.ok) {
      alert("File not found");
    }
    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    throw error;
  }
}

async function cloak() {
  try {
    const data = await getData();

    openWindow(data);
  } catch (error) {
    console.error("Error in cloak function:", error);
    throw error;
  }

  function openWindow(data) {
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
}

cloak();

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
  let wispUrl =
    (location.protocol === "https:" ? "wss" : "ws") +
    "://" +
    location.host +
    "/w/";
  locationbar;
  if (localStorage.getItem("transtype") == "epoxy") {
    if ((await connection.getTransport()) !== "/e/index.mjs") {
      await connection.setTransport("/e/index.mjs", [{ wisp: wispUrl }]);
      console.log("Transport set to epoxy");
    }
  }
  let encUrl = localStorage.getItem("Iframe");
  iframe.src = encUrl;
  document.body.appendChild(iframe);
  setInterval(updateUrl, 1000);
  setInterval(updateF, 1000);
};

function updateF() {
  const contentWindow = iframe.contentWindow;

  const faviconLink = contentWindow.document.querySelector(
    "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']",
  );
  let faviconUrl = `${contentWindow.__uv$location.origin}/favicon.ico`;
  if (faviconLink instanceof HTMLLinkElement && faviconLink.href) {
    faviconUrl = faviconLink.href;
  }
  const defaultFaviconPaths = [
    "/favicon.ico",
    "/apple-touch-icon.png",
    "/apple-touch-icon-precomposed.png",
  ];
  function updateFaviconDisplay(url) {
    const faviconDiv = document.getElementById("favicon");
    if (faviconDiv) {
      faviconDiv.style.backgroundImage = `url(${url})`;
    }
  }
  function handleFaviconError() {
    updateFaviconDisplay(
      "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjZGQ2ZjQiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1nbG9iZSI+PGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiLz48cGF0aCBkPSJNMTIgMmExNC41IDE0LjUgMCAwIDAgMCAyMCAxNC41IDE0LjUgMCAwIDAgMC0yMCIvPjxwYXRoIGQ9Ik0yIDEyaDIwIi8+PC9zdmc+",
    );
  }
  function loadFaviconFromPaths(paths, index) {
    if (index >= paths.length) {
      handleFaviconError();
      return;
    }

    const faviconUrl = `${contentWindow.__uv$location.origin}${paths[index]}`;
    const img = new Image();
    img.onload = function () {
      updateFaviconDisplay(faviconUrl);
    };
    img.onerror = function () {
      loadFaviconFromPaths(paths, index + 1);
    };
    img.src = faviconUrl;
  }

  loadFaviconFromPaths(defaultFaviconPaths, 0);
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
