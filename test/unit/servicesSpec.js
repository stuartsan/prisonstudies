'use strict';

describe('services', function() {
  beforeEach(module('prisonDataServices'));

  describe('paths', function() {
  	var paths;

 	beforeEach(inject(function(_paths_){
 		paths = _paths_;
 	}));

    it('should return a reference to all paths', function() {
      expect(paths.paths.length).toBeGreaterThan(0);
    });

    it('should allow adding new paths', function() {
    	var pathCount = paths.paths.length;
    	var newPath = {path: 'awesome-path', label:'oh yeah'};
    	paths.addPath(newPath);
    	expect(paths.paths.length).toBeGreaterThan(pathCount);
    });

    it('and removing paths, why not', function() {
    	var pathCount = paths.paths.length;
    	var newPath = {path: 'awesome-path', label:'oh yeah'};
    	paths.addPath(newPath);
    	paths.removePath('awesome-path');
    	expect(paths.paths.length).toEqual(pathCount);
    });

  });
});
