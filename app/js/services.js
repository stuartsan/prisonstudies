(function() { 
'use strict';

/* Services */

var pdServices = angular.module('prisonDataServices', ['ngResource']);

/**
 * Country service returns a resource object with a customized GET method
 * that transforms the JSON data (an array of objects) into an object where
 * key = country code and value = country data. Angular is smart enough to make
 * just one request for both methods, caching the result.
 */
pdServices.factory('Country', ['$resource',
function($resource){
	var FEED_URL = 'http://prisonstudies.org/sites/prisonstudies.org' +
				   '/tool/app/dataexport.json';
	var parseFloatNum = function(n) {
		var res = parseFloat(n, 10);
		if (isNaN(res)) return null;
		return res;
	};
	var parseJSON = function(x) {
			if (!x) return null;
			return JSON.parse(x);
	};
	var transformFields = {
		country_code: function(x) {
			return x.toUpperCase();
		},
		female_prisoners: parseFloatNum,
		juveniles: parseFloatNum,
		foreign_prisoners: parseFloatNum,
		nid: parseFloatNum,
		occupancy_level: parseFloatNum,
		official_capacity: parseFloatNum,
		pretrial_detainee_rate: parseFloatNum,
		prison_pop_rate: parseFloatNum,
		total_prisoners: parseFloatNum,
		total_establishments: parseFloatNum,
		trend: parseJSON 
	};
	var mapFields = function(data) {
		var res = {};
		angular.forEach(data, function(val, key) {
			res[key] = (key in transformFields) ?
				transformFields[key](val) : val;
		});
		return res;
	};
    return $resource('app/data.json', {/* default params */}, {
      	query: {
      		method: 'GET',
      		cache: true,
      		isArray: true,
      		transformResponse: function(data) {
      			return JSON.parse(data).map(mapFields);
      		}
      	},
    	queryHash: {
    		method: 'GET', 
      		cache: true,
      		transformResponse: function(data) {
      			return JSON.parse(data).reduce(function(acc, item) {
					var mapped = mapFields(item);
					var key = mapped.country_code;
					delete mapped.country_code;
					acc[key] = mapped;
					return acc;
				}, {});
      		}
      	}
    });
 }]);

/**
 * Just grabs a JSON file. Returns resource object.
 */
pdServices.factory('World', ['$resource',
function($resource){
    return $resource('app/theworld.json', {}, {
      query: {method: 'GET', cache: true}
    });
 }]);

/**
 * Paths to feed navigation menus. Allows paths to be added at runtime. Why not!?
 */
 pdServices.factory('paths', function() {
 	var paths = [
		{path: 'countries', label: 'Lookup'}, 
		{path: 'map', label: 'Map'}, 
		{path: 'compare', label: 'Compare'},
		{path: 'trends', label: 'Trends'},
		{path: 'about', label: 'About'}
	];
 	return {
 		paths: paths,
 		addPath: function(path) {
 			paths.push(path);
 			return path;
 		},
 		removePath: function(path) {
 			for (var i = 0, l = paths.length; i < l; i++) {
 				if (paths[i].path === path) {
 					return paths.splice(i, 1);
 				}
 			}
 		}
 	};
 }); 

/**
 * Provides allowed data dimensions to sort, filter, etc., countries.
 */
pdServices.value('validFilterSortDimensions', { 
	total_prisoners: {label: 'Total prisoners', thresholds: [25000,70000,150000,700000, 2500000]},
	prison_pop_rate: {label: 'Prison population rate (imprisoned per 100k)', thresholds: [2,50,250,600,750]},
	female_prisoners: {label: 'Female prisoners (%)', thresholds: [1,3,6,9,14]},
	juveniles: {label: 'Juvenile prisoners (%)', thresholds: [1,2,3,10,18]},
	foreign_prisoners: {label: 'Foreign prisoners (%)', thresholds: [1, 3, 6, 40, 100]},
	official_capacity: {label: 'Official capacity', thresholds: [25000,70000,150000,700000, 2500000]},
	occupancy_level: {label: 'Occupancy level (%)', thresholds: [40,75,100,200,450]},
	total_establishments: {label: 'Total establishments', thresholds: [5,100,1000,2500,4600]},
	pretrial_detainee_rate: {label: 'Pretrial detainees (%)', thresholds: [3, 10, 25, 60, 90]}
});
})(); 
