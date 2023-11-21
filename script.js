var apiKey = 'f7c66ffe644401d7238738bdf7366e40';
var forecastHeader = document.querySelector('.forecastheader');
var forecastCards = document.querySelector('#forecastcards');
var currentDay = document.getElementById('currentDay');
var newCities = document.querySelector('#newCities');
var removeButton = document.querySelector('#remove-button');
var dateDisplayElement = document.querySelector('#date-display');
var userInput = "";
var inputElement = document.getElementById('input');
var savedCities = JSON.parse(localStorage.getItem('cities')) || []; // Retrieve saved cities from local storage

var today = dayjs().format("dddd: MMMM DD, YYYY");
dateDisplayElement.textContent = today;

removeButton.addEventListener('click', function () {
    localStorage.clear();
    newCities.innerHTML = "";
  })

inputElement.addEventListener('input', function(event) {
  userInput = event.target.value.trim(); // Update userInput when the input field changes
});

// run the forecast
function getApi(event) {
  forecastHeader.textContent = '5-Day Forecast: ' + userInput;
  forecastHeader.style.display = 'block';
  forecastCards.style.display = 'flex';


  var requestUrl =
    'https://api.openweathermap.org/data/2.5/forecast?q=' +
    userInput +
    '&appid=' +
    apiKey +
    '&units=imperial';

  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Clear existing forecast cards
      forecastCards.innerHTML = '';

      for (var i = 0; i < data.list.length; i++) {
        var time_of_day = data.list[i].dt_txt.slice(-8);
        if (time_of_day === '03:00:00') {
          createForecastCard(data.list[i]);
        }
      }
      
      saveCity(userInput); // Save city to local storage
      displaySavedCities(); // Update the displayed saved cities'
      getCurrentWeather(); // start the next api request, but just for current day
    })
    .catch(function (error) {
      console.error('Error:', error);
      alert('You have entered the city name incorrectly. Please check your spelling');
    });
}
// create forecast cards for each of the next five days
function createForecastCard(forecastData)  {
  var forecastCard = document.createElement('div');
  forecastCard.className = 'forecast-card';
  forecastCard.style.display = 'block';

  var dateElement = document.createElement('p');
  dateElement.textContent = dayjs(forecastData.dt_txt.slice(0, 10)).format('MM/DD/YY');
  forecastCard.appendChild(dateElement);

  var temperatureElement = document.createElement('p');
  temperatureElement.textContent = 'Temperature: ' + forecastData.main.temp + ' °F';
  forecastCard.appendChild(temperatureElement);

  var windSpeedElement = document.createElement('p');
  windSpeedElement.textContent = 'Wind Speed: ' + forecastData.wind.speed + ' mph';
  forecastCard.appendChild(windSpeedElement);

  var humidityElement = document.createElement('p');
  humidityElement.textContent = 'Humidity: ' + forecastData.main.humidity + '%';
  forecastCard.appendChild(humidityElement);

  var weatherIconElement = document.createElement('img');
  var iconCode = forecastData.weather[0].icon;
      var iconPath = "https://openweathermap.org/img/w/" + iconCode + ".png";
      weatherIconElement.src = iconPath;
  forecastCard.appendChild(weatherIconElement);

  forecastCards.appendChild(forecastCard);
}
// listen to if somebody clicks the submit button
document.getElementById('submit-button').addEventListener('click', getApi);

// creates a button for each city that is searched
function CreateSavedButton(event) {
  var newButton = document.createElement('button');
  newButton.textContent = userInput;
  newButton.id = 'savedButton';
  newCities.appendChild(newButton);
  listenToButton();
}



// gets the today's weather and populates it in the forecast header
function getCurrentWeather(event) {

  var requesttodayUrl =
    'https://api.openweathermap.org/data/2.5/weather?q=' +
    userInput +
    '&appid=' +
    apiKey +
    '&units=imperial';

    forecastHeader.innerHTML = '';
    
  fetch(requesttodayUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (!data.weather.length) {
        alert('No weather data found.');
        return;
      } else {
        var placeName = document.createElement('h2');
        placeName.textContent = data.name + ' (' + today + ')';

        var weatherIconElement = document.createElement('img');
        var iconCode = data.weather[0].icon;
        var iconPath = "https://openweathermap.org/img/w/" + iconCode + ".png";
        weatherIconElement.src = iconPath;

        var temperatureElement = document.createElement('h3');
        temperatureElement.textContent = 'Temperature: ' + data.main.temp + ' °F';

        var windSpeedElement = document.createElement('h4');
        windSpeedElement.textContent = 'Wind Speed: ' + data.wind.speed + ' mph';

        var humidityElement = document.createElement('h5');
        humidityElement.textContent = 'Humidity: ' + data.main.humidity + '%';

        forecastHeader.appendChild(placeName);
        forecastHeader.appendChild(weatherIconElement);
        forecastHeader.appendChild(temperatureElement);
        forecastHeader.appendChild(windSpeedElement);
        forecastHeader.appendChild(humidityElement);
      }

    })
    .catch(function (error) {
      console.error('Error:', error);
      alert('You have entered the city name incorrectly. Please check your spelling');
    });
}



function saveCity(city) {
  // Save the city to local storage
  savedCities.push(city);
  localStorage.setItem('cities', JSON.stringify(savedCities));
}

function displaySavedCities() {
  // Clear the list of saved cities and display updated list from local storage
  newCities.innerHTML = '';
  savedCities.forEach(function(city) {
    var newButton = document.createElement('button');
    newButton.textContent = city;
    newButton.addEventListener('click', function() {
      userInput = city;
      getApi(); // Call the getApi function with the selected city name
    });
    newCities.appendChild(newButton);
  });
}


// Display saved cities on page load
displaySavedCities();

