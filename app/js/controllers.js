(function () {		
'use strict';

/* Controllers */

var pdControllers = angular.module('prisonDataControllers', []);

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

pdControllers.controller('CompareCtrl', ['$scope', 'Country',
function($scope, Country) {
	$scope.selected = null;
  	$scope.countries = Country.query();
  	$scope.goDoStuff = function() {
  		//Nothing yet!
  	};
}]);

pdControllers.controller('AboutCtrl', ['$scope',
function($scope, Country) {
	//Nothing yet!!!
}]);
})(); 
