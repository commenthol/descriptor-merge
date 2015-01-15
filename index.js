/**
 * @copyright 2015 Commenthol
 * @license MIT
 */

"use strict";

/**
 * Extends multiple objects from 1..n object sources.
 * The resulting object is a deep clone of all objects provided.
 *
 * e.g.
 * var source1 = { a:1, b:1};
 * var source2 = { b:2, c:2};
 * var source3 = { b:3, d:3};
 * var result = extend (source1, source2, source3);
 * result = {a:1, b:3, c:2, d:3};
 *
 * @param  {Object} source1..sourceN
 * @return {Object}
 */
function extend() {
	var
		i,
		src,
		dest = {};

	for (i in arguments) {
		src = arguments[i];
		if (src && typeof src === 'object') {
			(Object.getOwnPropertyNames(src)).forEach(function(key){
				if (src[key] !== null && typeof(src[key]) === 'object' && !(src[key] instanceof Array)) {
					dest[key] = extend({}, src[key]);
				}
				else {
					var descriptor = Object.getOwnPropertyDescriptor(src, key);
					Object.defineProperty(dest, key, descriptor);
				}
			}); // jshint ignore:line
		}
	}
	return dest;
};

/**
 * Merges multiple objects from 1..n object sources.
 * The resulting object is a deep clone of all objects provided.
 * null objects do not merged into an already existing object.
 *
 * e.g.
 * var source1 = { a: { a:1, b:1 } } ;
 * var source2 = { a: { c: { a: true } }, b: { b:2, c:2 } };
 * var source3 = { a: { b:3, d:3 } };
 * var result = merge (source1, source2, source3);
 * result = { a: { a: 1, c: { a: true }, b: 3, d: 3 }, b: { b: 2, c: 2 } };
 *
 * @param  {Object} source1 .. sourceN
 * @return {Object}
 */
function merge() {
	var i;
	var src;
	var dest = {};

	for (i in arguments) {
		src = arguments[i];
		if (src && typeof src === 'object') {
			(Object.getOwnPropertyNames(src)).forEach(function(key){
				var descriptor;

				if (src[key] !== null && typeof(src[key]) === 'object') {
					if (Array.isArray(src[key])) {
						if (! dest[key]) {
							dest[key] = [];
						}
						for (var k = 0; k < src[key].length; k += 1) {
							dest[key].push(src[key][k]);
						}
					}
					else {
						if (isCircular(src[key])) {
							dest[key] = src[key]; // assign circularity
						}
						else {
							dest[key] = merge(dest[key], src[key]);
						}
					}
				}
				else if (src[key] === null && dest[key]) {
					dest[key] = null;
				}
				else {
					descriptor = Object.getOwnPropertyDescriptor(src, key);
					Object.defineProperty(dest, key, descriptor);
				}
			}); // jshint ignore:line
		}
	}
	return dest;
};

/**
 * Pulled from http://blog.vjeux.com/2011/javascript/cyclic-object-detection.html.
 * One line added to detect where the cycle is.
 */
function isCircular (obj) {
	var seenObjects = [];

	function detect (obj) {
		if (obj && typeof obj === 'object') {
			if (seenObjects.indexOf(obj) !== -1) {
				return true;
			}
			seenObjects.push(obj);
			for (var key in obj) {
				if (obj.hasOwnProperty(key) && detect(obj[key])) {
					//~ console.log(obj, 'cycle at ' + key);
					return true;
				}
			}
		}
		return false;
	}

	return detect(obj);
};

module.exports = {
	extend: extend,
	merge: merge,
	isCircular: isCircular
};

