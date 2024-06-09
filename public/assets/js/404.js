function re() {
  const url = new URL(window.location.href);
  url.pathname = "/index.html?v=1";
  window.location.href = url.href;
}
