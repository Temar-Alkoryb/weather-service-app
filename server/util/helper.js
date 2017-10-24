'use strict';

var config = require('config');
var ow = config.OpenWeather;

// Transform openWeatherData response
function createResponse(openWeatherData) {
  if (openWeatherData) {
    var list = openWeatherData.list;
    var request = {
      "location": {
        "name": openWeatherData.city.name,
        "country": openWeatherData.city.country
      }
    };
    request.forecast = list.map(function(el) {
      return {
        "date": new Date(el.dt * 1000).toISOString().split('T')[0],
        "summary": el.weather[0].description,
        "temp": {"day": el.temp.day, "night": el.temp.night},
        "wind": {"direction": windDirection(el.deg), "speed": el.speed}
      };
    });
    return request;
  }
}

// Calculate wind direction
function windDirection(degree) {
  var sectors = ['North','Northeast','East','Southeast','South','Southwest','West','Northwest'];
  degree += 22.5;
  if (degree < 0) {
    degree = 360 - Math.abs(degree) % 360;
  } else {
    degree = degree % 360;
  }
  var which = parseInt(degree / 45);
  return sectors[which];
}

// Create request for openWeatherData
function createForecastRequest(data) {
  return {
    "url": ow.url.forecast + data.city + "&mode=" +
          ow.mode + "&units=" + ow.units + "&cnt=" +
          data.count + "&apikey=" + ow.apikey
  }
}

module.exports = {
  createResponse: createResponse,
  createForecastRequest: createForecastRequest
}
