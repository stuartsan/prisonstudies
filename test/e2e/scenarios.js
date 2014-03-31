'use strict';

/* https://github.com/angular/protractor/blob/master/docs/getting-started.md 
 * also lots of good examples: 
 * https://github.com/angular/protractor/blob/master/spec/basic/findelements_spec.js  
 * and jasmine docs: http://jasmine.github.io/1.3/introduction.html
 */

describe('my app', function() {

  browser.get('index.html');

  it('should redirect to /countries when location url fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/countries");
  });

  it('should switch to the map tab upon click', function() {
    expect($('#map').isPresent()).toBe(false);
    $('#nav li:nth-child(2) a').click();
    expect($('#map').isPresent()).toBe(true);
  });

});