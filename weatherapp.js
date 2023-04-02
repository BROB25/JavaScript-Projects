const form = document.querySelector('form');
const input = document.querySelector('input');
const weatherDiv = document.querySelector('#weather');
const geolocationBtn = document.querySelector('#geolocation-btn');
const geolocationDiv = document.querySelector('#geolocation');

const convertLocation = (location) => {
  const parts = location.split(',');
  let city = '';
  let state = '';

  if (parts.length === 1) {
    city = parts[0].trim();
  } else if (parts.length === 2) {
    city = parts[0].trim();
    const stateOrCountry = parts[1].trim();
    if (/^[A-Za-z]{2}\.?$/i.test(stateOrCountry)) {
      state = stateOrCountry.replace('.', '');
    } else {
      return null;
    }
  } else {
    return null;
  }

  let locationStr = `${city}`;
  if (state) {
    locationStr += `, ${state}`;
  }
  return locationStr;
};

// Get current location using geolocation API
geolocationBtn.addEventListener('click', () => {
  if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=f0cd27ef08ca5bd4d39440484a6c8208`);
        const weatherData = await response.json();
        const temperatureC = weatherData.main.temp;
        const temperatureF = (temperatureC * 9/5) + 32;
        const description = weatherData.weather[0].description;
        const location = weatherData.name;
        weatherDiv.innerHTML = `Current temperature in ${location}: ${temperatureF.toFixed(2)}°F (${temperatureC.toFixed(2)}°C), ${description}`;
      } catch(error) {
        weatherDiv.innerHTML = `Unable to fetch weather data. Please try again later.`;
      }
    });
  } else {
    weatherDiv.innerHTML = `Location not supported by this browser.`;
  }
});

// Get weather data for entered location
form.addEventListener('submit', async(event) => {
  event.preventDefault();
  const location = input.value;

  // Shows loading spinner
  const loadingDiv = document.querySelector('#loading');
  loadingDiv.innerHTML = '<img src="https://i.stack.imgur.com/FhHRx.gif">';
  loadingDiv.style.display = 'block';

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=f0cd27ef08ca5bd4d39440484a6c8208`);
    const weatherData = await response.json();
    const temperatureC = weatherData.main.temp;
    const temperatureF = (temperatureC * 9/5) + 32;
    const description = weatherData.weather[0].description;
    const locationName = weatherData.name;

    // Hides loading spinner
    loadingDiv.style.display = 'none';

    // Updates weather div with weather data
    weatherDiv.innerHTML = `Current temperature in ${location}: ${temperatureF.toFixed(2)}°F (${temperatureC.toFixed(2)}°C), ${description}`;
  } catch(error) {
    // Hides loading spinner or message
    loadingDiv.style.display = 'none';
    weatherDiv.innerHTML = `Unable to fetch weather data for ${location}. Please try again later.`;
  }
});

// Autocomplete
$(document).ready(function(){
  $('#location-input').autocomplete({
    source: function(request, response) {
      $.getJSON('https://api.openweathermap.org/geo/1.0/direct', {
        q: request.term,
        limit: 10,
        appid: 'f0cd27ef08ca5bd4d39440484a6c8208'
      }, function(data) {
        var locationNames = $.map(data, function(location) {
          return location.name + ', ' + location.country;
        });
        response(locationNames);
      });
    }
  });
});

$('#location-input').autocomplete({
  select: function(event, ui) {
    // Set the input field value to the selected location
    $(this).val(ui.item.value);
    // Submit the form to fetch weather data
    $('#weather-form').submit();
    return false;
  }
});

// Search History
let searchHistory = [];

const renderSearchHistory = () => {
  const searchHistoryList = document.querySelector('#search-history-list');
  searchHistoryList.innerHTML = '';

  searchHistory.forEach((location) => {
    const listItem = document.createElement('li');
    listItem.textContent = location;
    searchHistoryList.appendChild(listItem);
  });
};

// Saves search history to the browser's local storage
const saveSearchHistory = () => {
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
};

// Loads previously saved search history
const loadSearchHistory = () => {
  const storedHistory = localStorage.getItem('searchHistory');
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
};

const renderWeatherData = async (location) => {
  try {
    // Fetch weather data
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`);
    const weatherData = await response.json();

    // Extract weather information
    const temperatureC = weatherData.main.temp;
    const temperatureF = (temperatureC * 9/5) + 32;
    const description = weatherData.weather[0].description;

    // Display weather information
    weatherDiv.innerHTML = `Current temperature in ${location}: ${temperatureF.toFixed(2)}°F (${temperatureC.toFixed(2)}°C), ${description}`;

    // Save location to search history and render history list
    searchHistory.push(location);
    saveSearchHistory();
    renderSearchHistory();
  } catch (error) {
    weatherDiv.innerHTML = `Unable to fetch weather data for ${location}. Please try again later.`;
  }
};

window.addEventListener('load', () => {
  // Load search history from local storage
  loadSearchHistory();

  // Render search history list
  renderSearchHistory();
});