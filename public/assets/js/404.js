function re() {
  const url = new URL(window.location.href);
  url.pathname = "/index.html";
  window.location.href = url.href;
}
