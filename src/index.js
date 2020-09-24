/**
 * @fileoverview Prevent using non-exist object property
 * @author ne2030
 */
'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------
const requireIndex = require('requireindex');

// ------------------------------------------------------------------------------
// Plugin Definition
// ------------------------------------------------------------------------------

// import all rules in lib/rules
Object.defineProperty(exports, '__esModule', { value: true });
// eslint-disable-next-line no-path-concat
const rules = requireIndex(__dirname + '/rules');

module.exports.rules = rules;

export const config = {
  errors: require('../config/errors'),
};
