// http://api.weatherapi.com/v1/forecast.json?key=a4986653a3814601b4c145542230110&q=London&days=3&aqi=no&alerts=no

document.querySelector('input#search').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        search(document.getElementById('search').value);
    }
})

document.querySelector('input[type="submit"]').addEventListener('click', function() {
    search(document.getElementById('search').value);
})

async function search(location = 'London') {
    const key = 'a4986653a3814601b4c145542230110';
    const query = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${location}&days=3`, {mode: 'cors'});
    const response = await query.json();
    const weatherData = {
        location: response.location.name,
        region: response.location.region,
        lat: response.location.lat,
        lon: response.location.lon,
        currentText: response.current.condition.text,
        currentIcon: 'http:' + response.current.condition.icon,
        isDay: response.current.is_day,
        todaySunset: response.forecast.forecastday[0].astro.sunset,
        tomorrowSunrise: response.forecast.forecastday[1].astro.sunrise,
        currentTemp: response.current.temp_c,
        currentFeel: response.current.feelslike_c,
        currentUV: response.current.uv,
        currentViz: response.current.vis_km,
        currentWind: Math.round(response.current.wind_mph),
        currentDirection: response.current.wind_degree+180,
        forecastDay0: {
                date: response.forecast.forecastday[0].date,
                day: null,
                icon: 'http:' + response.forecast.forecastday[0].day.condition.icon,
                temp: Math.round(response.forecast.forecastday[0].day.maxtemp_c),
            },
        forecastDay1: {
                date: response.forecast.forecastday[1].date,
                day: null,
                icon: 'http:' + response.forecast.forecastday[1].day.condition.icon,
                temp: Math.round(response.forecast.forecastday[1].day.maxtemp_c),
            },
        forecastDay2:  {
                date: response.forecast.forecastday[2].date,
                day: null,
                icon: 'http:' + response.forecast.forecastday[2].day.condition.icon,
                temp: Math.round(response.forecast.forecastday[2].day.maxtemp_c),
            },
        nextSunChange: null,
    }
    weatherData.lat = `${weatherData.lat >= 0 ? weatherData.lat + 'N' : (-weatherData.lat) + 'S'}`;
    weatherData.lon = `${weatherData.lon >= 0 ? weatherData.lon + 'E' : (-weatherData.lon) + 'W'}`;
    weatherData.nextSunChange = weatherData.isDay === 1 ? `Sunset ${weatherData.todaySunset}` : `Sunrise ${weatherData.tomorrowSunrise}`;

    function dateToDayOfWeek(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('en-GB', { weekday: 'short' });
      }

    weatherData.forecastDay0.day = dateToDayOfWeek(weatherData.forecastDay0.date);
    weatherData.forecastDay1.day = dateToDayOfWeek(weatherData.forecastDay1.date);
    weatherData.forecastDay2.day = dateToDayOfWeek(weatherData.forecastDay2.date);

    document.querySelector('h1').innerHTML = `${weatherData.location} <span>${weatherData.region} | ${weatherData.lat} ${weatherData.lon}</span>`;
    document.querySelector('main div.row').innerHTML = `<h2>${weatherData.currentText}</h2><span>${weatherData.nextSunChange}</span><div><img src="${weatherData.currentIcon}"></div>`
    document.querySelector('span#temp').innerHTML = weatherData.currentTemp;
    document.querySelector('span#feelslike').innerHTML = weatherData.currentFeel;
    document.querySelector('span#uv').innerHTML = weatherData.currentUV;
    document.querySelector('span#visibility').innerHTML = weatherData.currentViz;
    document.querySelector('span#wind').innerHTML = weatherData.currentWind;
    document.querySelector('img#wind-arrow').style.transform = `rotate(${weatherData.currentDirection}deg)`;
    document.querySelector('div#d0').innerHTML = `${weatherData.forecastDay0.day} <img src="${weatherData.forecastDay0.icon}"><span class="temp">${weatherData.forecastDay0.temp}&deg;C</span>`
    document.querySelector('div#d1').innerHTML = `${weatherData.forecastDay1.day} <img src="${weatherData.forecastDay1.icon}"><span class="temp">${weatherData.forecastDay1.temp}&deg;C</span>`
    document.querySelector('div#d2').innerHTML = `${weatherData.forecastDay2.day} <img src="${weatherData.forecastDay2.icon}"><span class="temp">${weatherData.forecastDay2.temp}&deg;C</span>`
    console.log(response);
    console.table(weatherData);
};
search();