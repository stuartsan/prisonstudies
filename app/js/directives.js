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

/**
 * Choropleth directive allows us to drop a choropleth map into the dom, when the data it needs is ready.
 */
pdDirectives.directive('choropleth', ['$compile','validFilterSortDimensions', 'World', 
function($compile, dims, World) {
  	return {
  		restrict: 'E',
  		replace: true,
  		scope: {
  			dimension: '=',
  			ready: '=',
  			hash: '='
  		},
  		link: function(scope, element, attrs) {

  			// One-time D3 setup
  			var width = 1100,
  				height = 500,
				projection = d3.geo.mercator().scale(150).translate([width / 2, height / 1.5]),
				path = d3.geo.path().projection(projection);
  				
  			// References
			var hash = scope.hash,
				data = d3.values(hash),
				countries,  // Country data
				svg;        // Reference to SVG element			
			
			// Helper functions to set this party started
			function lookupGenerator(obj) {
				return function(prop) {
					return obj[prop];
				}
			}
			var countryLookup = lookupGenerator(hash);

			// Returns a function that takes an object and looks up arbitrarily
			// nested properties using dot notation, provided by propStr
			function getProp(propStr) {
				var props = propStr.split('.');
				return function(obj) {
					return props.reduce(function(acc, item) {
						return acc[item];
					}, obj);
				}	
			}	

			function assignClass(dimension, colorScale, countryCode) {
				var data = countryLookup(countryCode);
				return ['country', (data && colorScale(data[dimension])) || 'na'].join(' ');
			}

			// Keep an eye on readiness and the selected dimension. When these change, draw map or update CSS classes.
			scope.$watchCollection('[ready, dimension]', function(newVals, oldVals, scope) {

				// D3 dynamic vars
				var ready = newVals[0],
					dimension = newVals[1],
					domain = dims[dimension].thresholds,
					colorScale = d3.scale.threshold().domain(domain).range(['q0', 'q1', 'q2', 'q3', 'q4']),
					assignCountryClass = function(obj) {
						return assignClass.call(null, dimension, colorScale, getProp('properties.adm0_a3')(obj));
					}

				if (!ready) return; 

				if (!svg) {
					// Add svg to element, assign to a reference that persists between calls to this fn
					svg = d3.select(element[0]).append('svg')
						.attr('width', width)
						.attr('height', height);

					// Get geoJSON data and draw map
					World.query(function(world) {
						var countries = topojson.feature(world, world.objects.intermediate).features;
						svg.selectAll('.country')
							.data(countries)
							.enter().append('path')
								.attr('class', assignCountryClass)
								.attr('cc', getProp('properties.adm0_a3'))
								.attr('d', path);
					});
				} 
				else {
					// Just update the CSS classes instead of redrawing the map
					svg.selectAll('.country')
						.attr('class', assignCountryClass);
				}

			});

  			// Display a bit of data about hovered-over country in the template
	    	element.bind('mouseover', function(e) {
	    		if (e.target.attributes && e.target.attributes.cc) {
	    			scope.$apply(function() {
	    				scope.currentCountry = e.target.attributes.cc.value;
	    			});
	    		}
	    	});
  		}
  	};
}]);
})();