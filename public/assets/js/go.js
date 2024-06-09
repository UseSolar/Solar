const GoTitle = document.getElementById("gt");
const iframe = document.createElement("iframe");

iframe.className = "iframe";
iframe.sandbox =
  "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-same-origin allow-scripts";
iframe.id = "iframeWindow";

window.onload = function () {
  const encUrl = localStorage.getItem("Iframe");
  iframe.src = encUrl;
  document.body.appendChild(iframe);
  setInterval(updateTitle, 1000);
};

function updateTitle() {
  GoTitle.textContent = iframe.contentDocument.title;
}

function refresh() {
  iframe.src = iframe.contentWindow.location.href;
}

function forw() {
  iframe.contentWindow.history.forward();
}

function ba() {
  iframe.contentWindow.history.back();
}

window.addEventListener("unload", function (event) {
  var url = iframe.contentWindow.location.href;
  var parts = url.split("/");
  var index = parts.indexOf("p");
  var desiredSegment = parts[index + 1];
  localStorage.setItem("Iframe", "/p/" + desiredSegment);
});

function toggleFullScreen() {
  if (iframe.fullscreenElement) {
    iframe.exitFullscreen();
  } else {
    iframe.requestFullscreen();
  }
}

function addFavorite() {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const nickname = prompt("Enter a nickname for the favorite:")?.trim();
  if (!nickname) return;

  const existingNickname = favorites.find(
    (favorite) => favorite.nickname === nickname,
  );
  if (existingNickname) {
    alert(
      `Nickname '${nickname}' is already in use. Please choose a different one.`,
    );
    return;
  }

  const url = iframe.contentWindow.location.href;
  favorites.push({ url, nickname });
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    toggleFullScreen();
  }
});

function toggleEruda() {
  let erudaLoaded = false;
  let erudaActive = false;
  const iframe = document.getElementById("iframe");
  const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

  if (!erudaLoaded) {
    const erudaScript = iframeDoc.createElement("script");
    erudaScript.src = "https://cdn.jsdelivr.net/npm/eruda";
    erudaScript.onload = () => {
      erudaLoaded = true;
      toggleEruda(iframe);
    };
    iframeDoc.head.appendChild(erudaScript);
  } else {
    toggleEruda(iframe);
  }

  function toggleEruda(iframe) {
    if (erudaActive) {
      iframe.contentWindow.eruda.destroy();
      erudaActive = false;
    } else {
      iframe.contentWindow.eruda.init();
      erudaActive = true;
    }
  }
}
