
var apiKey = '41cd57d95ec76bcbd53da7502019de71';
var apiUrl = 'https://api.openweathermap.org/data/2.5/weather';
var body = document.querySelector("body");
var cityInput = document.querySelector("#search-bar");
var search = document.querySelector("#btn");
var todayForcast = document.querySelector("#today-forcast");
var forcastDays = document.querySelector("#weather-forcast");
var fiveDayForcastTable = document.querySelector("#five-day-forcast tbody");

// Get user's location using Geolocation API
navigator.geolocation.getCurrentPosition(success, error);

window.addEventListener('load', function () {
    // Add an event listener for keydown event on the input field
    cityInput.addEventListener('keydown', function (event) {
        // Check if the pressed key is Enter (key code 13)
        if (event.key === 'Enter') {
            // Prevent the default form submission behavior
            event.preventDefault();
            
            // Get the trimmed value from the input field
            var location = cityInput.value.trim();
            
            // Check if a valid location is provided
            if (location) {
                // Call the functions with the entered location
                getCurrentForcast({ location })
                .then(data => { 
                    getFiveForcast(data);
                    getDailyTemperatureData(data);
                })
                .catch(error => {
                    console.error('Error getting current forecast:', error);
                });                
            } else {
                // Show an alert if no location is provided
                alert('Please enter a valid location.');
            }
        }
    });

    // Add an event listener for the click event on the search button
    search.addEventListener('click', function () {
        // Get the trimmed value from the input field
        var location = cityInput.value.trim();
        
        // Check if a valid location is provided
        if (location) {
            // Call the functions with the entered location
            getCurrentForcast({ location })
                .then(data => { 
                    getFiveForcast(data);
                    getDailyTemperatureData(data);
                })
                .catch(error => {
                    console.error('Error getting current forecast:', error);
                });                
        } else {
            // Show an alert if no location is provided
            alert('Please enter a valid location.');
        }
    });
});


function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Fetch weather data using user's coordinates
    getCurrentForcast({ latitude, longitude });
    getFiveForcast({ latitude, longitude });
    getDailyTemperatureData({ latitude, longitude });
}

function error() {
    console.error('Unable to retrieve location information. Using default location (Indonesia).');

    // Default location for Indonesia
    const defaultLocation = 'Jakarta';
    const defaultLatitude = -6.2088; // Jakarta's latitude
    const defaultLongitude = 106.8456; // Jakarta's longitude

    // Fetch weather data using default coordinates
    getCurrentForcast({ location: defaultLocation });
    getFiveForcast({ latitude: defaultLatitude, longitude: defaultLongitude });
    getDailyTemperatureData({ latitude: defaultLatitude, longitude: defaultLongitude });
}

// fetches the current weather data from the Open Weather Api
function getCurrentForcast({ location, latitude, longitude }) {
    let url;

    if (location) {
        url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;
    } else if (latitude && longitude) {
        url = `${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    } else {
        console.error('Invalid parameters for getCurrentForcast.');
        return Promise.reject('Invalid parameters for getCurrentForcast.'); // Return a rejected promise
    }

    // Return the fetch promise
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            const { coord } = data; // Extract coordinates from the API response
            const { lat, lon } = coord;

            var temp = data.main.temp;
            var pressure = data.main.pressure;
            var humidity = data.main.humidity;
            var windspeed = data.wind.speed;
            var weatherIconImg = data.weather[0].icon;
            var desc = data.weather[0].description;
            var citi = data.name;

            // Create elements for today-forcast
            var iconElement = document.createElement("div");
            iconElement.setAttribute("id", "icon");
            iconElement.setAttribute("class", "col-2");
            var img = document.createElement("img");
            img.setAttribute("class", "img-fluid w-100");
            img.setAttribute("style", "width: 8em");
            img.setAttribute("src", "https://openweathermap.org/img/wn/" +weatherIconImg + "@2x.png");

            var temperatureElement = document.createElement("div");
            temperatureElement.setAttribute("id", "temperature");
            temperatureElement.setAttribute("class", "col-2");
            temperatureElement.textContent = "Temperature";

            var pressureElement = document.createElement("div");
            pressureElement.setAttribute("class", "col-md-6");
            pressureElement.textContent = "Pressure";

            var humidityElement = document.createElement("div");
            humidityElement.setAttribute("id", "humidity");
            humidityElement.setAttribute("class", "col-md-6");
            humidityElement.textContent = "Humidity";

            var windSpeedElement = document.createElement("div");
            windSpeedElement.setAttribute("id", "wind_speed");
            windSpeedElement.setAttribute("class", "col-md-6");
            windSpeedElement.textContent = "Wind Speed";

            var locationElement = document.createElement("div");
            locationElement.setAttribute("id", "location");
            locationElement.setAttribute("class", "col-10");
            locationElement.textContent = "Location";

            var dateElement = document.createElement("div");
            dateElement.setAttribute("id", "date");
            dateElement.setAttribute("class", "col-10");
            dateElement.textContent = "Date";

            var descriptionElement = document.createElement("div");
            descriptionElement.setAttribute("id", "description");
            descriptionElement.setAttribute("class", "col-10");
            descriptionElement.textContent = "Description";

            // Append the img element to the iconElement
            iconElement.appendChild(img);

            // Append elements to today-forcast
            todayForcast.innerHTML = ""; // Clear existing content
            todayForcast.appendChild(iconElement);
            todayForcast.appendChild(temperatureElement);

            var col4Element = document.createElement("div");
            col4Element.setAttribute("class", "col-4 justify-content-center");
            col4Element.appendChild(pressureElement);
            col4Element.appendChild(humidityElement);
            col4Element.appendChild(windSpeedElement);
            todayForcast.appendChild(col4Element);

            var col4RightElement = document.createElement("div");
            col4RightElement.setAttribute("class", "col-4 align-items-center");
            col4RightElement.setAttribute("align", "right");
            col4RightElement.appendChild(locationElement);
            col4RightElement.appendChild(dateElement);
            col4RightElement.appendChild(descriptionElement);
            todayForcast.appendChild(col4RightElement);

            // Update the content
            // Note: You might want to replace these placeholders with actual data
            temperatureElement.textContent = `${Math.ceil(temp)}°C`;
            pressureElement.textContent = `Pressure: ${pressure}hPa`;
            humidityElement.textContent = `Humidity: ${humidity}%`;
            windSpeedElement.textContent = `Wind: ${windspeed} m/s`;
            locationElement.textContent = `${citi}`; 
            dateElement.textContent = new Date(data.dt * 1000).toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
                hour12: true // Set to false if you prefer 24-hour format
              });              
            descriptionElement.textContent = `${desc}`;

            // Additional logic for updating the icon, you can use the weatherIconImg variable
            // to determine the appropriate icon and update the iconElement content or attributes
            // iconElement.textContent = "Updated Icon Content";
            // or
            // iconElement.setAttribute("class", "new-icon-class");

            // Continue with other logic (if needed)
            // ...
        
            return {
                location: citi,
                latitude: lat,   // Include latitude in the return object
                longitude: lon,  // Include longitude in the return object
            };
        })
        .catch(function (error) {
            console.error('Error fetching weather data:', error);
            throw error; // Re-throw the error to propagate it in the promise chain
        });
}

function getFiveForcast({ location, latitude, longitude }) {
    var requestforcastUrl;

    if (location) {
        requestforcastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;
    } else if (latitude && longitude) {
        requestforcastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    } else {
        console.error('Invalid parameters for getFiveForcast.');
        return;
    }

    fetch(requestforcastUrl)
        .then(response => response.json())
        .then(data => {
            var fiveDayForcastTable = document.querySelector("#five-day-forcast tbody");

            // Clear existing content in the table
            fiveDayForcastTable.innerHTML = "";

            for (var i = 0; i < data.list.length; i += 8) {
                var forcastDate = new Date(data.list[i].dt_txt);
                var dayOfTheWeek = String(forcastDate).slice(0, 4);
                var temp = data.list[i].main.temp;
                var humidity = data.list[i].main.humidity;
                var windspeed = data.list[i].wind.speed;
                var winddirection = data.list[i].wind.deg;
                var weatherIconImg = data.list[i].weather[0].icon;

                // Create elements for each day's forecast
                var td = document.createElement("td");
                var card = document.createElement("div");
                card.setAttribute("class", "card");
                var cardBody = document.createElement("div");
                cardBody.setAttribute("class", "card-body text-center");
                var img = document.createElement("img");
                img.setAttribute("class", "img-fluid w-50");
                var ul = document.createElement("ul");
                ul.setAttribute("class", "list-group");
                var tempInfo = createListItem("Temp", Math.ceil(temp) + "°C");
                var humidityInfo = createListItem("Humidity", humidity + "%");
                var windspeedInfo = createListItem("Wind", windspeed + " m/s");
                var winddirectionInfo = createListItem("Wind Direction", winddirection + "°");
                var winddirectionImageInfo = createListItem(undefined, undefined);
                var forcastDateInfo = document.createElement("p");
                forcastDateInfo.textContent = dayOfTheWeek;
                forcastDateInfo.style.fontWeight = "bold";
                forcastDateInfo.style.fontSize = "1.5em";
                var windDirectionImage = document.createElement("span");
                windDirectionImage.setAttribute("class", "wind-direction material-symbols-outlined");
                windDirectionImage.textContent = 'navigation'
                // Apply rotation based on wind direction
                windDirectionImage.style.transform = `rotate(${winddirection}deg)`;
                winddirectionImageInfo.appendChild(windDirectionImage);

                img.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherIconImg + "@2x.png");

                // Append elements to the DOM
                td.append(card);
                card.append(cardBody);
                cardBody.append(forcastDateInfo);
                cardBody.append(img);
                cardBody.append(ul);  // Append the ul to the cardBody
                ul.append(tempInfo);
                ul.append(humidityInfo);
                ul.append(windspeedInfo);
                ul.append(winddirectionInfo);
                ul.append(winddirectionImageInfo);  // Append the windDirectionImage to the ul


                // Append the td element to the tbody
                fiveDayForcastTable.appendChild(td);
            }
        })
        .catch(error => {
            console.error('Error fetching five-day forecast data:', error);
        });
}

function createListItem(label, value) {
    var li = document.createElement("li");
    li.setAttribute("class", "list-group-item");
    li.style.padding = "3px";
    if (label !== undefined && value !== undefined) {
        li.textContent = label + ": " + value;
    }
    return li;
}

function getDailyTemperatureData({ latitude, longitude }) {
    var url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,surface_pressure&timezone=auto`;

   /*  var requestforcastUrl;

    if (location) {
        requestforcastUrl = `https://api.open-meteo.com/v1/forecast?${location}&hourly=temperature_2m,precipitation,surface_pressure`;
    } else if (latitude && longitude) {
        requestforcastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,surface_pressure`;
    } else {
        console.error('Invalid parameters for getFiveForcast.');
        return;
    } */

    
    fetch(url)
        .then(data => data.json())
        .then(json => drawChart(json))
        .catch(error => {
            console.error('Error fetching daily data:', error);
        });
}

function drawChart(json) {
    const temperatureData = json.hourly.temperature_2m.map(temp => Math.ceil(temp));
    const precipitationData = json.hourly.precipitation;
    const pressureData = json.hourly.surface_pressure;
    const timeLabels = json.hourly.time.map(timestamp => new Date(timestamp));
 
    const dateLabelsFormatted = timeLabels.map(date => date.toLocaleTimeString('en-US', { day: '2-digit', month: 'short'}).slice(0, 6));
    const timeLabelsFormatted = timeLabels.map(date => date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }));

Highcharts.chart('meteogram-container', {
    title: {
        text: 'Temperature X Pressure'
    },
    xAxis: [{
        type: 'category',
        categories: timeLabelsFormatted,
        gridLineWidth: 1,
        labels: {
            rotation: 45,
            style: {
                fontSize: '10px'
            }
        },
        title: {
            text: 'Time'
        }
    }, {
        type: 'category',
        categories: dateLabelsFormatted,
        gridLineWidth: 1,
        opposite: true,
        tickInterval: 30,
        tickLength: 1,
        linkedTo: 0,
        labels: {
            style: {
                fontSize: '10px'
            }
        },
        title: {
            text: 'Date'
        }
    }],
    yAxis: [{
        gridLineWidth: 1,
        title: {
            text: 'Temperature (°C)'
        }
    }, {
        title: {
            text: 'Precipitation (mm)'
        },
        opposite: true
    }, {
        title: {
            text: 'Pressure (hPa)'
        },
        opposite: true
    }],
    series: [{
        name: 'Temperature',
        data: temperatureData,
        type: 'spline',
        yAxis: 0,
        color: 'rgb(192, 75, 75)'
    }, {
        name: 'Precipitation',
        data: precipitationData,
        type: 'column',
        yAxis: 1,
        color: 'rgb(75, 75, 192)'
    }, {
        name: 'Pressure',
        data: pressureData,
        type: 'line',
        yAxis: 2,
        color: 'rgb(75, 192, 75)'
    }]
});
}