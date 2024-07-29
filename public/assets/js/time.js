function updateTime() {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const timeString = `${hours}:${minutes} ${period}`;
  document.getElementById("time").textContent = timeString;
}

updateTime();
setInterval(updateTime, 1000);
