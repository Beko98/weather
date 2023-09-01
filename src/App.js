import React, { useState } from "react";
import axios from "axios";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/currentWeather";
import Forecast from "./components/forecast/forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./components/api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [dailyForecast, setDailyForecast] = useState(null);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherRequest = axios.get(`${WEATHER_API_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: "metric",
      },
    });

    const dailyForecastRequest = axios.get(`${WEATHER_API_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: WEATHER_API_KEY,
        units: "metric",
        cnt: 7,
      },
    });

    axios
      .all([currentWeatherRequest, dailyForecastRequest])
      .then(
        axios.spread((currentWeatherResponse, dailyForecastResponse) => {
          setCurrentWeather({
            city: searchData.label,
            ...currentWeatherResponse.data,
          });
          setDailyForecast({
            city: searchData.label,
            ...dailyForecastResponse.data,
          });
        })
      )
      .catch((error) => {
        console.error("Error making API requests:", error);
      });
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {dailyForecast && <Forecast data={dailyForecast} />}
    </div>
  );
}

export default App;
