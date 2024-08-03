window.addEventListener("load", () => {
  navigator.serviceWorker
    .register("./sw.js?v=3")
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

fetch("./assets/json/g.json?v=3")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((image) => {
      const imageElement = document.createElement("a");
      const imgContainer = document.createElement("div");
      imgContainer.className = "image-container";

      const img = document.createElement("img");
      img.src = image.logo;
      img.alt = image.title || "ERROR";
      img.style.width = "138px";
      img.style.height = "138px";
      img.className = "classy";

      const altText = document.createElement("div");
      altText.className = "game-name";
      altText.textContent = image.title;
      altText.style.textAlign = "center";
      altText.style.marginTop = "10px";

      imageElement.addEventListener("click", function (event) {
        gtag("event", "click", {
          event_category: "Game Click",
          event_label: image.title,
        });
      });

      imgContainer.addEventListener("click", function (event) {
        event.preventDefault();
        if (!image.alert) {
          if (!image.redirect) {
            let url = image.link;
            localStorage.setItem(
              "Iframe",
              __uv$config.prefix + __uv$config.encodeUrl(url),
            );
            window.location.href = "./g";
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

const searchBox = document.getElementById("search-input");
const imagesContainer = document.getElementById("image-container");

searchBox.addEventListener("keyup", function () {
  const searchTerm = this.value.toLowerCase();
  const images = imagesContainer.querySelectorAll("img");

  images.forEach(function (image) {
    const altText = image.alt.toLowerCase();
    const parentLink = image.parentElement.parentElement;

    if (altText.includes(searchTerm)) {
      parentLink.style.display = "block";
    } else {
      parentLink.style.display = "none";
    }
  });

  updateGridLayout();
});

// Update Game Layout
function updateGridLayout() {
  const imageElements = Array.from(
    document.querySelectorAll("#image-container > a"),
  );
  const visibleImageElements = imageElements.filter(
    (imageElement) => imageElement.style.display !== "none",
  );
  const containerWidth = imageContainer.clientWidth;
  const imageWidth = 150;
  const numColumns = Math.floor(containerWidth / imageWidth);

  imageContainer.style.gridTemplateColumns = `repeat(auto-fill, minmax(${imageWidth}px, 1fr))`;
}
