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
