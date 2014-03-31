'use strict';

/* Filters */

var prisonDataFilters = angular.module('prisonDataFilters', []);

prisonDataFilters.filter('formatPercentage', function () {
	return function (num) {
		return num != null ? num + '%' : 'N/A';
	}
});

prisonDataFilters.filter('formatInt', function () {
	return function (num) {
		return num != null ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A';
	}
});

prisonDataFilters.filter('formatPer100k', function () {
	return function (num) {
		return (num != null && num !== 'N/A') ? num + ' per 100k' : 'N/A';
	}
});