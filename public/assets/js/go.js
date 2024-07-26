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

const iframe = document.createElement("iframe");
iframe.className = "iframe";
iframe.sandbox =
  "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-same-origin allow-scripts";
iframe.id = "iframeWindow";
document.body.appendChild(iframe);

function setBackground() {
  const tabimg = document.getElementById("tabimg");
  tabimg.style.backgroundImage = `url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhP...`;
}

window.onload = async function () {
  setBackground();

  let connection = new BareMux.BareMuxConnection("/b/worker.js");
  let bareUrl = `${location.protocol}//${location.host}/bs/`;

  if ((await connection.getTransport()) !== "/bm/index.mjs") {
    await connection.setTransport("/bm/index.mjs", [bareUrl]);
  }

  let encUrl = localStorage.getItem("Iframe");
  iframe.src = encUrl;

  setInterval(updateUrl, 1000);
  setInterval(updateFavicon, 1000);
};

function updateFavicon() {
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

  function loadFaviconFromPaths(paths, index = 0) {
    if (index >= paths.length) {
      handleFaviconError();
      return;
    }

    const faviconUrl = `${contentWindow.__uv$location.origin}${paths[index]}`;
    const img = new Image();
    img.onload = () => updateFaviconDisplay(faviconUrl);
    img.onerror = () => loadFaviconFromPaths(paths, index + 1);
    img.src = faviconUrl;
  }

  loadFaviconFromPaths(defaultFaviconPaths);
}

let previousUrl = "";
function updateUrl() {
  const currentUrl = iframe.contentWindow.__uv$location.href;
  const searchInput = document.getElementById("search-input");

  if (currentUrl !== previousUrl) {
    searchInput.value = currentUrl;
    previousUrl = currentUrl;
  }
}

function refresh() {
  iframe.src = iframe.contentWindow.location.href;
}

function home() {
  window.location.href = "./";
}

function forward() {
  iframe.contentWindow.history.forward();
}

function back() {
  iframe.contentWindow.history.back();
}

function toggleFullScreen() {
  document.fullscreenElement
    ? document.exitFullscreen()
    : document.documentElement.requestFullscreen();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" || event.key === "Esc") {
    toggleFullScreen();
  }
});

document.getElementById("search-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    enter();
  }
});

function enter() {
  let input = document.getElementById("search-input").value.trim();
  const urlRegex = /^(https?:\/\/)?(?:\w+\.)+\w{2,}(?:\/\S*)?$/;
  let url;

  if (urlRegex.test(input)) {
    url = input.includes("://") ? input : `https://www.${input}`;
  } else {
    const baseUrl =
      localStorage.getItem("se") || "https://www.google.com/search?q=";
    url = `${baseUrl}${input}`;
  }

  localStorage.setItem(
    "Iframe",
    __uv$config.prefix + __uv$config.encodeUrl(url),
  );
  iframe.src = localStorage.getItem("Iframe");
}
