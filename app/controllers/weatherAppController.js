'use strict';
angular.module('weatherAppController', [])

	.controller('weatherAppController', ['$scope','$http', '$cookies', 'weatherAppService',
															function($scope, $http, $cookies, weatherAppService) {

		$scope.registerWeatherForm = function(form) {
			$scope.weatherForm = form;
		};
		// count select
		$scope.cnt = (function() {
			var arr = [];
			for (var i = 1; i <= 16; i += 1) {
				arr.push(i);
			}
			return arr;
		}());
		$scope.count = $scope.cnt[2];
		$scope.forecast = null;
		$scope.recentCities = [];
		$scope.currentCity = null;
		$scope.selectedCity = { name: '' };

		function updateCookies(value) {
			var tempCookies = $cookies.getObject('recentCities') || [];
			if (tempCookies.indexOf(value) !== -1) {
				return false;
			}
			if (tempCookies.length === 5) {
				tempCookies.pop();
			}
			tempCookies.unshift(value);
			$cookies.putObject('recentCities', tempCookies);
			$scope.recentCities = $cookies.getObject('recentCities');
		}

		function setData(res) {
			if (res) {
				$scope.forecast = res.forecast;
				$scope.currentCity = res.location.name;
				$scope.selectedCity.name = res.location.name
				updateCookies(res.location.name);
			} else {
				$scope.forecast = null;
				$scope.currentCity = null;
			}
		}

		$scope.getRecentForecast = function(city) {
			$scope.weatherForm.$valid = true;
			$scope.getForecast(city);
		}

		$scope.getForecast = function (city) {
			if ($scope.weatherForm.$valid == false) {
				return false;
			}
			var request = {
				"city": city.split(','),
				"count": $scope.count
			}
			// Get single city forecast
			if (request.city.length === 1) {
				request.city = request.city[0];
				weatherAppService.getDailyWeather(request).then(function(res) {
					setData(res.data);
				})
			// Get forecast for multiple cities
			} else {
					request.count = 1;
					weatherAppService.getTodayWeather(request).then(function(res) {
							$scope.forecast = res.data.map(function(el) {
								return el.forecast[0]; // forecast is a single element in an array
							});
							$scope.currentCity = res.data.map(function(el) {
								return el.location.name;
							}).join(', ');
					})
			}
		};

		function init() {
			$scope.recentCities = $cookies.getObject('recentCities');
		}

		init();

}]);
