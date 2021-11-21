// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express");

// Start up an instance of app
const app = express();

/* Middleware*/
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Setup Server
const port = 3000;

// Express to run server and routes

/**
 * @ret the projectData object
 */
app.get("/api/data", (req, res) => {
  res.status(200).send(projectData);
});

app.post("/api/data", (req, res) => {
  const data = req.body;
  if (
    data.hasOwnProperty("temperature") &&
    data.hasOwnProperty("date") &&
    data.hasOwnProperty("feelings")
  ) {
    projectData = { ...data };
    console.log(projectData);
    res.status(200).send(projectData);
  } else {
    res.status(400).send("Invalid JSON object");
  }
});

// Start up an instance of app
app.listen(port, () => {
  console.log(`running on localhost: ${port}`);
});
