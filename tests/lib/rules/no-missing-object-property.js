import { RuleTester } from 'eslint';
import path from 'path';

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 9, sourceType: 'module' } });

const rule = require('../../../src/rules/no-missing-object-property');
ruleTester.run('no-missing-object-property', rule, {
  valid: [{
    code: `
    import A from './pathA/file-a.js';
import * as B from './file-b.js';

const a1 = A.a1;
const b1 = B.b1;
const error = B.bcd;
    `,
    filename: path.resolve(process.cwd(), './tests/files/index.js'),
  }],
  invalid: [],
});
