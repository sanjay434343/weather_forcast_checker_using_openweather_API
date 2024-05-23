
  const apiKey = "97ed86b99fdcf738c7a080e0fa9fde20";
  const weatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?&units=metric&q=";
  const uvIndexApiKey = "2b758adf793858c56dcc8374e1458cb0";
  const uvIndexApiUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${uvIndexApiKey}`;
  const airQualityApiKey = "675f28f8b2msh14170ae5bfaf7fdp1840f1jsna9cfabde7ef0";
  const airQualityApiUrl = "https://air-quality.p.rapidapi.com/current/airquality";
  
  async function fetchWeather(city) {
  const response = await fetch(weatherApiUrl + city + "&appid=" + apiKey);
  const data = await response.json();
  return data;
  }
  
  async function fetchUVIndex(latitude, longitude) {
  const response = await fetch(`${uvIndexApiUrl}&lat=${latitude}&lon=${longitude}`);
  const data = await response.json();
  return data.value;
  }
  
  async function fetchAirQuality(latitude, longitude) {
  const options = {
  method: 'GET',
  url: airQualityApiUrl,
  params: {
  lon: longitude,
  lat: latitude
  },
  headers: {
  'X-RapidAPI-Key': airQualityApiKey,
  'X-RapidAPI-Host': 'air-quality.p.rapidapi.com'
  }
  };
  
  try {
  const response = await axios.request(options);
  return response.data;
  } catch (error) {
  console.error("Error fetching air quality data:", error);
  throw error; // Throw the error to handle it in the calling function
  }
  }
  
  async function updateWeatherInfo(city) {
  try {
  const weatherData = await fetchWeather(city);
  let uvIndex = "N/A";
  let visibility = "N/A";
  
  if (weatherData.coord) {
  uvIndex = await fetchUVIndex(weatherData.coord.lat, weatherData.coord.lon);
  }
  
  visibility = weatherData.visibility;
  
  const currentTime = new Date().getTime() / 1000;
  const sunriseTime = weatherData.sys.sunrise;
  const sunsetTime = weatherData.sys.sunset;
  const isNight = currentTime < sunriseTime || currentTime > sunsetTime;
  
  document.getElementById("temp").textContent = Math.round(weatherData.main.temp);
  document.getElementById("rain").textContent = "perc: " + weatherData.main.humidity + "%";
  document.getElementById("location").textContent = weatherData.name;
  document.getElementById("date-time").textContent = new Date(weatherData.dt * 1000).toLocaleString("en-US", { weekday: "long", hour: "numeric", minute: "numeric", hour12: true });
  document.getElementById("icon").src = getIcon(weatherData.weather[0].icon, isNight);
  
  document.querySelector('.uv-index').textContent = " " + uvIndex;
  document.querySelector('.wind-speed').textContent = "" + weatherData.wind.speed + "";
  
  const sunriseTimeFormatted = new Date(sunriseTime * 1000).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
  const sunsetTimeFormatted = new Date(sunsetTime * 1000).toLocaleString("en-US", { hour: "numeric", minute: "numeric", hour12: true });
  document.querySelector('.sun-rise').textContent = "" + sunriseTimeFormatted;
  document.querySelector('.sun-set').textContent = "" + sunsetTimeFormatted;
  
  document.querySelector('.humidity').textContent = " " + weatherData.main.humidity + "%";
  document.querySelector('.humidity-status').textContent = "Humidity Status: " + getHumidityStatus(weatherData.main.humidity);
  
  const visibilityValueElement = document.querySelector('.visibility');
  const visibilityStatusElement = document.querySelector('.visibility-status');
  
  visibilityValueElement.textContent = "" + visibility/1000;
  visibilityStatusElement.textContent = "Status: " + updateVisibilityStatus(visibility);
  
  changeBackground(weatherData.weather[0].icon, isNight); // Pass isNight variable to changeBackground
  } catch (error) {
  console.error("Error fetching weather data:", error);
  }
  }
  
  async function updateAirQualityInfo(city) {
  try {
  const weatherData = await fetchWeather(city);
  const airQualityData = await fetchAirQuality(weatherData.coord.lat, weatherData.coord.lon);
  
  document.querySelector('.air').textContent = airQualityData.data[0].aqi;
  document.querySelector('.air-quality').textContent = airQualityData.data[0].category;
  } catch (error) {
  console.error("Error updating air quality info:", error);
  }
  }
  
  function getIcon(condition, isNight) {
  if (isNight) {
  return "night1.gif";
  } else {
  if (condition === "partly-cloudy-day") {
  return "cloud.gif";
  } else if (condition === "partly-cloudy-night") {
  return "night.gif";
  } else if (condition === "rain") {
  return "rain";
  } else if (condition === "clear-day") {
  return "sun.gif";
  } else if (condition === "clear-night") {
  return "night.gif";
  } else {
  return "sun.gif";
  }
  }
  }
  
  function changeBackground(condition, isNight) {
  const body = document.querySelector("body");
  let bg = "";
  
  if (isNight) {
  bg = "pexels-pedro-cunha-7436790.jpg"; // Night background image URL
  } else {
  if (condition === "partly-cloudy-day") {
  bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
  } else if (condition === "partly-cloudy-night") {
  bg = "partly-cloudy-night.jpg";
  } else if (condition === "rain") {
  bg = "rain.jpg";
  } else if (condition === "clear-day") {
  bg = "clear-day.jpg"; // Clear day background image URL
  } else if (condition === "clear-night") {
  bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
  } else {
  bg = "mrng.jpg";
  }
  }
  body.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bg})`;
  }
  
  
  function getHumidityStatus(humidity) {
  if (humidity < 30) {
  return "Dry";
  } else if (humidity >= 30 && humidity <= 60) {
  return "Normal";
  } else {
  return "Humid";
  }
  }
 // Example visibility value
  
  // Function to update visibility status
  function updateVisibilityStatus(visibility) {
  let visibilityStatus = "";
  
  if (visibility <= 0.03) {
  visibilityStatus = "Dense Fog";
  } else if (visibility <= 0.16) {
  visibilityStatus = "Moderate Fog";
  } else if (visibility <= 0.35) {
  visibilityStatus = "Light Fog";
  } else if (visibility <= 1.13) {
  visibilityStatus = "Very Light Fog";
  } else if (visibility <= 2.16) {
  visibilityStatus = "Light Mist";
  } else if (visibility <= 5.4) {
  visibilityStatus = "Very Light Mist";
  } else if (visibility <= 10.8) {
  visibilityStatus = "Clear Air";
  } else {
  visibilityStatus = "Light Mist";
  }
  
  return visibilityStatus;
  }
  
  
  document.getElementById("search").addEventListener("submit", function (event) {
  event.preventDefault();
  const city = document.getElementById("query").value;
  updateWeatherInfo(city);
  updateAirQualityInfo(city);
  document.getElementById("query").value = "";
  });
  
  window.addEventListener("load", () => {
  // Default location when the page loads
  const defaultCity = "russia";
  updateWeatherInfo(defaultCity);
  updateAirQualityInfo(defaultCity);
  });
  
  // Additional function to get public IP and update weather data
  function getPublicIp() {
  fetch("https://geolocation-db.com/json/", {
  method: "GET",
  headers: {},
  })
  .then((response) => response.json())
  .then((data) => {
  currentCity = data.city;
  getWeatherData(data.city, currentUnit, hourlyorWeek);
  })
  .catch((err) => {
  console.error(err);
  });
  }
  