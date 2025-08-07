const apiKey = "a92ed0625c0dac2242e6425ea2f3ea53"; 

const searchBtn = document.getElementById("searchbtn");
const cityInput = document.getElementById("cityInput");

const weatherIcon = document.querySelector(".weather.main img");
const tempDiv = document.querySelector(".temp");
const conditionDiv = document.querySelector(".condition");
const locationDiv = document.querySelector(".location");
const datetimeDiv = document.querySelector(".datetime");

const extrainfoBoxes = document.querySelectorAll(".extrainfo .box span");
const forecastContainer = document.querySelector(".forecast");

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  } else {
    alert("Please enter a city name.");
  }
});

async function fetchWeather(city) {
  try {
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!weatherRes.ok) throw new Error("City not found");

    const weatherData = await weatherRes.json();

    // Update current weather
    const icon = weatherData.weather[0].icon;
    const temp = Math.round(weatherData.main.temp);
    const feelsLike = Math.round(weatherData.main.feels_like);
    const condition = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const wind = weatherData.wind.speed;
    const pressure = weatherData.main.pressure;
    const location = `${weatherData.name}, ${weatherData.sys.country}`;

    const date = new Date();
    const formattedDate = date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    tempDiv.textContent = `${temp}°C`;
    conditionDiv.textContent = capitalizeWords(condition);
    locationDiv.textContent = location;
    datetimeDiv.textContent = formattedDate;

    extrainfoBoxes[0].textContent = `${feelsLike}°C`;
    extrainfoBoxes[1].textContent = `${humidity}%`;
    extrainfoBoxes[2].textContent = `${wind} km/h`;
    extrainfoBoxes[3].textContent = `${pressure} hPa`;

    // Fetch forecast
    fetchForecast(city);
  } catch (err) {
    alert(err.message);
  }
}

async function fetchForecast(city) {
  const forecastRes = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
  );
  const data = await forecastRes.json();

  const forecastMap = {};
  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!forecastMap[date] && item.dt_txt.includes("12:00:00")) {
      forecastMap[date] = item;
    }
  });

  const dailyForecasts = Object.values(forecastMap).slice(0, 5);

  forecastContainer.innerHTML = "";

  dailyForecasts.forEach((day) => {
    const icon = day.weather[0].icon;
    const temp = Math.round(day.main.temp);
    const date = new Date(day.dt_txt);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

    const card = document.createElement("div");
    card.className = "forecast-card";
    card.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="">
      <div>${weekday}</div>
      <div>${temp}°C</div>
    `;
    forecastContainer.appendChild(card);
  });
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}