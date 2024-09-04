function getTimeZoneAbbreviation() {
  // Create a DateTimeFormat object for the user's locale
  const formatter = new Intl.DateTimeFormat("en-US", { timeZoneName: "short" });

  // Format a dummy date to get the timezone abbreviation
  const parts = formatter.formatToParts(new Date());

  // Extract the time zone abbreviation
  const timeZonePart = parts.find((part) => part.type === "timeZoneName");
  return timeZonePart ? timeZonePart.value : "unknown";
}

function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  const formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
  const timeZoneAbbreviation = getTimeZoneAbbreviation();
  const timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${period} ${timeZoneAbbreviation}`;
  document.getElementById("time").textContent = timeString;
}

updateTime();
setInterval(updateTime, 1000);
