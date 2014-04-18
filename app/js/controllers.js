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

pdControllers.controller('CompareCtrl', ['$scope', 'Country', 'validFilterSortDimensions',
function($scope, Country, validFilterSortDimensions) {
	$scope.selected = null;
	$scope.display = {
		dimension: 'total_prisoners',
		dimensions: validFilterSortDimensions,
	};
  	$scope.goDoStuff = function() {
  		//Nothing yet!
  	};
}]);

pdControllers.controller('TrendsCtrl', ['$scope', 'Country', 'validFilterSortDimensions',
function($scope, Country, validFilterSortDimensions) {
	$scope.selected = null;
	$scope.display = {
		dimension: 'total_prisoners',
		dimensions: validFilterSortDimensions,
	};
}]);



pdControllers.controller('AboutCtrl', ['$scope',
function($scope, Country) {
	//Nothing yet!!!
}]);
})(); 
