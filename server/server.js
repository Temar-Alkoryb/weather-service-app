'use strict';

var express = require('express');
var app = express();
var config = require('config');
var port = process.env.PORT || 8080;
var morgan = require('morgan');
var bodyParser = require('body-parser');
var routes = require('./routes');

app.use(express.static('../app'));
// log requests to the console
app.use(morgan('dev'));

app.use(function(req, res, next) {
  var allowedOrigins = config.AllowedOrigins;
  var origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'PUT, OPTIONS, GET, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Api-Key');
  next();
});

app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());

var router = express.Router();

// Get daily weather (1 to 16 days) for chosen city
router.post('/weather/daily', routes.getDailyWeather);
// Get current weather for multipel cities
router.post('/weather/today', routes.getTodayWeather);

app.use('/api', router);

app.listen(port);
console.log("App listening on port " + port);
