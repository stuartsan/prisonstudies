(function () {		
'use strict';

/* Controllers */

var pdControllers = angular.module('prisonDataControllers', []);

pdControllers.controller('navCtrl', ['$scope', '$location', 
function($scope, $location) {
	$scope.paths = { countryList: 'countries', map: 'map' };
	$scope.setClass = function(path) {
		return $location.path().slice(1) === path ? 'active' : '';
	};
}]);

pdControllers.controller('CountryListCtrl', ['$scope', 'Country', 'validFilterSortDimensions', 
function($scope, Country, validFilterSortDimensions){
  	$scope.display = {
		dimension: 'total_prisoners',
		dimensions: validFilterSortDimensions,
		descending: true
  	};
	$scope.countries = Country.query();
	$scope.orderFn = function(country) {
		var x = country[$scope.display.dimension];
   		return x === null || x === undefined ? 0 : x;
	};
}]);

pdControllers.controller('MapCtrl', ['$scope', 'Country', 'validFilterSortDimensions',
function($scope, Country, validFilterSortDimensions) {
  	$scope.display = {
		dimensions: validFilterSortDimensions,
		dimension: 'total_prisoners',
		currentCountry: null
  	};
	$scope.ready = false;
	$scope.hash = Country.queryHash(function() {
		$scope.ready = true;
	});
}]);
})(); 