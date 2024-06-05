window.addEventListener("load", () => {
  navigator.serviceWorker
    .register("./sw.js")
    .then(() => {
      navigator.serviceWorker.ready.then(() => {
        console.log("Successfully Registered Service Workers");
      });
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
});

const imageContainer = document.getElementById("image-container");

fetch("./assets/json/g.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((image) => {
      const imageElement = document.createElement("a");
      const imgContainer = document.createElement("div");
      imgContainer.className = "image-container";

      const img = document.createElement("img");
      img.src = image.logo;
      img.alt = image.title || "ERROR";
      img.style.width = "150px";
      img.style.height = "150px";
      img.className = "classy";

      const altText = document.createElement("div");
      altText.textContent = image.title;
      altText.style.color = "white";
      altText.style.textAlign = "center";
      altText.style.marginTop = "10px";

      imageElement.addEventListener("click", function (event) {
        event.preventDefault();
        if (!image.alert) {
          if (!image.redirect) {
            let url = image.link;
            localStorage.setItem(
              "Iframe",
              __uv$config.prefix + __uv$config.encodeUrl(url),
            );
            window.location.href = "go.html";
          } else {
            window.open(image.redirect);
          }
        } else {
          alert(image.alert);
        }
      });

      imgContainer.appendChild(img);
      imgContainer.appendChild(altText);

      imageElement.appendChild(imgContainer);
      imageContainer.appendChild(imageElement);
    });
  })
  .catch((error) => {
    console.error("Error fetching JSON data:", error);
  });
