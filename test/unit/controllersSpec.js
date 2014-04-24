'use strict';

describe('controllers', function(){

  beforeEach(module('prisonDataControllers', 'prisonDataServices'));

  describe('MainCtrl', function() {
    var scope, ctrl, $httpBackend;

    beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('app/data.json').
          respond(
            JSON.stringify([
              {country_code: 'TACOS', country_quality: 'spicy'}, 
              {country_code: 'CHIPS', country_quality: 'salty'}
            ]));

      scope = $rootScope.$new();
      ctrl = $controller('MainCtrl', {$scope:scope});
    }));

     afterEach(function() {
         $httpBackend.verifyNoOutstandingExpectation();
         $httpBackend.verifyNoOutstandingRequest();
       });

    it('should be defined', function() {
      expect(ctrl).toBeDefined();
      $httpBackend.flush();
    });

    it('should have access to promises representing countries array and map', function() {
      expect(scope.hash).toBeDefined();
      expect(scope.countries).toBeDefined();
      $httpBackend.flush();
    });

    it('should load up countries', function() {
      expect(scope.countries.length).toEqual(0);
      $httpBackend.flush();
      expect(scope.countries.length).toEqual(2);
    });

    it('should load up hash', function() {
      expect(scope.hash.TACOS).toBeUndefined();
      $httpBackend.flush();
      expect(scope.hash.TACOS).toBeDefined();
    });

  });

});
