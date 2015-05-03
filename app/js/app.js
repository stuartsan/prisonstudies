(function () {
'use strict';

/* Application initialization */

var pdApp = angular.module('prisonDataApp', 
	['prisonDataControllers',
	'prisonDataServices',
	'prisonDataDirectives',
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
		.when('/compare', {
			templateUrl: 'app/partials/compare.html',
			controller: 'CompareCtrl',
			reloadOnSearch: false
		})
		.when('/trends', {
			templateUrl: 'app/partials/trends.html',
			controller: 'TrendsCtrl',
			reloadOnSearch: false
		})
		.when('/about', {
			templateUrl: 'app/partials/about.html',
			controller: 'AboutCtrl'
		})
		.otherwise({
			redirectTo: '/countries'
		});

	// $locationProvider.html5Mode(true); //do enable this
}]);

pdApp.run(['$rootScope', '$location', function ($rootScope, $location) {
    $rootScope.$on('$routeChangeSuccess', function(){
        if (window.ga) ga('send', 'pageview', $location.path());
    });
}]);

})(); 
