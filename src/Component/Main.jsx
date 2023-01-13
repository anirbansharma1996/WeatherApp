import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Main.css";

export const Weather = () => {
  const [append, setAppend] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [text, setText] = useState("");
  let key = "d9a7dab350bb8264d81b26a1254ebb7a";
  let map = document.querySelector("#gmap_canvas");

  //daily weather data.................................
  const handleSearch = () => {
    getWeather();
    getForecast();
  };

  async function getWeather() {
    try {
      let res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${key}&units=metric`
      );
      let data = await res.json();
      //console.log(data);
      setAppend(data);
    } catch (err) {
      alert(err.message);
    }
  }
  async function getForecast() {
    let lat = append.coord.lat;
    let lon = append.coord.lon;

    try {
      let res = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely,alerts&units=metric&appid=${key}`
      );
      let data = await res.json();
      setForecast(data.daily);
    } catch (err) {
      console.log(err);
    }
  }
  console.log(append);
  console.log(forecast);
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const apiKey = key;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const result = await axios(url);
      setAppend(result.data);
    });
  }, []);

  return (
    <div>
      <div class="page-content page-container" id="page-content">
        <div class="padding">
          <div class="row container d-flex justify-content-center">
            <div class="col-lg-8 grid-margin stretch-card">
              <div class="card-weather">
                <div class="card-body">
                  <div class="weather-date-location">
                    <h3>{append.name}</h3>
                    <p class="text-gray">
                      <span class="weather-date">
                        {new Date().toLocaleString()}
                      </span>
                      <span class="weather-location"></span>
                    </p>
                  </div>
                  <div class="weather-data d-flex">
                    <div id="search">
                      <input
                        id="input"
                        type="text"
                        onChange={(e) => setText(e.target.value)}
                      />{" "}
                      <button id="button" onClick={handleSearch}>
                        <b style={{ color: "white" }}>SEARCH</b>
                      </button>
                    </div>
                    <div class="mr-auto">
                      <h4 class="display-3">
                        {Math.round(append.main?.temp)}
                        <span class="symbol">&deg;</span>C
                      </h4>
                      <p style={{ marginTop: "-3rem" }} class="text-gray">
                        <span class="weather-date">
                          feels like : {Math.round(append.main?.feels_like)}
                          &deg;C
                        </span>
                        <br />
                        <span class="weather-location">
                          Humidity : {append.main?.humidity}% rh
                        </span>
                      </p>
                      <h3>{append.weather?.map((el) => el.main)}</h3>
                    </div>
                    weather forecast
                    <div>
                      {forecast?.map((el)=>
                         el.clouds
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
