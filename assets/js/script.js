var APIKey = "1827487889e6d87c08a61605c2d75f04";
const searchBtn = document.querySelector("#search-button");

var weatherContainerEl = document.querySelector("#current-weather");
var weatherSearchTerm = document.querySelector("#weather-search-term");
var main = document.getElementById('main');
var cityName = document.getElementById("city-name");
var fiveDayForecast = document.querySelector("#five-day");

//function to get weather data
function getWeather(inputCity) {

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

  //clear previous data before adding new data
  weatherContainerEl.innerHTML = "";
  cityName.textContent = "";

  var date = dayjs().format('MM/DD/YYYY');
  var name = document.createElement("h");
  name.classList.add("name");
  name.textContent = (data.city.name + " " + date);
  cityName.appendChild(name);

  var tempEl = document.createElement('div');
  tempEl.textContent = "Temperature: " + k2f(data.list[0].main.temp) + "\u00B0 F";

  var windEl = document.createElement('div');
  windEl.textContent = "Wind: " + data.list[0].wind.speed + " MPH";

  var humidEl = document.createElement('div');
  humidEl.textContent = "Humidity: " + data.list[0].main.humidity + "%";

  weatherContainerEl.appendChild(tempEl);
  weatherContainerEl.appendChild(windEl);
  weatherContainerEl.appendChild(humidEl);

  displaySearchHistory();
}

//function to display 5-day forecast
function displayFiveDayForecast(data) {
  const currentDate = dayjs(); 
  //clear previous data before adding new data
  fiveDayForecast.innerHTML = "";

  for (var i = 4; i < data.list.length; i += 8) {

    console.log(data.list.length);
    var futureForecast = data.list[i];

    const card = document.createElement("div");
    card.classList.add('card');

    const cardContent = document.createElement("div");
    cardContent.classList.add('card-content');

    const futureDay = currentDate.add(i / 8, 'day').format('MM/DD/YYYY'); 
    const futureDateElement = document.createElement("h4");
    futureDateElement.classList.add('future-info');
    futureDateElement.textContent = futureDay;
    cardContent.appendChild(futureDateElement);
    fiveDayForecast.appendChild(cardContent);

    const futureIcon = document.createElement("img");
    const futurepicEl = futureForecast.weather[0].icon;
    futureIcon.classList.add('future-info');
    futureIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + futurepicEl + "@2x.png");
    cardContent.appendChild(futureIcon);

    const futureTemp = document.createElement("div");
    futureTemp.classList.add('future-info');
    futureTemp.textContent = "Temp: " + k2f(futureForecast.main.temp) + "\u00B0 F";
    cardContent.appendChild(futureTemp);

    const futureWind = document.createElement("div");
    futureWind.classList.add('future-info');
    futureWind.textContent = "Wind: " + futureForecast.wind.speed + " MPH";
    cardContent.appendChild(futureWind);

    const futureHumid = document.createElement("div");
    futureHumid.classList.add('future-info');
    futureHumid.textContent = "Humidity: " + futureForecast.main.humidity + "%";
    cardContent.appendChild(futureHumid);

    card.appendChild(cardContent);
    fiveDayForecast.appendChild(card);
  }
}

//function to display search history
function displaySearchHistory() {
  var searchBtns = document.getElementById("search-history");
  searchBtns.innerHTML = "";
  var inputCity = document.getElementById("city-input").value.trim(); 
  var cityHistory = JSON.parse(localStorage.getItem("city")) || [];

  if (inputCity !== "") {
    console.log(inputCity);
    cityHistory.push(inputCity);
    cityHistory = cityHistory.slice(-8); 
    localStorage.setItem("city", JSON.stringify(cityHistory));
  }

  cityHistory.forEach(function (city) {
    var button = document.createElement("button");
    button.classList.add('history-buttons');
    button.textContent = city;

    searchBtns.appendChild(button);

    button.addEventListener("click", function() {
      var historyCity = $(this).text();
      console.log(historyCity);
      getWeather(historyCity);
    });
  });
}

//function to handle click on search button
function handleSearchButtonClick(event) {
  event.preventDefault();
  const inputCity = document.getElementById("city-input").value;
  if (inputCity !== "") {
    getWeather(inputCity);
  }
}

//function to convert k to f
function k2f(K) {
  return Math.floor((K - 273.15) * 1.8 + 32);
}

//event listeners
searchBtn.addEventListener('click', handleSearchButtonClick);


//initial display of search history
displaySearchHistory();
