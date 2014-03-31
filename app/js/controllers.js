'use strict';

/* Controllers */

var prisonDataControllers = angular.module('prisonDataControllers', []);

prisonDataControllers.controller('navCtrl', ['$scope', '$location', function($scope, $location) {
	$scope.paths = { countryList: 'countries', map: 'map' };
	$scope.setClass = function(path) {
		return $location.path().slice(1) === path ? 'active' : '';
	}
}]);

prisonDataControllers.controller('CountryListCtrl', ['$scope', 'Country', function($scope, Country){
	$scope.order = 'total_prisoners'
	$scope.descending = true
	$scope.countries = Country.query();
}]);

prisonDataControllers.controller('MapCtrl', ['$scope', function($scope) {

}]);