'use strict';

/* Services */

var prisonDataServices = angular.module('prisonDataServices', ['ngResource']);


// Returns function with a query method that returns all country data
prisonDataServices.factory('Country', ['$resource',
  function($resource){
    return $resource('data.json', {}, {
      query: {method:'GET', isArray:true, cache:true}
    });
  }]);
