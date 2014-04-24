(function () {		
'use strict';

/* Controllers */

var pdControllers = angular.module('prisonDataControllers', []);

pdControllers.controller('MainCtrl', ['$scope', 'Country', 
function($scope, Country){
	$scope.countries = Country.query();
	$scope.hash = Country.queryHash();
}]);

pdControllers.controller('navCtrl', ['$scope', '$location', 'paths', 
function($scope, $location, paths) {
	$scope.paths = paths.paths;
	$scope.setClass = function(path) {
		return $location.path().slice(1) === path ? 'active' : '';
	};
}]);

pdControllers.controller('CountryListCtrl', ['$scope', 'Country', 'validFilterSortDimensions', 
function($scope, Country, validFilterSortDimensions){
	$scope.display = {
		dimension: 'total_prisoners',
		dimensions: validFilterSortDimensions,
		descending: 'true',
  	};
	$scope.orderFn = function(country) {
		var x = country[$scope.display.dimension];
   		return x === null || x === undefined ? 0 : x;
	};
}]);

pdControllers.controller('MapCtrl', ['$scope', 'Country', 'validFilterSortDimensions',
function($scope, Country, validFilterSortDimensions) {
	$scope.display = {
			dimension: 'total_prisoners',
			dimensions: validFilterSortDimensions,
	};
}]);

pdControllers.controller('CompareCtrl', ['$scope', '$location', 'Country', 'validFilterSortDimensions',
function($scope, $location, Country, validFilterSortDimensions) {
	$scope.selected = $location.search().countries ? $location.search().countries.split(',') : [];
	$scope.display = {
		dimensions: validFilterSortDimensions
	};
}]);

pdControllers.controller('TrendsCtrl', ['$scope', '$location', 'Country', 'validFilterSortDimensions',
function($scope, $location, Country, validFilterSortDimensions) {
	$scope.selected = $location.search().countries ? $location.search().countries.split(',') : [];
	$scope.display = {
		dimension: $location.search().dimension ? $location.search().dimension : 'total_prisoners',
		dimensions: validFilterSortDimensions,
	};
}]);



pdControllers.controller('AboutCtrl', ['$scope',
function($scope, Country) {
	//Nothing yet!!!
}]);
})(); 
