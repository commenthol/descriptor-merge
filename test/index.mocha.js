/**
 * mocha test describe for util/extend.js
 *
 * @copyright 2015 Commenthol
 * @license MIT
 */

/* globals describe,test */

"use strict";

var assert = require('assert'),
	extend = require('../index').extend,
	merge  = require('../index').merge;

function circularStringify(obj) {
	var cache = [];
	var out = JSON.stringify(obj, function(key, value) {
		if (typeof value === 'object' && value !== null) {
			if (cache.indexOf(value) !== -1) {
				return '[Circular]';
			}
			cache.push(value);
		}
		return value;
	});
	cache = null; // Enable garbage collection
	return out;
}


describe('extend tests', function() {

	describe('- extending values',function(){

		var source1 = { a:1, b:1 };
		var source2 = { b:2, c:2 };
		var source3 = { b:3, d:3 };
		var result = extend (source1, source2, source3);

		it('extended result', function(){
			assert.deepEqual(result, { a: 1, b: 3, c: 2, d: 3 });
		});
	});

	describe('- extending objects',function(){

		var source1 = { a: { a:1, b:1 } };
		var source2 = { b: { b:2, c:2 } };
		var source3 = { a: { b:3, d:null } };
		var result = extend (source1, source2, source3);

		it('extended result', function(){
			assert.deepEqual(result, {
				a: { d: null, b: 3 },
				b: { c: 2, b: 2 }
			});
		});
	});

	describe('- extending objects of objects',function(){

		var source1 = { a: { a:1, b: { c: 2 } } };
		var source2 = { b: { b:2, c:2 } };
		var source3 = { a: { b: { d: 4 }, d:null } };
		var result = extend (source1, source2, source3);

		it('extended result', function(){
			assert.deepEqual(result, {
				a: { d: null, b: { d: 4 } },
				b: { c: 2, b: 2 }
			});
		});
	});

	describe('- extending arrays',function(){

		var source1 = { a: [ 1, 2, 3 ] };
		var source2 = { b: [ 4, 5 ] };
		var source3 = { b: [ 6 ] };
		var result = extend (source1, source2, source3);

		it('extended result', function(){
			assert.deepEqual(result, {
				a: [ 1, 2, 3 ],
				b: [ 6 ]
			});
		});
	});

	describe('- extending arrays of objects',function(){

		var source1 = { a: [ {a: 1} , {b: 2}, 3 ] };
		var source2 = { b: [ 3, {e: 4}, {f: 5} ] };
		var source3 = { b: [ {g: 6} ] };
		var result = extend (source1, source2, source3);

		it('extended result', function(){
			assert.deepEqual(result, {
				a: [ {a: 1} , {b: 2}, 3 ],
				b: [ {g: 6} ]
			});
		});
	});

	describe('- manipulation after extending values',function(){

		var source1 = { a:1, b:1};
		var source2 = { b:2, c:2};
		var source3 = { b:3, d:3};
		var result = extend (source1, source2, source3);
		source3.b = { a: "a" };

		it('extended result', function(){
			assert.deepEqual(result, { a: 1, b: 3, c: 2, d: 3 });
		});
	});

	describe('- manipulation after extending objects',function(){

		var source1 = { a: { a:1, b:1 } };
		var source2 = { b: { b:2, c:2 } };
		var source3 = { a: { b:3, d:3 } };
		var result = extend (source1, source2, source3);
		source2.b.b = { b: "a" };

		it('extended result', function(){
			assert.deepEqual(result, {
				a: { d: 3, b: 3 },
				b: { c: 2, b: 2 }
			});
		});
	});
});

describe('merge tests', function() {

	describe('- merging values',function(){

		var source1 = { a:1, b:1};
		var source2 = { b:2, c:2};
		var source3 = { b:3, d:3};
		var result = merge (source1, source2, source3);

		it('merged result', function(){
			assert.deepEqual(result, { a: 1, b: 3, c: 2, d: 3 });
		});
	});

	describe('- merging objects',function(){

		var source1 = { a: { a:1, b:1 } };
		var source2 = { a: { c: { a: null } }, b: { b:2, c:2 } };
		var source3 = { a: { b:3, d:3 } };
		var result = merge (source1, source2, source3);

		it('merged result', function(){
			assert.deepEqual(result, {
				a: { a: 1, c: { a: null }, b: 3, d: 3 },
				b: { b: 2, c: 2 }
			});
		});
	});

	describe('- merging arrays',function(){

		var source1 = { a: [ 1, 2, 3 ] };
		var source2 = { b: [ 4, 5 ] };
		var source3 = { b: [ 6 ] };
		var result = merge (source1, source2, source3);

		it('merged result', function(){
			assert.deepEqual(result, {
				a: [ 1, 2, 3 ],
				b: [ 4, 5, 6 ]
			});
		});
	});

	describe('- merging arrays of objects',function(){

		var source1 = { a: [ {a: 1} , {b: 2}, 3 ] };
		var source2 = { b: [ 3, {e: 4}, {f: 5} ] };
		var source3 = { a: [ 4, {g: 5}, 6 ], b: [ {g: 6} ] };
		var result = merge (source1, source2, source3);

		it('merged result', function(){
			assert.deepEqual(result, {
				a: [ {a: 1} , {b: 2}, 3, 4, {g: 5}, 6 ],
				b: [ 3, {e: 4}, {f: 5}, {g: 6}]
			});
		});
	});

	describe('- merging arrays of objects of objects',function(){

		var source1 = { a: [ { aa: { ab: {ac: 1} } }, { ba: {bb: 2} }, 3 ] };
		var source2 = { a: [ { aa: { ab: {ac: 2} } }, { ba: {bb: 3} }, 4 ] };
		var source3 = { a: [ 4, {g: 5}, 6 ], b: [ {g: 6} ] };
		var result = merge (source1, source2, source3);

		it('merged result', function(){
			assert.deepEqual(result, {
				a: [
					{ aa: { ab: {ac: 1} } }, { ba: {bb: 2} }, 3,
					{ aa: { ab: {ac: 2} } }, { ba: {bb: 3} }, 4,
					4, {g: 5}, 6
				],
				b: [ {g: 6} ]
			});
		});
	});

	describe('- merging objects of objects',function(){

		var source1 = { a: { a:1, b:1 } };
		var source2 = { b: { b:2, c:2 } };
		var source3 = { a: { b: { e:3, f:4 }, d:3 } };
		var result = merge (source1, source2, source3);

		it('merged result', function(){
			assert.deepEqual(result, {
				a: { a: 1, b: { e:3, f:4 }, d: 3 },
				b: { b: 2, c: 2 }
			});
		});
	});

	describe('- merge cyclic objects',function(){

		var source1 = { a: { a:1, b:1 } };
		var source2 = { b: 2 };
		var source3 = { c: 3 };

		source2.c = source3;
		source3.b = source2;

		var result = merge (source1, source2, source3);
		var exp = '{"a":{"a":1,"b":1},"b":{"b":2,"c":{"c":3,"b":"[Circular]"}},"c":3}';

		it('merged result', function(){
			assert.equal(circularStringify(result), exp);
		});
	});

	describe('- merging objects with null objects',function(){

		var source1 = { a: { a:1, b:1 } };
		var source2 = { b: { b:2, c:2 } };
		var source3 = { a: null };
		var result = merge (source1, source2, source3);

		it('merged result', function(){
			assert.deepEqual(result, {
				a: null,
				b: { b:2, c:2 }
			});
		});
	});

	describe('- merging objects with descriptors',function(){

		var source1 = { a: { a:1, b:1 } };
		var source2 = { b: { b:2, c:2 } };
		var source3 = {
			a: {
				get c() {
					return this.__c;
				},
				set c(val) {
					this.__c = val;
				},
			}
		};
		var result = merge (source1, source2, source3);

		it('merged result', function(){
			assert.deepEqual(result, {
				a: { a:1, b:1 },
				b: { b:2, c:2 }
			});
		});
	});
});
