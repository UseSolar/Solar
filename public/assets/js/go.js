const GoTitle = document.getElementById("gt");
const iframe = document.createElement("iframe");

iframe.className = "iframe";
iframe.sandbox =
  "allow-forms allow-modals allow-orientation-lock allow-pointer-lock allow-same-origin allow-scripts";
iframe.id = "iframeWindow";

window.onload = async function () {
  let connection = new BareMux.BareMuxConnection("/b/worker.js");
  let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/w/";
	if (await connection.getTransport() !== "/e/index.mjs") {
		await connection.setTransport("/e/index.mjs", [{ wisp: wispUrl }]);
	}
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
