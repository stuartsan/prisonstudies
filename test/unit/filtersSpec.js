'use strict';

describe('filters', function() {

	var $filter;

	beforeEach(module('prisonDataFilters'));

	beforeEach(inject(function (_$filter_) {
		$filter = _$filter_;
	}));

	describe('fmtPercent', function() {
		var fmtPercent;

		beforeEach(function() {
			fmtPercent = $filter('fmtPercent');
		});

		it('should append a percentage sign to a num str', function() {
			expect(fmtPercent('25')).toEqual('25%');
		});

		it('should append a percentage sign to a num', function() {
			expect(fmtPercent(25)).toEqual('25%');
		});

	});

	describe('fmtInt', function() {
		var fmtInt;

		beforeEach(function() {
			fmtInt = $filter('fmtInt');
		});

		it('should convert num to str', function() {
			expect(fmtInt(25)).toEqual('25');
		});

		it('should add commas as convention dictates', function() {
			expect(fmtInt(1234)).toEqual('1,234');
		});
	});

	describe('fmtPer100k', function() {
		var fmtPer100k;

		beforeEach(function() {
			fmtPer100k = $filter('fmtPer100k');
		});

		it('should append a bit of text', function() {
			expect(fmtPer100k('25')).toEqual('25 per 100k');
		});

		it('should work with numbers', function() {
			expect(fmtPer100k(1234)).toEqual('1234 per 100k');
		});

	});

	describe('naify', function() {
		var naify;

		beforeEach(function() {
			naify = $filter('naify');
		});

		it('should return N/A if value is null', function() {
			expect(naify(null)).toEqual('N/A');
		});

		it('should return N/A if value is undefined', function() {
			expect(naify(undefined)).toEqual('N/A');
		});

		it('should return 0 if value is 0', function() {
			expect(naify(0)).toEqual(0);
		});

	});

	describe('stripParens', function() {
		var stripParens;

		beforeEach(function() {
			stripParens = $filter('stripParens');
		});

		it('should strip parens on edges', function() {
		  expect(stripParens('(some text)')).toEqual('some text');
		});

		it('shouldn\'t strip parens if not outer edges', function() {
			expect(stripParens('oh (ya) ok')).toEqual('oh (ya) ok');
		});

		it('shouldn\'t strip parens if just one on outer edge', function() {
			expect(stripParens('(oh ya) ok')).toEqual('(oh ya) ok');
		});
	});

});
