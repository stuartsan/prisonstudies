'use strict';

/* Services */

var pdServices = angular.module('prisonDataServices', ['ngResource']);

// Returns function with a query method that returns all country data
pdServices.factory('Country', ['$resource',
  function($resource){
    return $resource('data.json', {}, {
      query: {method:'GET', isArray:true, cache:true}
    });
  }]);

pdServices.factory('drawMapD3', function() {
	return function(data, hash, dimension) {

		var min = d3.min(data, function(item) {
			return item[dimension];
		});
		
		var max = d3.max(data, function(item) {
			return item[dimension];
		});

		var colorScale = d3.scale.linear().domain([min, max])
			.range(['green', 'red']);


		var width = 1000,
	    	height = 500;

	    d3.selectAll('svg').remove();

		var svg = d3.select('#map').append('svg')
			.attr('width', width)
			.attr('height', height);

		d3.json('/app/theworld.json', function(err, world) {
			
			var countries = topojson.feature(world, world.objects.intermediate).features
			var projection = d3.geo.mercator().scale(200);
			var path = d3.geo.path().projection(projection);


	      svg.selectAll(".country")
		    .data(countries)
		  .enter().append("path")
		    .attr("fill", function(d) { 
		    	var pData = hash[d.properties.adm0_a3]
		    	if (!pData) return 'grey';
		    	return colorScale(pData[dimension]);
		    })
		    .attr("d", path);
		});
	}
});

pdServices.value('countryCodeLookup', {
	"Afghanistan": "AFG",
	"Argentina": "ARG",
	"Andorra": "AND",
	"Angola": "AGO",
	"Armenia": "ARM",
	"Albania": "ALB",
	"Algeria": "DZA",
	"American Samoa  (USA)": "ASM",
	"Antigua and Barbuda": "ATG",
	"Anguilla (United Kingdom)": "AIA",
	"Aruba  (Netherlands)": "ABW",
	"Australia": "AUS",
	"Austria": "AUT",
	"Azerbaijan": "AZE",
	"Bahamas": "BHS",
	"Bahrain": "BHR",
	"Bangladesh": "BGD",
	"Barbados": "BRB",
	"Belarus": "BLR",
	"Belgium": "BEL",
	"Belize": "BLZ",
	"Benin": "BEN",
	"Bermuda (United Kingdom)": "BMU",
	"Bhutan": "BTN",
	"Bolivia": "BOL",
	"Bosnia and Herzegovina: Federation": "BIH",
	"Bosnia and Herzegovina: Republika Srpska": "BIH",
	"Botswana": "BWA",
	"Brazil": "BRA",
	"Brunei Darussalam": "BRN",
	"Bulgaria": "BGR",
	"Burkina Faso": "BFA",
	"Burundi": "BDI",
	"Cambodia": "KHM",
	"Cameroon": "CMR",
	"Canada": "CAN",
	"Cape Verde  (Cabo Verde)": "CPV",
	"Cayman Islands  (United Kingdom)": "CYM",
	"Central African Republic": "CAF",
	"Chad": "TCD",
	"Chile": "CHL",
	"China": "CHN",
	"Colombia": "COL",
	"Comoros": "COM",
	"Congo (Brazzaville)": "COG",
	"Cook Islands  (New Zealand)": "COK",
	"Costa Rica": "CRI",
	"Cote d'Ivoire": "CIV",
	"Croatia": "HRV",
	"Cuba": "CUB",
	"Curaçao (Netherlands)": "CUW",
	"Cyprus (Republic of)": "CYP",
	"Czech Republic": "CZE",
	"Democratic People's Republic of (North) Korea": "PRK",
	"Democratic Republic of Congo (formerly Zaire)": "COD",
	"Denmark": "DNK",
	"Djibouti": "DJI",
	"Dominica": "DMA",
	"Dominican Republic": "DOM",
	"Ecuador": "ECU",
	"Egypt": "EGY",
	"El Salvador": "SLV",
	"Equatorial Guinea": "GNQ",
	"Eritrea": "ERI",
	"Estonia": "EST",
	"Ethiopia": "ETH",
	"Faeroe Islands  (Denmark)": "FRO",
	"Fiji": "FJI",
	"Finland": "FIN",
	"France": "FRA",
	"French Guiana/Guyane (France)": "GUF",
	"French Polynesia  (France)": "PYF",
	"Gabon": "GAB",
	"Gambia": "GMB",
	"Georgia": "GEO",
	"Germany": "DEU",
	"Ghana": "GHA",
	"Gibraltar  (United Kingdom)": "GIB",
	"Greece": "GRC",
	"Greenland (Denmark)": "GRL",
	"Grenada": "GRD",
	"Guadeloupe  (France)": "GLP",
	"Guam  (USA)": "GUM",
	"Guatemala": "GTM",
	"Guernsey  (United Kingdom)": "GGY",
	"Guinea Bissau": "GNB",
	"Guyana": "GUY",
	"Haiti": "HTI",
	"Honduras": "HND",
	"Hong Kong  (China)": "HKG",
	"Hungary": "HUN",
	"Iceland": "ISL",
	"India": "IND",
	"Indonesia": "IDN",
	"Iran": "IRN",
	"Iraq": "IRQ",
	"Ireland, Republic of": "IRL",
	"Isle of Man  (United Kingdom)": "IMN",
	"Israel": "ISR",
	"Italy": "ITA",
	"Jamaica": "JAM",
	"Japan": "JPN",
	"Jersey  (United Kingdom)": "JEY",
	"Jordan": "JOR",
	"Kazakhstan": "KAZ",
	"Kenya": "KEN",
	"Kiribati": "KIR",
	"Kosovo/Kosova": "KOS",
	"Kuwait": "KWT",
	"Kyrgyzstan": "KGZ",
	"Laos": "LAO",
	"Latvia": "LVA",
	"Lebanon": "LBN",
	"Lesotho": "LSO",
	"Liberia": "LBR",
	"Libya": "LBY",
	"Liechtenstein": "LIE",
	"Lithuania": "LTU",
	"Luxembourg": "LUX",
	"Macau  (China)": "MAC",
	"Macedonia (former Yugoslav Republic of)": "MKD",
	"Madagascar": "MDG",
	"Malawi": "MWI",
	"Malaysia": "MYS",
	"Maldives": "MDV",
	"Mali": "MLI",
	"Malta": "MLT",
	"Marshall Islands": "MHL",
	"Martinique  (France)": "MTQ",
	"Mauritania": "MRT",
	"Mauritius": "MUS",
	"Mayotte (France)": "MYT",
	"Mexico": "MEX",
	"Micronesia, Federated States of": "FSM",
	"Moldova (Republic of)": "MDA",
	"Monaco": "MCO",
	"Mongolia": "MNG",
	"Montenegro": "MNE",
	"Morocco": "MAR",
	"Mozambique": "MOZ",
	"Myanmar (formerly Burma)": "MMR",
	"Namibia": "NAM",
	"Nauru": "NRU",
	"Nepal": "NPL",
	"Netherlands": "NLD",
	"New Caledonia  (France)": "NCL",
	"New Zealand": "NZL",
	"Nicaragua": "NIC",
	"Niger": "NER",
	"Nigeria": "NGA",
	"Northern Mariana Islands  (USA)": "MNP",
	"Norway": "NOR",
	"Oman": "OMN",
	"Pakistan": "PAK",
	"Palau": "PLW",
	"Panama": "PAN",
	"Papua New Guinea": "PNG",
	"Paraguay": "PRY",
	"Peru": "PER",
	"Philippines": "PHL",
	"Poland": "POL",
	"Portugal": "PRT",
	"Puerto Rico  (USA)": "PRI",
	"Qatar": "QAT",
	"Republic of (South) Korea": "KOR",
	"Republic of Guinea": "GIN",
	"Reunion (France)": "REU",
	"Romania": "ROU",
	"Russian Federation": "RUS",
	"Rwanda": "RWA",
	"Samoa (formerly Western Samoa)": "WSM",
	"San Marino": "SMR",
	"Sao Tome e Principe": "STP",
	"Saudi Arabia": "SAU",
	"Senegal": "SEN",
	"Serbia": "SRB",
	"Seychelles": "SYC",
	"Sierra Leone": "SLE",
	"Singapore": "SGP",
	"Sint Maarten (Netherlands) ": "SXM",
	"Slovakia": "SVK",
	"Slovenia": "SVN",
	"Solomon Islands": "SLB",
	"Somalia": "SOM",
	"South Africa": "ZAF",
	"South Sudan": "SSD",
	"Spain": "ESP",
	"Sri Lanka": "LKA",
	"St. Kitts and Nevis": "KNA",
	"St. Lucia": "LCA",
	"St. Vincent and the Grenadines": "VCT",
	"Sudan": "SDN",
	"Suriname": "SUR",
	"Swaziland": "SWZ",
	"Sweden": "SWE",
	"Switzerland": "CHE",
	"Syria": "SYR",
	"Taiwan": "TWN",
	"Tajikistan": "TJK",
	"Tanzania": "TZA",
	"Thailand": "THA",
	"Timor-Leste (formerly East Timor)": "TLS",
	"Togo": "TGO",
	"Tonga": "TON",
	"Trinidad and Tobago": "TTO",
	"Tunisia": "TUN",
	"Turkey": "TUR",
	"Turkmenistan": "TKM",
	"Tuvalu": "TUV",
	"Uganda": "UGA",
	"Ukraine": "UKR",
	"United Arab Emirates": "ARE",
	"United Kingdom: England & Wales": "GBR",
	"United Kingdom: Northern Ireland": "GBR",
	"United Kingdom: Scotland": "GBR",
	"United States of America": "USA",
	"Uruguay": "URY",
	"Uzbekistan": "UZB",
	"Vanuatu": "VUT",
	"Venezuela": "VEN",
	"Vietnam": "VNM",
	"Virgin Islands (USA)": "VIR",
	"Virgin Islands (United Kingdom)": "VGB",
	"Yemen": "YEM",
	"Zambia": "ZMB",
	"Zimbabwe": "ZWE"
});