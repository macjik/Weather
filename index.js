import {
  cloudsIcon,
  clearIcon,
  rainIcon,
  snowIcon,
  thunderIcon,
} from "./weatherIcons.js";

const main = document.querySelector("main");
const input = document.querySelector("input");
const resultBox = document.querySelector(".result-box");
const defaultWeather = document.querySelector(".default-weather");
const searchInput = document.querySelector(".input-group");
const autocompleteBox = document.querySelector(".autocomplete-box");
const selectCity = document.querySelector(".select-city");

const searchWeatherBox = document.createElement("div");
searchWeatherBox.className = "searched-weather";

main.append(searchWeatherBox);

const arr = [];
export const apiKey = "f8a1de17acc28031a2d525b8a27fc43a";

const weather = async () => {
  const card = document.createElement("div");
  card.className = "card-deck main-card";
  const countryCard = document.createElement("div");
  countryCard.className = "card country-card";
  const humidityCard = document.createElement("div");
  humidityCard.className = "card humidity-card";
  const windSpeedCard = document.createElement("div");
  windSpeedCard.className = "card windSpeed-card";
  const feelsLikeCard = document.createElement("div");
  feelsLikeCard.className = "card feelsLike-card";

  const city = document.createElement("h6");
  city.className = "City";
  const Country = document.createElement("h6");
  Country.className = "country";
  const time = document.createElement("p");
  time.className = "time";
  const Weather = document.createElement("div");
  Weather.className = "weather";
  const WindSpeed = document.createElement("h6");
  WindSpeed.className = "wind-speed";
  const temp = document.createElement("h6");
  temp.className = "Temperature";
  const FeelsLike = document.createElement("h6");
  FeelsLike.className = "temp-feel";
  const Humidity = document.createElement("h6");
  Humidity.className = "humidity";
  const Clouds = document.createElement("div");
  Clouds.className = "clouds";
  const weatherIcon = document.createElement("div");
  weatherIcon.className = "Weather-Icon";

  fetch(`https://countriesnow.space/api/v0.1/countries`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const Data = data.data;
      const mapped = Data.map((cities) => cities.cities);
      for (const city of mapped) {
        for (const c of city) {
          arr.push(c);
        }
      }
      console.log(arr);

      input.addEventListener("keyup", (e) => {
        let userData = e.target.value;
        let emptyArr = [];
        if (userData) {
          fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${userData}&appid=${apiKey}&units=metric`
          )
            .then((response) => response.json())
            .then((data) => {
              if (e.key === "Enter") {
                console.log(data);
                const cityName = data.name;
                const cityTimeZone = data.timezone;
                const clouds = data.clouds;
                const weather = data.weather[0].main;
                const countryName = data.sys.country;
                const windSpeed = data.wind.speed;
                const temperature = data.main.temp;
                const feelsLike = data.main.feels_like;
                const humidity = data.main.humidity;

                fetch("https://restcountries.com/v3.1/all")
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data);
                    for (const abb of data) {
                      if (abb.cca2 == countryName) {
                        const country = abb.name.common;
                        console.log(country);

                        city.textContent = cityName;
                        Country.textContent = country;
                        time.textContent = cityTimeZone;
                        Weather.innerHTML = weather;
                        WindSpeed.textContent =
                          `Wind Speed ${Math.round(windSpeed)}` + " m/s";
                        temp.textContent =
                          `${Math.round(temperature)} ` + " °C";
                        FeelsLike.textContent =
                          `Feels like ${Math.round(feelsLike)} ` + " °C";
                        Humidity.innerHTML = `Humidity: ${humidity}%`;

                        card.append(city, time, Weather, temp, weatherIcon);
                        console.log(Weather);
                        searchWeatherBox.append(card);

                        card.style.position = "relative; bottom: 50px";

                        countryCard.append(Country);
                        humidityCard.append(Humidity);
                        windSpeedCard.append(WindSpeed);
                        feelsLikeCard.append(FeelsLike);

                        card.append(
                          countryCard,
                          humidityCard,
                          windSpeedCard,
                          feelsLikeCard
                        );

                        if (Weather.textContent === "Clouds") {
                          weatherIcon.innerHTML = cloudsIcon;
                        }

                        if (Weather.textContent === "Mist") {
                          weatherIcon.innerHTML = cloudsIcon;
                        }

                        if (Weather.textContent === "Clear") {
                          weatherIcon.innerHTML = clearIcon;
                        }

                        if (Weather.textContent === "Rain") {
                          weatherIcon.innerHTML = rainIcon;
                        }

                        if (Weather.textContent === "Snow") {
                          weatherIcon.innerHTML = snowIcon;
                        }
                        if (Weather.textContent === "Thunder") {
                          weatherIcon.innerHTML = thunderIcon;
                        }
                        defaultWeather.style.display = "none";
                      }
                    }
                  });
              }

              emptyArr = arr.filter((data) => {
                return data
                  .toLowerCase()
                  .startsWith(userData.toLocaleLowerCase());
              });

              emptyArr = emptyArr.map((data) => {
                return (data = `<li>${data}</li>`);
              });
              searchInput.classList.add("active");
              showSuggestions(emptyArr);
              const allList = autocompleteBox.querySelectorAll("li");

              allList.forEach((list) => {
                list.addEventListener("click", () => {
                  select(list);
                });
              });
            });
        } else {
          searchInput.classList.remove("active");
        }

        const select = (element) => {
          let selectData = element.textContent;
          input.value = selectData;
          autocompleteBox.addEventListener("click", () => {
            fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${selectData}&appid=${apiKey}&units=metric`
            )
              .then((res) => res.json())
              .then((data) => {
                const cityName = data.name;
                const cityTimeZone = data.timezone;
                const clouds = data.clouds;
                const weather = data.weather[0].main;
                const countryName = data.sys.country;
                const windSpeed = data.wind.speed;
                const temperature = data.main.temp;
                const feelsLike = data.main.feels_like;
                const humidity = data.main.humidity;

                const timeConvert = (offsetSeconds) => {
                  const offset = offsetSeconds / 60 / 60;
                  const date = new Date();
                  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
                  return new Date(utc + 3600000 * offset);
                };

                fetch("https://restcountries.com/v3.1/all")
                  .then((res) => res.json())
                  .then((data) => {
                    console.log(data);
                    for (const abb of data) {
                      if (abb.cca2 == countryName) {
                        const country = abb.name.common;
                        console.log(country);

                        city.textContent = cityName;
                        Country.textContent = country;
                        time.textContent = cityTimeZone;
                        Weather.innerHTML = weather;
                        WindSpeed.textContent =
                          `Wind Speed ${Math.round(windSpeed)}` + " m/s";
                        temp.textContent =
                          `${Math.round(temperature)} ` + " °C";
                        FeelsLike.textContent =
                          `Feels like ${Math.round(feelsLike)} ` + " °C";
                        Humidity.innerHTML = `Humidity ${humidity}%`;
                        card.append(city, time, Weather, temp, weatherIcon);
                        searchWeatherBox.append(card);

                        countryCard.append(Country);
                        humidityCard.append(Humidity);
                        windSpeedCard.append(WindSpeed);
                        feelsLikeCard.append(FeelsLike);

                        card.append(
                          countryCard,
                          humidityCard,
                          windSpeedCard,
                          feelsLikeCard
                        );

                        if (Weather.textContent === "Clouds") {
                          weatherIcon.innerHTML = cloudsIcon;
                        }

                        if (Weather.textContent === "Mist") {
                          weatherIcon.innerHTML = cloudsIcon;
                        }

                        if (Weather.textContent === "Clear") {
                          weatherIcon.innerHTML = clearIcon;
                        }

                        if (Weather.textContent === "Rain") {
                          weatherIcon.innerHTML = rainIcon;
                        }

                        if (Weather.textContent === "Snow") {
                          weatherIcon.innerHTML = snowIcon;
                        }

                        if (Weather.textContent === "Thunder") {
                          weatherIcon.innerHTML = thunderIcon;
                        }
                        defaultWeather.style.display = "none";
                      }
                    }
                  });
              });
          });
          searchInput.classList.remove("active");
        };

        const showSuggestions = (list) => {
          let listData;
          if (!list.length) {
            let userVal = input.value;
            listData = `<li>${userVal}</li>`;
          } else {
            listData = list.join(` `);
          }
          autocompleteBox.innerHTML = listData;
        };
      });
    });
};
weather();

const cityArr = [];
const defaultCitiesWeather = () => {
  fetch(`https://countriesnow.space/api/v0.1/countries`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const Data = data.data;
      const mapped = Data.map((cities) => cities.cities);
      for (const city of mapped) {
        for (const c of city) {
          cityArr.push(c);
        }
      }
      const n = 3;
      const shuffledArray = cityArr.sort(() => 0.5 - Math.random());
      const result = shuffledArray.slice(0, n);
      console.log(result);
      for (const city of result) {
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        )
          .then((response) => response.json())
          .then((data) => {
            console.log(
              data,
              data.name,
              data.sys.country,
              data.weather[0].main,
              data.wind.speed,
              data.main.temp,
              data.main.feels_like,
              data.main.humidity
            );

            const weatherDetails = {
              cityName: data.name,
              cityTimeZone: data.timezone,
              clouds: data.clouds,
              weather: data.weather[0].main,
              countryName: data.sys.country,
              windSpeed: data.wind.speed,
              temperature: data.main.temp,
              feelsLike: data.main.feels_like,
              humidity: data.main.humidity,
            };
            console.log(weatherDetails);

            const defaultMainCard = document.createElement("div");
            defaultMainCard.className = "default-main-card";
            const cardDefault = document.createElement("div");
            cardDefault.className = "card-deck default-card";
            const countryCardDefault = document.createElement("div");
            countryCardDefault.className = "card default-country-card";
            const humidityCardDefault = document.createElement("div");
            humidityCardDefault.className = "card default-humidity-card";
            const windSpeedCardDefault = document.createElement("div");
            windSpeedCardDefault.className = "card default-windSpeed-card";
            const feelsLikeCardDefault = document.createElement("div");
            feelsLikeCardDefault.className = "card default-feelsLike-card";

            const cityDefault = document.createElement("h6");
            cityDefault.className = "default-City";
            const CountryDefault = document.createElement("h6");
            CountryDefault.className = "default-country";
            const timeDefault = document.createElement("p");
            timeDefault.className = "default-time";
            const WeatherDefault = document.createElement("div");
            WeatherDefault.className = "default-weather-icon";
            const WindSpeedDefault = document.createElement("h6");
            WindSpeedDefault.className = "default-wind-speed";
            const tempDefault = document.createElement("h6");
            tempDefault.className = "default-Temperature";
            const FeelsLikeDefault = document.createElement("h6");
            FeelsLikeDefault.className = "default-temp-feel";
            const HumidityDefault = document.createElement("h6");
            HumidityDefault.className = "default-humidity";
            const CloudsDefault = document.createElement("div");
            CloudsDefault.className = "default-clouds";
            const weatherIconDefault = document.createElement("div");
            weatherIconDefault.className = "default-Weather-Icon";

            const countryName = data.sys.country;
            fetch("https://restcountries.com/v3.1/all")
              .then((res) => res.json())
              .then((data) => {
                for (const abb of data) {
                  if (abb.cca2 == countryName) {
                    const country = abb.name.common;
                    console.log(country);

                    cityDefault.textContent = weatherDetails.cityName;
                    CountryDefault.textContent = country;
                    timeDefault.textContent = weatherDetails.cityTimeZone;
                    const weatherCondition = weatherDetails.weather;
                    WindSpeedDefault.textContent =
                      `Wind Speed ${Math.round(weatherDetails.windSpeed)}` +
                      " m/s";
                    tempDefault.textContent =
                      `${Math.round(weatherDetails.temperature)}` + "°C";
                    FeelsLikeDefault.textContent =
                      `Feels like ${Math.round(weatherDetails.feelsLike)} ` +
                      " °C";
                    HumidityDefault.innerHTML = `Humidity: ${weatherDetails.humidity}%`;

                    console.log(weatherDetails.weather);

                    if (weatherCondition === "Clouds") {
                      WeatherDefault.innerHTML = cloudsIcon;
                    }

                    if (weatherCondition === "Mist") {
                      WeatherDefault.innerHTML = cloudsIcon;
                    }

                    if (weatherCondition === "Clear") {
                      WeatherDefault.innerHTML = clearIcon;
                    }

                    if (weatherCondition === "Rain") {
                      WeatherDefault.innerHTML = rainIcon;
                    }

                    if (weatherCondition === "Snow") {
                      WeatherDefault.innerHTML = snowIcon;
                    }

                    if (weatherCondition === "Thunder") {
                      WeatherDefault.innerHTML = thunderIcon;
                    }

                    countryCardDefault.append(CountryDefault);
                    humidityCardDefault.append(HumidityDefault);
                    windSpeedCardDefault.append(WindSpeedDefault);
                    feelsLikeCardDefault.append(FeelsLikeDefault);

                    cardDefault.append(
                      tempDefault,
                      WeatherDefault,
                      cityDefault,
                      weatherIconDefault,
                      countryCardDefault,
                      humidityCardDefault,
                      windSpeedCardDefault,
                      feelsLikeCardDefault
                    );
                    defaultMainCard.append(cardDefault);
                    defaultWeather.append(defaultMainCard);
                  }
                }
              });
          });
      }
    });
};
defaultCitiesWeather();
