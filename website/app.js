/**
 * @author Mohamed Hassanin
 */

/* Global Variables */
const openWeatherBaseUrl = "http://api.openweathermap.org/data/2.5/weather";
const openWeatherApiKey = "75b7469b87e15cbab73d32e900286217";

const appBaseUrl = "http://localhost:3000";
const dataRoute = "/api/data";

/**
 *
 * @param {string} url the end point of OpenWeather API
 * @returns the weather data
 */
const getOpenWeatherData = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  if (data.cod !== 200) {
    throw data.message;
  } else {
    return data;
  }
};

/**
 *
 * @param {string} url the endpoint for the weather
 * @returns the weather data on the local server
 */
const getWeather = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  if (response.status == 200) {
    return await data;
  } else {
    throw response.text();
  }
};

/**
 *
 * @param {string} url the endpoint of weather post request
 * @param {object} data the data to be sent
 * @returns the response data in JSON format
 */
const postWeather = async (url, data) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.status != 200) {
    throw await response.text();
  } else {
    return response.json();
  }
};

/**
 * update UI based on a passed object
 * @param {object} projectData object containing the weather, date and feelings
 * @returns
 */
const updateUI = (projectData) => {
  if (
    !(
      projectData &&
      projectData.hasOwnProperty("temperature") &&
      projectData.hasOwnProperty("date") &&
      projectData.hasOwnProperty("feelings")
    )
  ) {
    return;
  }

  const dateEl = document.getElementById("date");
  const tempEl = document.getElementById("temp");
  const contentEl = document.getElementById("content");
  dateEl.innerHTML = projectData.date;
  tempEl.innerHTML = projectData.temperature + " &#8451;";
  contentEl.innerHTML = projectData.feelings;
};

// add an event handler to the generate button
const btnClickHandler = () => {
  const zipInput = document.getElementById("zip");
  const feelingsInput = document.getElementById("feelings");

  //request weather data from OpenWeather
  const zipCode = zipInput.value;
  const url =
    openWeatherBaseUrl +
    `?zip=${zipCode},us&units=metric&appid=${openWeatherApiKey}`;

  getOpenWeatherData(url)
    .then((data) => {
      const temperature = data.main.temp;
      const projectData = {
        temperature: temperature,
        date: new Date(),
        feelings: feelingsInput.value,
      };
      postWeather(appBaseUrl + dataRoute, projectData)
        .then((projectData) => {
          updateUI(projectData);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });
};

const btn = document.getElementById("generate");
btn.addEventListener("click", btnClickHandler);

const main = () => {
  getWeather(appBaseUrl + dataRoute)
    .then((data) => {
      updateUI(data);
    })
    .catch(() => {});
};

// get the recent data from the server and update UI upon page load
main();
