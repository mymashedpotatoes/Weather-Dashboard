var APIKey = "1827487889e6d87c08a61605c2d75f04";
const searchBtn = document.querySelector("#search-button");
const clearBtn = document.getElementById("clear-history");

var weatherContainerEl = document.querySelector("#current-weather");
var weatherSearchTerm = document.querySelector("#weather-search-term");
var currentPicEl = document.getElementById("current-pic");
var humidEl = document.getElementById('humid');
var windEl = document.getElementById('wind');
var main = document.getElementById('main');
var cityName = document.getElementById("city-name");
var fiveDayForecast = document.querySelector("#five-day");
var inputCity = document.getElementById("city-input").value;

//function to get weather data
function getWeather(city) {
  var inputCity = document.getElementById("city-input").value;
  const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=`+inputCity+`&limit=5&appid=`+APIKey;

  fetch(geocodingUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const geoLon = data[0].lon;
      const geoLat = data[0].lat;
      const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=`+geoLat+`&lon=`+geoLon+`&appid=`+APIKey;

      fetch(weatherUrl)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          displayCurrentWeather(data);
          displayFiveDayForecast(data);
        })
    })
}

//function to display current weather
function displayCurrentWeather(data) {
  console.log(data);

  var date = dayjs().format('MM/DD/YYYY');
  const name = document.createElement("h");
  name.classList.add("name");
  name.textContent = (data.city.name + " " + date);
  console.log(name);
  cityName.appendChild(name);


  var tempEl = document.getElementById('temp');
  tempEl.innerHTML = "Temperature: " + k2f(data.list[0].main.temp) + "\u00B0 F";
  console.log(tempEl);

  var windEl = document.getElementById('wind');
  windEl.innerHTML = "Wind: " + data.list[0].wind.speed + " MPH";
  console.log(windEl);

  var humidEl = document.getElementById('humid');
  humidEl.innerHTML = "Humidity: " + data.list[0].main.humidity + "%";
  console.log(humidEl);

  var weatherPic = data.list[0].weather[0].icon;
  var currentPicEl = document.getElementById('current-pic');
  currentPicEl.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
  currentPicEl.setAttribute("alt", data.list[0].weather[0].description);
  console.log(weatherPic);
}

//function to display 5-day forecast
// function displayFiveDayForecast(data) {
// }

//function to display search history
// function displaySearchHistory(cityHistory) {
// }

//function to handle click on search button
function handleSearchButtonClick(event) {
  event.preventDefault();
  const inputCity = document.getElementById("city-input").value.trim();
  if (inputCity !== "") {
    getWeather(inputCity);
  }
}



//function to handle click on any history button
// function handleHistoryButtonClick(city) {
//   getWeather(city);
// }

//function to convert k to f
function k2f(K) {
  return Math.floor((K - 273.15) * 1.8 + 32);
}

//event listeners
searchBtn.addEventListener('click', handleSearchButtonClick);
// historyBtn.addEventListener('click', )

//initial display of search history
displaySearchHistory();
