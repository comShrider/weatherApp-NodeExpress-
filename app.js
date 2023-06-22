const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const { log } = require("console");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = "fdf3618464b76c3defeaa1dac7ad7230";
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, function (response) {
    console.log(response.statusCode);
    if (response.statusCode != 200) {
      res.send("there has been an error");
    } else {
      response.on("data", function (data) {
        const weatherData = JSON.parse(data);
        const desc = weatherData.weather[0].description;
        const temp = weatherData.main.temp;
        const icon = weatherData.weather[0].icon;
        const imgUrl = "https://openweathermap.org/img/wn/" + icon + "@2x.png";

        res.set("Content-Type", "text/html");
        res.write(
          "<h1>The temperature in " + query + " is " + temp + "<br></h1>"
        );
        res.write("<p>The weather in " + query + " is " + desc + "<br></p>");
        res.write("<img src='" + imgUrl + "'>");
        res.send();
      });
    }
  });
});

app.listen(3000, function () {
  console.log("server started successfully..");
});
