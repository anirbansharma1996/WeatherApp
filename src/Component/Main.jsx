import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Main.css";
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
export const Weather = () => {
  const [append, setAppend] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [text, setText] = useState("");
  let key = "d9a7dab350bb8264d81b26a1254ebb7a";
  //::::::::::::::::::::::::::::::::: daily weather data :::::::::::::::::::::::::::::
  const handleSearch = () => {
    getWeather();
    setText("");
  };
  //::::::::::::::::::::::::::::::::::::: ONCLICK GETTING THE DATA :::::::::::::::::::::::::::::::::
  async function getWeather() {
    let lat = append.coord.lat;
    let lon = append.coord.lon;
    try {
      const [currentWeatherResponse, forecastResponse] = await Promise.all([
        axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${key}&units=metric`
        ),
        axios.get(
          `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely,alerts&units=metric&appid=${key}`
        ),
      ]);
      setAppend(currentWeatherResponse.data);
      setForecast(forecastResponse.data.daily);
    } catch (error) {
      console.log(error);
    }
  }

  //:::::::::::::::::::: WHEN USER OPEN THE APP BY DEFAULT ::::::::::::::::::::

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const apiKey = key;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      const furl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,hourly,minutely,alerts&units=metric&appid=${apiKey}`;
      const fresult = await axios(furl);
      const result = await axios(url);
      setAppend(result.data);
      setForecast(fresult.data.daily);
    });
  }, []);

  //::::::::::::::::::::::::::::::: MAP DATA :::::::::::::::::::::::::::::::::::::

  const Data = () => {
    return (
      <>
        {forecast?.map((el, i) => (
          <div>
            {new Date(el.dt * 1000).toLocaleDateString()}
            <br />
            -----------------
            {el.weather[0].main}
            <img
              style={{ marginTop: "-1rem", marginBottom: "-1rem" }}
              src={`http://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png`}
              alt="Weather icon"
            />
            <br />
            Max : {Math.round(el.temp.max)} &deg;C
            <br />
            Min : {Math.round(el.temp.min)} &deg;C
            <br />
            Wind: {Math.round(el.wind_speed)} kph
          </div>
        ))}
      </>
    );
  };

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
                        value={text}
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
                    <h3>weather forecast</h3>
                    <div id="forecastdiv">
                      <Data />
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

//::::::::::::::::::::: TREE SHAKING :::::::::::::::::
 //   try {
  //     const [currentWeatherResponse, forecastResponse] = await Promise.all([
  //         axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`),
  //         axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`)
  //     ]);
  //     console.log(currentWeatherResponse.data);
  //     console.log(forecastResponse.data);
  // } catch (error) {
  //     console.log(error);
  // }
  //`https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${key}&units=metric`--Main
  //`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,hourly,minutely,alerts&units=metric&appid=${key}`