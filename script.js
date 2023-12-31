async function search(location = 'London') {
  const key = 'a4986653a3814601b4c145542230110';
  document.querySelector('#curtain').style.visibility = 'visible';
  document.querySelector('#loading').style.visibility = 'visible';
  try {
    const query = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=3`, { mode: 'cors' });

    if (!query.ok) {
      throw new Error(`HTTP error! Status: ${query.status}`);
    }

    const response = await query.json();

    const weatherData = {
      location: response.location.name,
      region: response.location.region,
      lat: response.location.lat,
      lon: response.location.lon,
      currentText: response.current.condition.text,
      currentBackground: null,
      currentIcon: `https:${response.current.condition.icon}`,
      isDay: response.current.is_day,
      todaySunset: response.forecast.forecastday[0].astro.sunset,
      tomorrowSunrise: response.forecast.forecastday[1].astro.sunrise,
      currentTemp: Math.round(response.current.temp_c),
      currentFeel: Math.round(response.current.feelslike_c),
      currentUV: response.current.uv,
      currentViz: response.current.vis_km,
      currentWind: Math.round(response.current.wind_mph),
      currentDirection: response.current.wind_degree + 180,
      forecastDay0: {
        date: response.forecast.forecastday[0].date,
        day: null,
        icon: `https:${response.forecast.forecastday[0].day.condition.icon}`,
        temp: Math.round(response.forecast.forecastday[0].day.maxtemp_c),
      },
      forecastDay1: {
        date: response.forecast.forecastday[1].date,
        day: null,
        icon: `https:${response.forecast.forecastday[1].day.condition.icon}`,
        temp: Math.round(response.forecast.forecastday[1].day.maxtemp_c),
      },
      forecastDay2: {
        date: response.forecast.forecastday[2].date,
        day: null,
        icon: `https:${response.forecast.forecastday[2].day.condition.icon}`,
        temp: Math.round(response.forecast.forecastday[2].day.maxtemp_c),
      },
      nextSunChange: null,
    };
    weatherData.lat = `${weatherData.lat >= 0 ? `${weatherData.lat}N` : `${-weatherData.lat}S`}`;
    weatherData.lon = `${weatherData.lon >= 0 ? `${weatherData.lon}E` : `${-weatherData.lon}W`}`;
    weatherData.nextSunChange = weatherData.isDay === 1 ? `Sunset ${weatherData.todaySunset}` : `Sunrise ${weatherData.tomorrowSunrise}`;

    function dateToDayOfWeek(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString('en-GB', { weekday: 'short' });
    }

    weatherData.forecastDay0.day = dateToDayOfWeek(weatherData.forecastDay0.date);
    weatherData.forecastDay1.day = dateToDayOfWeek(weatherData.forecastDay1.date);
    weatherData.forecastDay2.day = dateToDayOfWeek(weatherData.forecastDay2.date);

    switch (weatherData.currentText) {
      case 'Partly cloudy':
      case 'Cloudy':
        weatherData.currentBackground = 'cloud';
        break;
      case 'Overcast':
        weatherData.currentBackground = 'overcast';
        break;
      case 'Fog':
      case 'Freezing fog':
      case 'Mist':
        weatherData.currentBackground = 'fog';
        break;
      case 'Sunny':
      case 'Clear':
        weatherData.currentBackground = 'sunny';
        break;
      case 'Patchy light snow':
      case 'Light snow':
      case 'Patchy moderate snow':
      case 'Moderate snow':
      case 'Patchy heavy snow':
      case 'Heavy snow':
      case 'Ice pellets':
      case 'Light sleet':
      case 'Moderate or heavy sleet':
      case 'Patchy light snow with thunder':
      case 'Moderate or heavy snow with thunder':
      case 'Light snow showers':
      case 'Moderate or heavy snow showers':
      case 'Light showers of ice pellets':
      case 'Blowing snow':
      case 'Blizzard':
      case 'Patchy snow possible':
      case 'Patchy sleet possible':
        weatherData.currentBackground = 'winter';
        break;
      case 'Patchy rain possible':
      case 'Patchy freezing drizzle possible':
      case 'Thundery outbreaks possible':
      case 'Heavy rain at times':
      case 'Heavy rain':
      case 'Light freezing rain':
      case 'Moderate or heavy freezing rain':
      case 'Light rain shower':
      case 'Moderate or heavy rain shower':
      case 'Torrential rain shower':
      case 'Light sleet showers':
      case 'Moderate or heavy sleet showers':
      case 'Moderate or heavy showers of ice pellets':
      case 'Patchy light rain with thunder':
      case 'Moderate or heavy rain with thunder':
      case 'Patchy light drizzle':
      case 'Light drizzle':
      case 'Freezing drizzle':
      case 'Heavy freezing drizzle':
      case 'Patchy light rain':
      case 'Light rain':
      case 'Moderate rain at times':
      case 'Moderate rain':
        weatherData.currentBackground = 'rain';
        break;
      default:
        weatherData.currentBackground = 'unknown';
    }

    document.querySelector('h1').innerHTML = `${weatherData.location} <span>${weatherData.region} | ${weatherData.lat} ${weatherData.lon}</span>`;
    document.querySelector('main div.row').innerHTML = `<h2>${weatherData.currentText}</h2><span>${weatherData.nextSunChange}</span><div><img src="${weatherData.currentIcon}"></div>`;
    document.querySelector('span#temp').innerHTML = weatherData.currentTemp;
    document.querySelector('span#feelslike').innerHTML = weatherData.currentFeel;
    document.querySelector('span#uv').innerHTML = weatherData.currentUV;
    document.querySelector('span#visibility').innerHTML = weatherData.currentViz;
    document.querySelector('span#wind').innerHTML = weatherData.currentWind;
    document.querySelector('img#wind-arrow').style.transform = `rotate(${weatherData.currentDirection}deg)`;
    document.querySelector('div#d0').innerHTML = `${weatherData.forecastDay0.day} <img src="${weatherData.forecastDay0.icon}"><span class="temp">${weatherData.forecastDay0.temp}&deg;C</span>`;
    document.querySelector('div#d1').innerHTML = `${weatherData.forecastDay1.day} <img src="${weatherData.forecastDay1.icon}"><span class="temp">${weatherData.forecastDay1.temp}&deg;C</span>`;
    document.querySelector('div#d2').innerHTML = `${weatherData.forecastDay2.day} <img src="${weatherData.forecastDay2.icon}"><span class="temp">${weatherData.forecastDay2.temp}&deg;C</span>`;
    document.querySelector('body').style.backgroundImage = `url('${weatherData.currentBackground}.jpg')`;

    console.log(response);
    console.table(weatherData);

    document.querySelector('#curtain').style.visibility = 'hidden';
    document.querySelector('#loading').style.visibility = 'hidden';

    window.scrollTo({
      top: 0,
      behaviour: 'smooth',
    });
  } catch (error) {
    console.error('An error occurred:', error);
    document.querySelector('#curtain').innerHTML = `Sorry, there's been a problem (${error}). Try refreshing the page.`;
  }
}

search();

const searchbox = document.querySelector('input#search');

searchbox.addEventListener('focus', () => {
  if (searchbox.value === 'Search city...') {
    searchbox.value = '';
  }
});

function callSearch() {
  event.preventDefault();
  search(searchbox.value);
  searchbox.blur();
}

searchbox.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    callSearch();
  }
});

document.querySelector('input[type="submit"]').addEventListener('click', () => {
  callSearch();
});
