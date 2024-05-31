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
  iframe.src = iframe.src;
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

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" || event.key === "Esc") {
    ff();
  }
});
