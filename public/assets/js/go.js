const GoTitle = document.getElementById("gt");
const iframe = document.createElement("iframe");
window.onload = function () {
  var encUrl = localStorage.getItem("Iframe");
  iframe.className = "iframe";
  iframe.sandbox =
    "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-same-origin allow-scripts";
  iframe.id = "iframeWindow";
  iframe.src = encUrl;
  document.body.appendChild(iframe);
  setInterval(TU, 1000);
};

function TU() {
  document.getElementById("gt").textContent = iframe.contentDocument.title;
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

function ff() {
  if (iframe.fullscreenElement) {
    iframe.exitFullscreen();
  } else iframe.requestFullscreen();
}
function fav() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const addFavorite = (url, nickname) => {
    const existingNickname = favorites.find(
      (favorite) => favorite.nickname === nickname,
    );
    if (existingNickname) {
      alert(
        `Nickname '${nickname}' is already in use. Please choose a different one.`,
      );
      return;
    }

    favorites.push({ url, nickname });
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  const nickname = prompt("Enter a nickname for the favorite:").trim();
  if (!nickname) return;

  const url = iframe.contentWindow.location.href;
  addFavorite(url, nickname);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    ff();
  }
});
