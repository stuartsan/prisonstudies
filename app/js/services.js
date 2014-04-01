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
