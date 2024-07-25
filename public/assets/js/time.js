function updateTime() {
  var now = new Date();
  var hours = now.getHours();
  var minutes = now.getMinutes();
  var period = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var timeString = hours + ":" + minutes + " " + period;
  document.getElementById("time").textContent = timeString;
}
updateTime();
setInterval(updateTime, 1000);
