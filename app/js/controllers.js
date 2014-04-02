'use strict';

/* Controllers */

var pdControllers = angular.module('prisonDataControllers', []);

pdControllers.controller('navCtrl', ['$scope', '$location', function($scope, $location) {
	$scope.paths = { countryList: 'countries', map: 'map' };
	$scope.setClass = function(path) {
		return $location.path().slice(1) === path ? 'active' : '';
	}
}]);

pdControllers.controller('CountryListCtrl', ['$scope', 'Country', function($scope, Country){
	$scope.order = 'total_prisoners'
	$scope.descending = true
	$scope.countries = Country.query();
}]);

pdControllers.controller('MapCtrl', ['$scope', 'Country', 'countryCodeLookup', 'drawMapD3',
function($scope, Country, countryCodeLookup, drawMapD3) {

	$scope.dimension = 'total_prisoners'; // Set default data dimension to visualize
	$scope.data = null;	                  // Array of country data, not yet merged with country codes
	$scope.hash = null; 				  // Provides country data lookup by country code
	
	$scope.data = Country.query(function(d) {
		$scope.hash = d.reduce(function(acc, item) {
			acc[countryCodeLookup[item.name]] = item;
			return acc;
		}, {});
		$scope.drawMap($scope.data, $scope.hash, $scope.dimension);
	});

	$scope.drawMap = drawMapD3;	
}]);