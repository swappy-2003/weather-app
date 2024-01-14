const apikey = "e62317fdb44fa325f65459a09fea4950";

const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");

const url = (city) => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}`;

async function getWeatherByLocation(city) {
    try {
        const resp = await fetch(url(city), { mode: "cors" });
        const respData = await resp.json();

        console.log(respData);

        addWeatherToPage(respData);
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}


// Modify the addWeatherToPage function
async function addWeatherToPage(data) {
    const temp = KtoC(data.main.temp);

    // Make a call to Unsplash API to get a random image based on the temperature
    const unsplashApiKey = 'C0OiD81di0jFLO3iC06Fk8HgUQShEJ13T9NNGYYY8Ic';
    const unsplashUrl = `https://api.unsplash.com/photos/random?query=${getUnsplashQuery(temp)}&client_id=${unsplashApiKey}`;
    
    try {
        const unsplashResponse = await fetch(unsplashUrl);
        const unsplashData = await unsplashResponse.json();

        // Update the body background image
        document.body.style.backgroundImage = `url("${unsplashData.urls.regular}")`;

        const weather = document.createElement("div");
        weather.classList.add("weather");

        weather.innerHTML = `
            <h2><img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /> ${temp}°C <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" /></h2>
            <small>${data.weather[0].main}</small>
        `;

        // cleanup
        main.innerHTML = "";

        main.appendChild(weather);
    } catch (error) {
        console.error('Error fetching image from Unsplash:', error);
    }
}

// Helper function to generate a query for Unsplash based on temperature
function getUnsplashQuery(temperature) {
    if (temperature < 10) {
        return 'Cold Weather';
    } else if (temperature >= 10 && temperature < 15) {
        return 'Colder Weather';
    } else {
        return 'Warm Weather';
    }
}



function KtoC(K) {
    return Math.floor(K - 273.15);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const city = search.value;

    if (city) {
        getWeatherByLocation(city);
    }
});
// Function to update current time
function updateTime() {
    const currentTimeElement = document.getElementById("current-time");
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    currentTimeElement.textContent = `Current Time: ${formattedTime}`;
}

// Function to get user's location using OpenWeatherMap Reverse Geocoding API
async function getUserLocation() {
    const userLocationElement = document.getElementById("user-location");

    try {
        // Get user's current position
        const position = await getCurrentPosition();

        // Use OpenWeatherMap Reverse Geocoding API
        const apiUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&limit=1&appid=${apikey}`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.length > 0) {
            const placeName = data[0].name;
            userLocationElement.textContent = `Hello User from : ${placeName}`;
        } else {
            userLocationElement.textContent = "Location not found";
        }
    } catch (error) {
        console.error("Error fetching location:", error.message);
        userLocationElement.textContent = "Unable to retrieve location.";
    }
}

// Function to get current position using the Geolocation API
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// Call function to get user location
getUserLocation();



// Call functions to update time and location
updateTime();


// Update time every minute
setInterval(updateTime, 60000);

