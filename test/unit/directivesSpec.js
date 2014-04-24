'use strict';

describe('directives', function() {
  beforeEach(module('prisonDataDirectives', 'prisonDataFilters'));

  describe('toolTipLink', function() {
  	var ele, scope;

  	beforeEach(inject(function($compile, $rootScope) {
  		scope = $rootScope;
  		ele = angular.element(
  			'<tool-tip-link comment="cmt">' +
  			'</tool-tip-link>'
  		);
  		$compile(ele)(scope);
  		scope.$apply();
  	}));

  	it('should render a nice little question mark', function() {
		expect(ele.html()).toContain('?');
  	});

  	it('should pass the comment attribute through to template\'s title attr',
  		function() {
		scope.$apply(function() {
			scope.cmt = 'what a fun directive!';
		});
		expect(ele.attr('title')).toContain('fun');
  	});

  });

 });
