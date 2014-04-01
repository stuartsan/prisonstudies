'use strict';

/* Controllers */

var pdControllers = angular.module('prisonDataControllers', []);

pdControllers.controller('navCtrl', ['$scope', '$location', function($scope, $location) {
	$scope.paths = { countryList: 'countries', map: 'map' };
	$scope.setClass = function(path) {
		return $location.path().slice(1) === path ? 'active' : '';
	}
}]);

pdControllers.controller('CountryListCtrl', ['$scope', 'Country', function($scope, Country){
	$scope.order = 'total_prisoners'
	$scope.descending = true
	$scope.countries = Country.query();
}]);

pdControllers.controller('MapCtrl', ['$scope', function($scope) {
	var width = 960,
    	height = 450;

	var svg = d3.select('#map').append('svg')
	    .attr('width', width)
	    .attr('height', height);


	d3.json('/app/theworld.json', function(err, world) {
		console.log('doing it')
		var countries = topojson.feature(world, world.objects.intermediate).features
		var projection = d3.geo.mercator().scale(200);
		var path = d3.geo.path().projection(projection);

		svg.append("path")
	      .datum(countries)
	      .attr("d", path);

	      svg.selectAll(".subunit")
		    .data(countries)
		  .enter().append("path")
		    .attr("fill", function(d) { return '#'+Math.floor(Math.random()*16777215).toString(16); })
		    .attr("d", path);
	})
	


}]);