window.onload = function() {
    var encUrl = localStorage.getItem("Iframe")
    var iframe = document.createElement("iframe");
    iframe.style.position = "absolute";
    iframe.style.left = "0";
    iframe.style.top = "0";
    iframe.style.width = "100vw";
    iframe.style.height = "100vh";
    iframe.style.border = "none";
    iframe.style.margin = "0";
    iframe.style.padding = "0";
    iframe.src = encUrl;
    document.body.appendChild(iframe);
    document.body.style.overflow = "hidden";
};
