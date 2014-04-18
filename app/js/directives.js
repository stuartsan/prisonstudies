(function () {
'use strict';

var pdDirectives = angular.module('prisonDataDirectives', ['ui.select2']);

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
				};
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
				};	
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
					};

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

pdDirectives.directive('barChart', [function() {
	return {
		scope: {
  			dimension: '=',
  			ready: '=',
  			hash: '=',
  		},
		restrict: 'E',
		replace: true,
		link: function(scope, element, attrs) {
			var width = 300;
			var height = 300;

			var svg = d3.select(element[0]).append('svg')
				.attr('width', width)
				.attr('height', height);

			//Really do this stuff AFTER WATCHING READY...

			svg.selectAll('.bar')
				.data(scope.hash)
				.enter().append('path');


		}
	};
}]);

pdDirectives.directive('plot', [function() {
	return {
		scope: {
  			dimension: '=',
  			ready: '=',
  			hash: '=',
  			selected: '='
  		},
		restrict: 'E',
		replace: true,
		link: function(scope, element, attrs) {
			var margin = {top: 20, right: 20, bottom: 30, left: 100},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

			var x = d3.scale.linear()
				.range([0, width]);

			var y = d3.scale.log()
				.range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom")
			    .tickFormat(d3.format("d"));

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left")
			    .tickFormat(d3.format("r"));

			var line = d3.svg.line()
			    .x(function(d) { return x(d[0]); })	
			    .y(function(d) { return y(d[1]); });


			var svg = d3.select(element[0]).append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  .append("g")
			    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
			
			scope.$watch('selected', function(newVal, oldVal) {


				if (newVal === null) return;

				$('svg g g, svg path').remove();
				
				var selectedCountries = newVal;
				
				var arrayParty = selectedCountries.reduce(function(acc, item, idx){
					return acc.concat(scope.hash[item].trend);
				}, [])
					.reduce(function(acc, item, idx) {
						acc[0].push(item[0]);
						acc[1].push(item[1]);
						acc[2].push(item[2]);
						return acc;
					}, [[],[],[]]);


				var allYears = arrayParty[0];
				var allPrisoners = arrayParty[1];
				var allPops = arrayParty[2];

				var label = "Total Prisoners";
				
				x.domain(d3.extent(allYears));
				y.domain(d3.extent(allPrisoners)); //Make dynamic!

				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis);

				svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
				.append("text")
					.attr("transform", "rotate(-90)")
					.attr("y", 6)
					.attr("dy", ".71em")
					.style("text-anchor", "end")
					.text(label);
				
				selectedCountries.forEach(function(country) {
					var countryData = scope.hash[country].trend;

					svg.append("path")
						.datum(countryData)
						.attr("fill", "none")
						.attr("stroke-width", "2px")
						.attr("opacity", "0")
						.attr("stroke", '#'+Math.floor(Math.random()*16777215).toString(16))
						.attr("d", line)
						.transition().duration(500)
						.attr("opacity", "1");
				});
			});
		}
	};
}]);

})();