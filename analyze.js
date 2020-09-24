import parse from 'eslint-module-utils/parse';
import path from 'path';
import fs from 'fs';
import { flatL, tap, mapL, hi, takeAll, filterL, valuesL, curry2, go } from 'fxjs';
import * as TYPE from './lib/constant_type';
import { Node } from 'acorn';

const babelParser = require('@babel/parser');

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

    // NODE = Object.getPrototypeOf(ast1).constructor;

    // traverseNode(TYPE.MEMBER_EXPRESSION, n => {
    //   console.log('member!', n);
    // }, ast1);

    go(
      is_lint ? ast1.body : ast2.program.body,
      // reverse,
      // head,
      // sel('declaration.declarations.0.init'),
      // sel('properties'),
      // id => recursivePatternCapture(id, () => {}),
      // map(hi),
      // // xs => xs.slice(10, 14),
      // x => JSON.stringify(x),
      hi,
    );
  } catch (err) {
    console.log(err);
  }
};
