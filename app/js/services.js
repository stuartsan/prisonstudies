(function() { 
'use strict';

/* Services */

var pdServices = angular.module('prisonDataServices', ['ngResource']);

pdServices.factory('Country', ['$resource',
  function($resource){
    return $resource('app/data.json', {}, {
      query: {method:'GET', isArray:true, cache:true}
    });
 }]);

pdServices.factory('World', ['$resource',
  function($resource){
    return $resource('app/theworld.json', {}, {
      query: {method:'GET', cache:true}
    });
 }]);

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