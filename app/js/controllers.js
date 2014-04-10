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

	$scope.dimensions = validFilterSortDimensions;
	$scope.dimension = 'total_prisoners'; 
	$scope.data = null;	                  // Array of country data, not yet merged with country codes
	$scope.hash = null; 				  // Provides country data lookup by country code
	$scope.ready = false;

	$scope.currentCountry = null;
		
	$scope.data = Country.query(function(d) {
		$scope.hash = d.reduce(function(acc, item) {
			acc[item.country_code] = item;
			delete acc[item.country_code].country_code;
			return acc;
		}, {});
		$scope.ready = true;
	});
}]);
})(); 