// Blank Tab
let inFrame;
const AB = localStorage.getItem("AB") || "on";
try {
  inFrame = window !== top;
} catch (e) {
  inFrame = true;
  localStorage.setItem("re", "true");
}
if (AB == "on") {
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

// Update Checker
function startUpdateCheck() {
  const checkInterval = setInterval(async () => {
    if (localStorage.getItem("re") === "true") {
      localStorage.removeItem("re");
      clearInterval(checkInterval);

      async function checkForUpdate(repoOwner, repoName, currentVersion) {
        const url = `https://api.github.com/repos/${repoOwner}/${repoName}/releases`;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error fetching releases: ${response.statusText}`);
          }
          const data = await response.json();

          const latestRelease = data.find(
            (release) => !release.draft && !release.prerelease,
          );
          if (latestRelease) {
            return latestRelease.name;
          } else {
            return null;
          }
        } catch (error) {
          console.error("An error occurred:", error);
          return null;
        }
      }

      (async () => {
        const currentVersion = document
          .getElementById("Version")
          .textContent.trim();
        const latestVersion = await checkForUpdate(
          "GoStarLight",
          "StarLight",
          currentVersion,
        );
        if (currentVersion === latestVersion) {
          console.log("Link is up to date!");
        } else {
          alert("This link is out of date, Please update it");
        }
      })();
    }
  }, 1000);
}

startUpdateCheck();

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
