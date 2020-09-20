import other1, { o1, o2 as oo2 } from './other1';
import * as all from './other1';
import { other2 } from './other2.mjs';
import { other3 } from './other3.cjs';

export const g = 2;
const a = 1;
export function fn () {

}
//
// export default {
//   oo1, oo2,
// };

const v = 1;
export const vv = v;

function add (a, b, c) {
  const all_c = all.c;
}

export let v1;
const v2 = 1;
export { v2 };
export { v2 as v3 };

export { default as abc } from './other1';
export * from './other1';
export { o2 } from './other1.js';
export { o1 as o3, o2 as o4 } from './other1.js';
// export { default } from './other1';
// export { default } from './other2';

export const efaef = {
  a: 1,
  b: 2,
  c: {
    d: 13,
  },
};

// const path = './other2.js';
// const aefef = import('./other1.js');
// const vcvc = import(path);
// const Util = import('./' + 'other1.js');
// let ddd;
// const aewfaw = import(ddd = 1);

export const eddd = 1; const b = 2;

// Default Exports

/*
 * -- function
 */

// export default function (a, b) {
//   return a + b;
// }

/*
 * -- default as named
 */
// export { efaef as default };

/*
 * -- object expression
 */

const str = 'stringa';

export default {
  ['abcde']: 123,
  [str]: 234,
  normal: 324,
};

// export default [1, 2, 3, 4, 5];
