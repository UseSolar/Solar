const imageContainer = document.getElementById("image-container");

fetch("./assets/json/g.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((image) => {
      const imageElement = document.createElement("a");
      imageElement.href = image.src;

      const imgContainer = document.createElement("div");
      imgContainer.className = "image-container";

      const img = document.createElement("img");
      img.src = image.logo;
      img.alt = image.title || "ERROR";
      img.style.width = "150px";
      img.style.height = "150px";
      img.className = "image";

      const altText = document.createElement("div");
      altText.textContent = img.alt;

      imageElement.addEventListener("click", function (event) {
        event.preventDefault();
        if (!image.alert) {
          localStorage.setItem("Iframe", image.src);
          window.location.href = "./go.html";
        } else {
          alert(image.alert);
        }
      });

      imgContainer.appendChild(img);

      imageElement.appendChild(imgContainer);
      imageContainer.appendChild(imageElement);
    });

    updateGridLayout();
  })
  .catch((error) => {
    console.error("Error fetching JSON data:", error);
  });
