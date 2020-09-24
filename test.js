import { SourceCode, RuleTester } from 'eslint';
import path from 'path';

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 9, sourceType: 'module' } });

const rule = require('./src/rules/no-missing-object-property');
ruleTester.run('no-missing-object-property', rule, {
  valid: [{
    code: `
      export const g = 2;
      const a = 1;
      export default a;
      export function fn () {
      
      }
      
      const v = 1;
      export const vv = v;
      
      export let v1 = 2;
      v1 = v1 + 2;
    `,
    filename: path.resolve(process.cwd(), './target.js'),
  }],
  invalid: [],
});
