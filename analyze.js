import resolve from 'eslint-module-utils/resolve';
import parse from 'eslint-module-utils/parse';
import isIgnored, { hasValidExtension } from 'eslint-module-utils/ignore';
import { hashObject } from 'eslint-module-utils/hash';
import * as unambiguous from 'eslint-module-utils/unambiguous';
import path from 'path';
import fs from 'fs';
import { rejectL, valuesL, curry2, map, head, hi, sel, take, go, reverse } from 'fxjs';
const babelParser = require('@babel/parser');

let NODE;

const traverseNode = curry2((type, fn, node) => {
  go(
    node,
    valuesL,
    rejectL(n => n instanceof NODE),
    map
  );
});

export const analyze = (context) => {
  try {
    console.log('analyze start!!');

    const src_path = path.resolve(process.cwd(), './target.js');
    const content = fs.readFileSync(src_path, { encoding: 'utf8' });

    const is_lint = true;

    const ast1 = parse(src_path, content, context);
    const ast2 = babelParser.parse(content, {
      sourceType: 'module',
      ecmaVersion: 9,
    });

    NODE = Object.getPrototypeOf(ast1);

    // go(
    //   is_lint ? ast1.body : ast2.program.body,
    //   reverse,
    //   head,
    //   // sel('declaration.declarations.0.init'),
    //   // sel('properties'),
    //   // id => recursivePatternCapture(id, () => {}),
    //   // map(hi),
    //   // // xs => xs.slice(10, 14),
    //   x => JSON.stringify(x),
    //   hi,
    // );
  } catch (err) {
    console.log(err);
  }
};
