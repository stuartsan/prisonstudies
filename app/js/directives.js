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
  			hash: '=',
  			currentCountry: '='
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
	    			scope.$apply(function() {
	    				scope.currentCountry = 
	    					e.target.attributes && e.target.attributes.cc ?  
	    						e.target.attributes.cc.value 
	    						: null;
	    			});
	    	});
  		}
  	};
}]);

pdDirectives.directive('barChart', ['$location', function($location) {
	return {
		scope: {
  			dimension: '=',
  			ready: '=',
  			hash: '=',
  			selected: '=',
  			label: '='
  		},
		restrict: 'E',
		replace: true,
		link: function(scope, element, attrs) {

			element.append('<h2 class="label">'+scope.label+'</h2>');

			var margin = {top: 45, right: 20, bottom: 25, left: 90},
			    width = 300 - margin.left - margin.right,
			    height = 300 - margin.top - margin.bottom;

			var x = d3.scale.ordinal()
			    .rangeRoundBands([0, width], 0.1);


			var y = d3.scale.linear()
			    .range([height, 0]);

			var xAxis = d3.svg.axis()
			    .scale(x)
			    .orient("bottom");

			var yAxis = d3.svg.axis()
			    .scale(y)
			    .orient("left");

			var svg = d3.select(element[0]).append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
				.append("g")
			    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			scope.$watch('selected', function() {
				if (scope.selected === null) return;
				renderCharts();
				if (scope.selected.length) {
					$location.search({countries: scope.selected.join(',')});
				}
			});

			function renderCharts() {
				svg.selectAll('g, rect').remove();

				var selectedCountries = scope.selected;
				x.domain(selectedCountries);
				
				//Need max of all selected to set y domain
				var maxVal = selectedCountries.reduce(function(acc, item){
						var val = scope.hash[item][scope.dimension];
						return val > acc ? val : acc;
					}, 0);
				y.domain([0, maxVal]);

				//Append axes
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
				  .style("text-anchor", "end");

				//Draw bars
				svg.selectAll(".bar")
					.data(selectedCountries)
				.enter().append("rect")
					.attr("x", function(d) { return x(d); })
					.attr("width", x.rangeBand())
					.attr("y", function(d) { return y(scope.hash[d][scope.dimension]); })
					.attr("height", function(d) { return height - y(scope.hash[d][scope.dimension]); });
			}
		}
	};
}]);

pdDirectives.directive('plot', ['$location', function($location) {
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

			//General D3 setup
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
			    .ticks(9, d3.format(",r"));

			var line = d3.svg.line()
			    .x(function(d) { return x(d[0]); })	
			    .y(function(d) { return y(d[1]); });

			var svg = d3.select(element[0]).append("svg")
			    .attr("width", width + margin.left + margin.right)
			    .attr("height", height + margin.top + margin.bottom)
			  	.append("g")
			    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			scope.$watchCollection('[selected, dimension]', function(newVals, oldVals) {
				var selectedCountries = newVals[0];
				if (selectedCountries === null) return;
				
				var dimension = newVals[1];
				var searchParams = {dimension: dimension};
				if (selectedCountries.length) {
					searchParams.countries = selectedCountries.join(',');
				} 
				$location.search(searchParams);
				renderPlot(selectedCountries);
			});

			function renderPlot(selectedCountries) {
					svg.selectAll('g g, svg path').remove();
					/**
					 * Transform the data to combine matching data fields
					 * across all the countries. We need to find the min and max
					 * values for each field to calculate x and y domain.
					 */
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
					
					x.domain(d3.extent(allYears));

					y.domain(d3.extent(
						({total_prisoners: allPrisoners, 
						prison_pop_rate: allPops})[scope.dimension]
					));

					var label = ({total_prisoners: 'Total Prisoners', 
						prison_pop_rate: 'People imprisoned per 100k'})[scope.dimension];

					// Append axes
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
					
					// For each country, plot a line.
					selectedCountries.forEach(function(country, idx) {

						/**
						 * Each trend data point is represented by an array consisting of
						 * [year, total_prisoners, prison_pop_rate]. So depending on 
						 * the selected dimension, we only pass along the year and one
						 * data point representing the dimension to be plotted.
						 */
						var countryData = scope.hash[country].trend.map(function(item) {
							var year = item[0],
								dimension = ({total_prisoners: item[1], 
											  prison_pop_rate: item[2]})[scope.dimension];
								return [year, dimension];
						});

						// Calculate a random color for the plotted line and its corresponding
						// item in the select2 select component
						var randomColor = d3.scale.category20().domain(selectedCountries)(country); 
						$('.select2-search-choice').eq(idx).css('border-color', randomColor);
						
						svg.append("path")
							.datum(countryData)
							.attr("fill", "none")
							.attr("stroke-width", "2px")
							.attr("opacity", "0")
							.attr("stroke", randomColor)
							.attr("d", line)
							.transition().duration(500)
							.attr("opacity", "1");

				});
				
			}
		}
	};
}]);

})();