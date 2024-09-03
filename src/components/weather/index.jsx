import Search from "../search";
import { useEffect, useState } from "react";

export default function Weather() {
    // define necessary constructors and state; required are for search, loading, fetching weather and forecast data
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState([]);
    const [error, setError] = useState(null);

    async function fetchWeatherData(param) {
        // data is being fetched
        setLoading(true);
        // clear previous errors before making a new request
        setError(null);
        try {
            // fetch current weather data (API doc: https://openweathermap.org/current)
            const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=5c9ad4b0e10fb84e0c7b69b82fd42419&units=metric`);
            // fetch 5-day / 3-hour forecast data (API doc: https://openweathermap.org/forecast5)
            const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${param}&appid=5c9ad4b0e10fb84e0c7b69b82fd42419&units=metric`);

            // To throw an error if city is not found
            if (weatherResponse.status === 404) {
                throw new Error("City not found");
            }

            // convert responses to json
            const weather = await weatherResponse.json();
            const forecast = await forecastResponse.json();

            // if current weather data is successfully fetched, store it in respective state
            if (weather) {
                setWeatherData(weather);
            }

            // if forecast weather data is successfully fetched, store it in respective state
            if (forecast) {
                setForecastData(forecast.list.slice(0, 5)); // Take first 5 forecast entries (3-hour intervals)
            }

            // since data fetching is complete, stop the loading state
            setLoading(false);
        } catch (e) {
            setLoading(false);
            setError(e.message);
            console.log(e);
        }
    }

    // function to fetch weather data based on input from search
    function handleSearch() {
        fetchWeatherData(search);
    }

    // function to get current date
    function getCurrentDate() {
        return new Date().toLocaleString();
    }

    // function to get umbrella recommendation based on weather ID parsed from fetched json response (Doc: https://openweathermap.org/weather-conditions)
    function getUmbrellaRecommendation(weatherId) {
        if (weatherId >= 200 && weatherId < 300) {
            return "Bringing an umbrella is highly recommended.";
        } else if (weatherId >= 300 && weatherId < 400) {
            return "Bringing an umbrella is highly recommended.";
        } else if (weatherId >= 500 && weatherId < 600) {
            return "Bringing an umbrella is highly recommended.";
        } else if (weatherId >= 600 && weatherId < 700) {
            return "You'll probably need more than just an umbrella.";
        } else if (weatherId >= 700 && weatherId < 800) {
            return "You'll probably need more than just an umbrella.";
        } else if (weatherId === 800) {
            return "The current weather is fair, so keep the umbrella.";
        } else if (weatherId > 800 && weatherId < 900) {
            return "The current weather is fair, so keep the umbrella.";
        } else {
            return "Weather data unavailable for recommendation.";
        }
    }

    // to show default weather; used Manila for this case
    useEffect(() => {
        fetchWeatherData("Manila");
    }, []);

    // just for the sake that weather data is indeed fetched; can be inspected via console of browser
    console.log(weatherData);

    return (
        <div>
            {/* Title of the app; I decided Umbrella Analysis to solve the problem whether you need an umbrella or not depending on the current weather of a city */}
            <div className="app-title">Umbrella Analysis!</div>
            {/* Subheader to provide additional context; it also basically provides temperature, current weather, forecast, and among others */}
            <div className="app-subheader">Current Weather with Forecast</div>
            {/* Search component for user input */}
            <Search
                search={search}
                setSearch={setSearch}
                handleSearch={handleSearch} />
            {
                loading ? (
                    <div className="loading">Loading...</div>) : error ? (
                        // To throw error if city name is invalid or not found
                        <div className="error-message">{error}</div>
                    ) : (
                    <div>
                        {/* To display city name and country abbreviation */}
                        <div className="city-name">
                            <h2>
                                {weatherData?.name}, <span>{weatherData?.sys?.country}</span>
                            </h2>
                        </div>
                        {/* To display current date and time */}
                        <div className="date">
                            <span>{getCurrentDate()}</span>
                        </div>
                        {/* To display respective icon depending on current weather (Doc: https://openweathermap.org/weather-conditions) */}
                        <div className="weather-icon">
                            <img
                                src={`http://openweathermap.org/img/wn/${weatherData?.weather[0]?.icon}@2x.png`}
                                alt="Weather icon"
                            />
                        </div>
                        {/* To display temperature and weather description */}
                        <div className="temp">{weatherData?.main?.temp}°C</div>
                        <p className="description">
                            {weatherData && weatherData.weather && weatherData.weather[0]
                                ? weatherData.weather[0].description.toUpperCase()
                                : ""}
                        </p>
                        {/* To display additional weather information (wind speed and humidity); divided in columns */}
                        <div className="weather-info">
                            <div className="column">
                                <div>
                                    <p>Wind Speed</p>
                                    <p className="wind">{weatherData?.wind?.speed} m/s</p>
                                </div>
                            </div>
                            <div className="column">
                                <div>
                                    <p>Humidity</p>
                                    <p className="humidity">{weatherData?.main?.humidity}%</p>
                                </div>
                            </div>
                        </div>
                        {/* To display umbrella recommendation depending on weather; this will call the function getUmbrellaRecommendation */}
                        <div className="umbrella-recommendation">
                            <p>{getUmbrellaRecommendation(weatherData?.weather[0]?.id)}</p>
                        </div>
                        {/* To display 3-hour weather forecast */}
                        <div className="forecast">
                            <h3>3-HOUR FORECAST:</h3>
                            {/* Iterate for each item */}
                            {forecastData.map((forecast, index) => (
                                <div key={index} className="forecast-item">
                                    {/* Forecast time for one item */}
                                    <p>{new Date(forecast.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                    {/* Forecast weather icon for one item*/}
                                    <img
                                        src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                                        alt="Forecast icon"
                                    />
                                    {/* Forecast temperature for one item */}
                                    <p>{forecast.main.temp}°C</p>
                                    {/* Forecast weather description for one item */}
                                    <p>{forecast.weather[0].description.toUpperCase()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        </div>
    );
}