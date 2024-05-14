window.onload = function () {
  var encUrl = localStorage.getItem("Iframe");
  var iframe = document.createElement("iframe");
  iframe.className = "iframe";
  iframe.src = encUrl;
  document.body.appendChild(iframe);
  document.body.style.overflow = "hidden";
};
