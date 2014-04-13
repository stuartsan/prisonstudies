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
    return $resource('app/data.json', {/* default params */}, {
      	query: {
      		method: 'GET',
      		cache: true,
      		isArray: true
      	},
    	queryHash: {
    		method: 'GET', 
      		cache: true,
      		transformResponse: function(data) {
      			return JSON.parse(data).reduce(function(acc, item) {
					acc[item.country_code] = item;
					delete acc[item.country_code].country_code;
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
      query: {method:'GET', cache:true}
    });
 }]);

/**
 * Provides allowed data dimensions to sort, filter, etc., countries.
 */
pdServices.value('validFilterSortDimensions', { 
	total_prisoners: {label: 'Total prisoners', thresholds: [25000,70000,150000,700000, 2500000]},
	prison_pop_rate: {label: 'Prison population rate', thresholds: [2,50,250,600,750]},
	female_prisoners: {label: 'Female prisoners', thresholds: [1,3,6,9,14]},
	juveniles: {label: 'Juvenile prisoners', thresholds: [1,2,3,10,18]},
	foreign_prisoners: {label: 'Foreign prisoners', thresholds: [1, 3, 6, 40, 100]},
	official_capacity: {label: 'Official capacity', thresholds: [25000,70000,150000,700000, 2500000]},
	occupancy_level: {label: 'Occupancy level', thresholds: [40,75,100,200,450]},
	total_establishments: {label: 'Total establishments', thresholds: [5,100,1000,2500,4600]},
	pretrial_detainee_rate: {label: 'Pretrial detainees', thresholds: [3, 10, 25, 60, 90]}
});
})(); 