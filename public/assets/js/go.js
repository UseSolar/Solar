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
  const tabimg = document.getElementById("favicon");
  if (!tabimg) {
    console.error('Element with id "tabimg" not found.');
    return;
  }
  const imageUrl = "./assets/img/fail.png";
  tabimg.style.backgroundImage = `url("${imageUrl}")`;
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
  if (!iframe || !iframe.contentWindow) {
    console.error('Iframe or its contentWindow not found.');
    return;
  }

  const origin = iframe.contentWindow.__uv$location.origin;
  const faviconUrl = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${origin}/&size=256`;
  const fallbackImageUrl = `./assets/img/fail.png`;  

  function checkFavicon(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(url);
      img.onerror = () => reject(url);
      img.src = url;
    });
  }

  checkFavicon(faviconUrl)
    .then((validUrl) => {
      document.getElementById('favicon').style.backgroundImage = `url(${validUrl})`;
    })
    .catch(() => {
      document.getElementById('favicon').style.backgroundImage = `url(${fallbackImageUrl})`;
    });
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
