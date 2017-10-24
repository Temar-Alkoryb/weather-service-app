angular.module('weatherAppService', [])

	.factory('weatherAppService', ['$http',function($http) {

		var _getDailyWeather = function(req) {
			return $http.post('/api/weather/daily', {"data": req});
		}
		var _getTodayWeather = function(req) {
			return $http.post('/api/weather/today', {"data": req});
		}
		return {
			getDailyWeather: _getDailyWeather,
			getTodayWeather: _getTodayWeather
		}
	}]);
