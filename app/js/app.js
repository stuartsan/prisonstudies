'use strict';

var pdApp = angular.module('prisonDataApp', 
	['prisonDataControllers',
	'prisonDataServices',
	'prisonDataFilters',
	'ngRoute']
);

pdApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
	$routeProvider
		.when('/countries', {
			templateUrl: 'app/partials/countries.html',
			controller: 'CountryListCtrl'
		})
		.when('/map', {
			templateUrl: 'app/partials/map.html',
			controller: 'MapCtrl'
		})
		// .otherwise({
		// 	redirectTo: '/countries'
		// });

	// $locationProvider.html5Mode(true); //do enable this
}]);