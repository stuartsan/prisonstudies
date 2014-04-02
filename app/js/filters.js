(function () { 
'use strict';

/* Filters */

var pdFilters = angular.module('prisonDataFilters', []);

function existy(x) {
	return x !== null && x !== undefined;
}

function maybe(x, fn) {
	if (!existy(x)) return x;
	else return fn(x);
}

function append(x, y) {
	return maybe(x, function() {
		return x + y;
	});
}

function replace(x, y, z) {
	return maybe(x, function() {
		return x.toString().replace(y, z);
	});
}

pdFilters.filter('fmtPercent', function () {
	return function (x) {
		return append(x, '%');
	};
});

pdFilters.filter('fmtInt', function () {
	return function (x) {
		return replace(x, /\B(?=(\d{3})+(?!\d))/g, ",");
	};
});

pdFilters.filter('fmtPer100k', function () {
	return function (x) {
		return append(x, ' per 100k');
	};
});

pdFilters.filter('naify', function () {
	return function (x) {
		return x || 'N/A';
	};
});
})(); 