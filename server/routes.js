'use strict';

var http = require('http');
var config = require('config');
var request = require('request');
var nodeCache = require('node-cache');
var weatherCache = new nodeCache({stdTTL: 3600});
var ow = config.OpenWeather;
var helper = require('./util/helper');

function forecastRequest(req) {
  var promise = new Promise(function(resolve, reject) {
    // prepare request data
    var makeRequest = helper.createForecastRequest(req);
    // make request to openweathermap
    request.get(makeRequest, function(error, response, body) {
        if (!error) {
            var resp = JSON.parse(body);
            // transfore response
            var transformedResponse = helper.createResponse(resp);
            // create cache item
            weatherCache.set(resp.city.name.toLowerCase(), transformedResponse);
            resolve(transformedResponse);
           }
          reject(error)
       });
     })
     return promise;
}

module.exports = {
    getDailyWeather: function (req, res, next) {
        if (req.body) {
            var cachedResult = weatherCache.get(req.body.data.city.toLowerCase());
            if (!cachedResult) {
                forecastRequest(req.body.data).then(function(value) {
                  res.send(value);
                })
            } else {
              // send cached item
              res.send(cachedResult);
            }
        }
    },
    getTodayWeather: function(req, res, next) {
        if (req.body) {
            var tasks = [];
            for (var i in req.body.data.city) {
              var tempTaskParams = {};
              tempTaskParams['city'] = req.body.data.city[i];
              tempTaskParams['count'] = 1;
              tasks.push(forecastRequest(tempTaskParams));
            }
            Promise.all(tasks).then(function(d) {
              res.send(d.filter(function(el) {return el}));
            })
        }
    }
};
