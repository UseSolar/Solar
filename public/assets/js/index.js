// Blank Tab
let inFrame;
const AB = localStorage.getItem("AB") || "on";
try {
  inFrame = window !== top;
} catch (e) {
  inFrame = true;
  localStorage.setItem("re", "true");
}
if (AB === "on") {
  if (!inFrame && !navigator.userAgent.includes("Firefox")) {
    const popup = open("about:blank", "_blank");
    if (!popup || popup.closed) {
      alert("Please allow popups and redirects for cloaking.");
      localStorage.setItem("re", "true");
    } else {
      const doc = popup.document;
      const iframe = doc.createElement("iframe");
      const style = iframe.style;
      const link = doc.createElement("link");

      const name = localStorage.getItem("name") || "Home - Google Drive";
      const icon =
        localStorage.getItem("icon") ||
        "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png";

      doc.title = name;
      link.rel = "icon";
      link.href = icon;

      iframe.src = location.href;
      style.position = "fixed";
      style.top = style.bottom = style.left = style.right = 0;
      style.border = style.outline = "none";
      style.width = "100vw";
      style.height = "100vh";

      doc.head.appendChild(link);
      doc.body.appendChild(iframe);

      const pLink =
        localStorage.getItem(encodeURI("pLink")) || "https://www.google.com";

      localStorage.setItem("re", "true");

      location.replace(pLink);
    }
  }
} else {
  console.log("Cloaking is off");
  localStorage.setItem("re", "true");
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js", { scope: __uv$config.prefix })
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

const input = document.getElementById("input");
input.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    enter();
  }
});

function enter() {
  let url = document.getElementById("input").value;
  let searchUrl = "https://www.google.com/search?q=";
  if (!url.includes(".")) {
    url = searchUrl + encodeURIComponent(url);
  } else {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }
  }

  localStorage.setItem(
    "Iframe",
    __uv$config.prefix + __uv$config.encodeUrl(url),
  );
  window.location.href = "./go.html";
}

// Favorites
document.addEventListener("DOMContentLoaded", () => {
  const addFavoriteButton = document.getElementById("add-favorite");
  const favoritesContainer = document.getElementById("favorites-container");

  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  const addFavorite = (url, nickname) => {
    if (!url.includes(".")) {
      alert("Please enter a valid URL including '.com or .org etc.'.");
      return;
    }

    const existingNickname = favorites.find(
      (favorite) => favorite.nickname === nickname,
    );
    if (existingNickname) {
      alert(
        `Nickname '${nickname}' is already in use. Please choose a different one.`,
      );
      return;
    }

    let ur = decodeURIComponent(url);
    let searchUrl = "https://www.google.com/search?q=";
    if (!ur.includes(".")) {
      ur = searchUrl + encodeURIComponent(ur);
    } else {
      if (!ur.startsWith("http://") && !ur.startsWith("https://")) {
        ur = "https://" + ur;
      }
    }

    const encodedUrl = __uv$config.prefix + __uv$config.encodeUrl(ur);
    favorites.push({ url: encodedUrl, nickname, orurl: url });
    localStorage.setItem("favorites", JSON.stringify(favorites));
    addFavoriteToDOM(encodedUrl, nickname, url);
  };

  const addFavoriteToDOM = (url, nickname, orurl) => {
    const favoriteItem = document.createElement("div");
    favoriteItem.className = "favorite-item";
    favoriteItem.innerHTML = `<img alt="favicon" src="https://www.google.com/s2/favicons?domain=${orurl}"><span>${nickname}</span>`;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "x";
    deleteButton.className = "delete-button";
    deleteButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const confirmDelete = confirm(
        "Are you sure you want to delete this favorite?",
      );
      if (confirmDelete) {
        deleteFavorite(url);
        favoritesContainer.removeChild(favoriteItem);
      }
    });

    favoriteItem.appendChild(deleteButton);

    favoriteItem.addEventListener("click", () => {
      localStorage.setItem("Iframe", url);
      window.location.href = `./go.html`;
    });

    favoritesContainer.appendChild(favoriteItem);
  };

  const deleteFavorite = (url) => {
    favorites = favorites.filter((favorite) => favorite.url !== url);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  };

  favorites.forEach((favorite) =>
    addFavoriteToDOM(favorite.url, favorite.nickname, favorite.orurl),
  );

  addFavoriteButton.addEventListener("click", () => {
    if (favorites.length >= 10) {
      alert("You can only add up to 10 favorites.");
      return;
    }

    const url = prompt(
      "Enter the URL of the site: (no need for https or www)",
    ).trim();
    if (!url) return;

    const nickname = prompt("Enter a nickname for the favorite:").trim();
    if (!nickname) return;

    addFavorite(url, nickname);
  });
});
