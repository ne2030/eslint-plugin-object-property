/**
 * unopinionated config. just the things that are necessarily runtime errors
 * waiting to happen.
 * @type {Object}
 */
module.exports = {
  plugins: ['object-property'],
  rules: {
    'object-property/no-missing-object-property': 2,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
};
