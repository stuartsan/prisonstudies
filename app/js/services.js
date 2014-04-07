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

pdServices.factory('drawMapD3', ['validFilterSortDimensions', 'World', 
  function(dims, World) {
	return function(data, hash, dimension) {

		var min = d3.min(data, function(item) {return item[dimension];}),
			max = d3.max(data, function(item) {return item[dimension];}),
			domain = dims[dimension] && dims[dimension].thresholds || [min, max],
			colorScale = d3.scale.threshold().domain(domain).range(['q0', 'q1', 'q2', 'q3', 'q4']),
			width = 1100,
	    	height = 500;

	    d3.selectAll('svg').remove();

		var svg = d3.select('#map').append('svg')
			.attr('width', width)
			.attr('height', height);

		World.query(function(world) {

			var countries = topojson.feature(world, world.objects.intermediate).features,
				projection = d3.geo.mercator().scale(150).translate([width / 2, height / 1.5]),
				path = d3.geo.path().projection(projection);

			svg.selectAll(".country")
				.data(countries)
			.enter().append("path")
				.attr("class", function(d) { 
					var pData = hash[d.properties.adm0_a3],
						classes = ['country'];
					if (!pData) classes.push('na'); 
					else classes.push(colorScale(pData[dimension]));
					return classes.join(' ');
				})
				.attr("d", path);
		});
	};
}]);
})(); 