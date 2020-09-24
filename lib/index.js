/**
 * @fileoverview Prevent using non-exist object property
 * @author ne2030
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });exports.config = void 0;var requireIndex = require('requireindex');

// ------------------------------------------------------------------------------
// Plugin Definition
// ------------------------------------------------------------------------------

// import all rules in lib/rules
Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-path-concat
var rules = requireIndex(__dirname + '/rules');

module.exports.rules = rules;

var config = {
  errors: require('../config/errors') };exports.config = config;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlSW5kZXgiLCJyZXF1aXJlIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJleHBvcnRzIiwidmFsdWUiLCJydWxlcyIsIl9fZGlybmFtZSIsIm1vZHVsZSIsImNvbmZpZyIsImVycm9ycyJdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7QUFJQTs7QUFFQTtBQUNBO0FBQ0E7c0ZBQ0EsSUFBTUEsWUFBWSxHQUFHQyxPQUFPLENBQUMsY0FBRCxDQUE1Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQUMsTUFBTSxDQUFDQyxjQUFQLENBQXNCQyxPQUF0QixFQUErQixZQUEvQixFQUE2QyxFQUFFQyxLQUFLLEVBQUUsSUFBVCxFQUE3QztBQUNBO0FBQ0EsSUFBTUMsS0FBSyxHQUFHTixZQUFZLENBQUNPLFNBQVMsR0FBRyxRQUFiLENBQTFCOztBQUVBQyxNQUFNLENBQUNKLE9BQVAsQ0FBZUUsS0FBZixHQUF1QkEsS0FBdkI7O0FBRU8sSUFBTUcsTUFBTSxHQUFHO0FBQ3BCQyxFQUFBQSxNQUFNLEVBQUVULE9BQU8sQ0FBQyxrQkFBRCxDQURLLEVBQWYsQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZpbGVvdmVydmlldyBQcmV2ZW50IHVzaW5nIG5vbi1leGlzdCBvYmplY3QgcHJvcGVydHlcbiAqIEBhdXRob3IgbmUyMDMwXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBSZXF1aXJlbWVudHNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuY29uc3QgcmVxdWlyZUluZGV4ID0gcmVxdWlyZSgncmVxdWlyZWluZGV4Jyk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUGx1Z2luIERlZmluaXRpb25cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vLyBpbXBvcnQgYWxsIHJ1bGVzIGluIGxpYi9ydWxlc1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wYXRoLWNvbmNhdFxuY29uc3QgcnVsZXMgPSByZXF1aXJlSW5kZXgoX19kaXJuYW1lICsgJy9ydWxlcycpO1xuXG5tb2R1bGUuZXhwb3J0cy5ydWxlcyA9IHJ1bGVzO1xuXG5leHBvcnQgY29uc3QgY29uZmlnID0ge1xuICBlcnJvcnM6IHJlcXVpcmUoJy4uL2NvbmZpZy9lcnJvcnMnKSxcbn07XG4iXX0=