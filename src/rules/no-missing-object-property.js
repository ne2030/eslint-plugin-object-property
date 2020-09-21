import { analyze } from '../../analyze';
import { flat, entries, find, identity, reject, equals, match, pluck, take, filter, sel, apply, go, map, mapC, includes, partition, ifElse, pipe, selEq, curry2, valuesL, flatL, filterL, mapL, tap, takeAll } from 'fxjs';
import resolve from 'eslint-module-utils/resolve';
import parse from 'eslint-module-utils/parse';
import fs from 'fs';
import * as TYPE from '../constant_type.js';
import path from 'path';
import { EXPORT, IMPORT } from '../constant';
import { Node } from 'acorn';

// cache
const cache = {};
const setCache = (imports, exports) => {
  cache.imports = imports;
  cache.exports = exports;
};

const traverseNode = curry2((type, fn, node) => {
  go(
    node,
    valuesL,
    flatL,
    filterL(n => n instanceof Node),
    mapL(tap(n => n.type === type ? fn(n) : null)),
    mapL(n => traverseNode(type, fn, n)),
    takeAll,
  );
});

// eslint/lib/util/glob-util has been moved to eslint/lib/util/glob-utils with version 5.3
// and has been moved to eslint/lib/cli-engine/file-enumerator in version 6
let listFilesToProcess;
try {
  const FileEnumerator = require('eslint/lib/cli-engine/file-enumerator').FileEnumerator;
  listFilesToProcess = function (src, extensions) {
    const e = new FileEnumerator({
      extensions: extensions,
    });
    return Array.from(e.iterateFiles(src), ({ filePath, ignored }) => ({
      ignored,
      filename: filePath,
    }));
  };
} catch (e1) {
  // Prevent passing invalid options (extensions array) to old versions of the function.
  // https://github.com/eslint/eslint/blob/v5.16.0/lib/util/glob-utils.js#L178-L280
  // https://github.com/eslint/eslint/blob/v5.2.0/lib/util/glob-util.js#L174-L269
  let originalListFilesToProcess;
  try {
    originalListFilesToProcess = require('eslint/lib/util/glob-utils').listFilesToProcess;
    listFilesToProcess = function (src, extensions) {
      return originalListFilesToProcess(src, {
        extensions: extensions,
      });
    };
  } catch (e2) {
    originalListFilesToProcess = require('eslint/lib/util/glob-util').listFilesToProcess;

    listFilesToProcess = function (src, extensions) {
      const patterns = src.reduce((carry, pattern) => {
        return carry.concat(extensions.map((extension) => {
          return /\*\*|\*\./.test(pattern) ? pattern : `${pattern}/**/*${extension}`;
        }));
      }, src.slice());

      return originalListFilesToProcess(patterns);
    };
  }
}

/**
 * read all files matching the patterns in src and ignoreExports
 * return all files matching src pattern, which are not matching the ignoreExports pattern
 */
const resolveFiles = (src, ignoreExports, context) => {
  const extensions = Array.from(getFileExtensions(context.settings));
  return pluck('filename', listFilesToProcess(src, extensions));
};

const getFileExtensions = (settings) => {
  // start with explicit JS-parsed extensions
  const exts = new Set(settings['import/extensions'] || ['.js']);

  // all alternate parser extensions are also valid
  if ('import/parsers' in settings) {
    for (const parser in settings['import/parsers']) {
      const parserSettings = settings['import/parsers'][parser];
      if (!Array.isArray(parserSettings)) {
        throw new TypeError('"settings" for ' + parser + ' must be an array');
      }
      parserSettings.forEach(ext => exts.add(ext));
    }
  }

  return exts;
};

/**
 * parse import declaration
 * info: source, specifiers
 */
const parseImport = (import_declaration, cur_path, context) => {
  const destFilePath = resolve.relative(import_declaration.source.value, cur_path, context.settings);

  const namespaces = go(
    import_declaration,
    sel('specifiers'),
    filter(specifier => [
      TYPE.IMPORT_NAMESPACE_SPECIFIER,
      TYPE.IMPORT_DEFAULT_SPECIFIER,
    ].includes(specifier.type)),
    map(specifier => ({
      type: specifier.type === TYPE.IMPORT_DEFAULT_SPECIFIER ? 'default' : 'namespace',
      namespace: specifier.local.name,
    })),
  );

  if (!namespaces || !namespaces.length) return;

  return new Map(Object.entries({
    form: IMPORT,
    source: destFilePath,
    namespaces,
  }));
};

// names, form, type
const parseNamedExport = (export_declaration) => {
  const parseDeclaration = (declaration) => {
    try {
      if (declaration.type === TYPE.FUNCTION_DECLARATION) return [declaration.id.name];
      return map(d => d.id.name, declaration.declarations);
    } catch (err) {
      console.log(declaration);
    }
  };

  const names = go(
    export_declaration,
    d => {
      if (d.declaration) return parseDeclaration(d.declaration);
      return map(s => s.exported.name, d.specifiers);
    },
    ns => new Set(ns),
  );

  return new Map(Object.entries({
    names,
    form: EXPORT,
  }));
};

const parseDefaultExport = (export_declaration) => {
  if (export_declaration.declaration.type !== TYPE.OBJECT_EXPRESSION) return;

  const keys = go(
    export_declaration.declaration.properties,
    reject(sel('computed')),
    pluck('key'),
    map(k =>
      equals(k.type, TYPE.LITERAL) ? k.value
        : equals(k.type, TYPE.IDENTIFIER) ? k.name : ''),
    filter(identity),
    ks => new Set(ks),
  );

  return new Map(Object.entries({
    keys,
    form: EXPORT,
  }));
};

/**
 * parse all source files and build up 2 maps containing the existing imports and exports
 */
const prepareImportsAndExports = async (srcFiles, context) => {
  await go(
    srcFiles,
    take(2),
    mapC(async (file) => {
      try {
        const content = fs.readFileSync(file);

        const ast = parse(resolve(file, context), content, context);

        const [exports, imports] = go(
          ast.body,
          map(node => {
            const cur_path = resolve(file, context);
            return match(node.type)
              .case(equals(TYPE.IMPORT_DECLARATION))(() => parseImport(node, cur_path, context))
              .case(equals(TYPE.EXPORT_NAMED_DECLARATION))(() => parseNamedExport(node))
              .case(equals(TYPE.EXPORT_DEFAULT_DECLARATION))(() => parseDefaultExport(node));
          }),
          filter(identity),
          partition(line => line.get('form') === IMPORT),
          ([_imports, _exports]) => {
            const defaultExport = find(e => e.has('keys'), _exports);
            const mergedNames = go(
              _exports,
              filter(e => e.has('names')),
              pluck('names'),
              ns => flat([ns, defaultExport ? 'default' : []]),
            );

            const __exports = new Map(entries({
              names: new Set(mergedNames),
              ...(defaultExport ? {
                default: defaultExport.get('keys'),
              } : {}),
            }));

            return [_imports, __exports];
          },
        );

        setCache(exports, imports);
        console.log('finish prepare!');
      } catch (err) {
        console.log(err);
      }
    }),
  );

  //     const currentExports = Exports.get(file, context);
  //     if (currentExports) {
  //       const { dependencies, reexports, imports: localImportList, namespace } = currentExports;
  //
  //       // dependencies === export * from
  //       const currentExportAll = new Set();
  //       dependencies.forEach(getDependency => {
  //         const dependency = getDependency();
  //         if (dependency === null) {
  //           return;
  //         }
  //
  //         currentExportAll.add(dependency.path);
  //       });
  //       exportAll.set(file, currentExportAll);
  //
  //       reexports.forEach((value, key) => {
  //         if (key === DEFAULT) {
  //           exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
  //         } else {
  //           exports.set(key, { whereUsed: new Set() });
  //         }
  //         const reexport = value.getImport();
  //         if (!reexport) {
  //           return;
  //         }
  //         let localImport = imports.get(reexport.path);
  //         let currentValue;
  //         if (value.local === DEFAULT) {
  //           currentValue = IMPORT_DEFAULT_SPECIFIER;
  //         } else {
  //           currentValue = value.local;
  //         }
  //         if (typeof localImport !== 'undefined') {
  //           localImport = new Set([...localImport, currentValue]);
  //         } else {
  //           localImport = new Set([currentValue]);
  //         }
  //         imports.set(reexport.path, localImport);
  //       });
  //
  //       localImportList.forEach((value, key) => {
  //         if (isNodeModule(key)) {
  //           return;
  //         }
  //         let localImport = imports.get(key);
  //         if (typeof localImport !== 'undefined') {
  //           localImport = new Set([...localImport, ...value.importedSpecifiers]);
  //         } else {
  //           localImport = value.importedSpecifiers;
  //         }
  //         imports.set(key, localImport);
  //       });
  //       importList.set(file, imports);
  //
  //       namespace.forEach((value, key) => {
  //         if (key === DEFAULT) {
  //           exports.set(IMPORT_DEFAULT_SPECIFIER, { whereUsed: new Set() });
  //         } else {
  //           exports.set(key, { whereUsed: new Set() });
  //         }
  //       });
  //     }
  //     exports.set(EXPORT_ALL_DECLARATION, { whereUsed: new Set() });
  //     exports.set(IMPORT_NAMESPACE_SPECIFIER, { whereUsed: new Set() });
  //     exportList.set(file, exports);
  //   } catch (err) {
  //
  //   }
  // }, srcFiles);
  // exportAll.forEach((value, key) => {
  //   value.forEach(val => {
  //     const currentExports = exportList.get(val);
  //     const currentExport = currentExports.get(EXPORT_ALL_DECLARATION);
  //     currentExport.whereUsed.add(key);
  //   });
  // });
};

let srcFiles;
let lastPrepareKey;

const doPreparation = async (src, ignoreExports, context) => {
  console.log('do prepare!');
  const prepareKey = JSON.stringify({
    src: (src || []).sort(),
    ignoreExports: (ignoreExports || []).sort(),
    extensions: Array.from(getFileExtensions(context.settings)).sort(),
  });

  if (prepareKey === lastPrepareKey) {
    return;
  }

  console.log('prepare im , ex');

  srcFiles = resolveFiles(src || [process.cwd()], ignoreExports, context);
  await prepareImportsAndExports(srcFiles, context);
  lastPrepareKey = prepareKey;
};

module.exports = {
  meta: {
    type: 'problem',
    schema: [],
  },
  create: async context => {
    const {
      ignoreExports = [],
    } = context.options[0] || {};

    const src = [path.resolve(process.cwd(), './target.js')];

    await doPreparation(src, ignoreExports, context);
    // export, import 저장하기
    analyze(context);

    const file = context.getFilename();
    console.log(file);

    return {
      'Program:exit': node => {
        console.log('exit!');
      },
      [TYPE.MEMBER_EXPRESSION]: node => {
        console.log(TYPE.MEMBER_EXPRESSION, node);
      },
      [TYPE.EXPORT_NAMED_DECLARATION]: node => {
        console.log(TYPE.EXPORT_NAMED_DECLARATION, node);
      },
      [TYPE.EXPORT_DEFAULT_DECLARATION]: node => {
        console.log(TYPE.EXPORT_DEFAULT_DECLARATION, node);
      },
      [TYPE.IMPORT_DECLARATION]: node => {
        console.log(TYPE.IMPORT_DECLARATION, node);
      },
    };
  }
  //   'Program:exit': node => {
  //     updateExportUsage(node);
  //     updateImportUsage(node);
  //     checkExportPresence(node);
  //   },
  //   ExportDefaultDeclaration: node => {
  //     checkUsage(node IMPORT_DEFAULT,_SPECIFIER);
  //   },
  //   ExportNamedDeclaration: node => {
  //     node.specifiers.forEach(specifier => {
  //       checkUsage(node, specifier.exported.name);
  //     });
  //     forEachDeclarationIdentifier(node.declaration, (name) => {
  //       checkUsage(node, name);
  //     });
  //   },
  // };
  ,
};
