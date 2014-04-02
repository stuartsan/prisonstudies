'use strict';

console.log('hisi')

var pdApp = angular.module('prisonDataApp', 
	['prisonDataControllers',
	'prisonDataServices',
	'prisonDataFilters',
	'ngRoute']
);

pdApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/countries', {
			templateUrl: 'partials/countries.html',
			controller: 'CountryListCtrl'
		})
		.when('/map', {
			templateUrl: 'partials/map.html',
			controller: 'MapCtrl'
		})
		// .otherwise({
		// 	redirectTo: '/countries'
		// });

	// $locationProvider.html5Mode(true); //do enable this
}]);