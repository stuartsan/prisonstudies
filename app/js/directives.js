(function () {
'use strict';

var pdDirectives = angular.module('prisonDataDirectives', []);

pdDirectives.directive('toolTipLink', function() {
	return {
		restrict: 'E',
		scope: {
			comment: '='
		},
		replace: true,
		template: '<a class="comment-entry" title="{{comment | stripParens}}" ng-show="{{!!comment}}">?</a>'
	};
});

pdDirectives.directive('choropleth', ['$compile','validFilterSortDimensions', 'World', 
  function($compile, dims, World) {
  	return {
  		restrict: 'E',
  		replace: true,
  		link: function(scope, element, attrs) {

	    	function addMap(w, h) {
			    d3.select(element[0]).selectAll('svg').remove();
				return d3.select(element[0]).append('svg').attr('width', w).attr('height', h);
	    	}
	    	
	    	element.bind('mouseover', function(e) {
	    		if (e.target.attributes && e.target.attributes.cc) {
	    			scope.$apply(function() {
	    				scope.currentCountry = e.target.attributes.cc.value;
	    			});
	    		}
	    	});

			scope.$watchCollection('[ready, dimension]', function(newVals, oldVals, scope) {

				// Grab some references
				var hash = scope.hash,
  					dimension = scope.dimension,
  					data = scope.data,
					ready = newVals[0];

				// d3 choropleth setup
				var width = 1100,
					height = 500,
				 	min = d3.min(data, function(item) {return item[dimension];}),
					max = d3.max(data, function(item) {return item[dimension];}),
					domain = dims[dimension] && dims[dimension].thresholds || [min, max],
					colorScale = d3.scale.threshold().domain(domain).range(['q0', 'q1', 'q2', 'q3', 'q4']),
					projection = d3.geo.mercator().scale(150).translate([width / 2, height / 1.5]),
					path = d3.geo.path().projection(projection);
				
				if (!ready) return; 

				var svg = addMap(width, height);

				World.query(function(world) {

					var countries = topojson.feature(world, world.objects.intermediate).features;

					svg.selectAll('.country')
						.data(countries)
					.enter().append('path')
						.attr('class', function(d) { 
							var pData = hash[d.properties.adm0_a3],
								classes = ['country'];
							if (!pData) classes.push('na'); 
							else classes.push(colorScale(pData[dimension]));
							return classes.join(' ');
						})
						.attr('cc', function(d) {
							return d.properties.adm0_a3;
						})
						.attr('d', path);
				});
				
			});
  		}
  	};
}]);
})();