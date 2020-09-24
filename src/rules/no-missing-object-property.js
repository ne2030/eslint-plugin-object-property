import { extend, reduce, flat, entries, find, identity, reject, equals, match, pluck, filter, sel, go, map, partition, curry2, valuesL, flatL, filterL, mapL, tap, takeAll } from 'fxjs';
import resolve from 'eslint-module-utils/resolve';
import fs from 'fs';
import * as TYPE from '../constant_type.js';
import { EXPORT, IMPORT } from '../constant';
import { Node } from 'acorn';
require('@babel/polyfill');

const babelParser = require('@babel/parser');

const log = str => {
  if (str instanceof Error) {
    str = JSON.stringify({
      stack: str.stack,
      message: str.message,
    });
  }
  fs.appendFileSync('./debug-log.txt', str + '\n');
};

// cache
const cache = {};
const setCache = ({ imports, exports }) => {
  cache.imports = imports;
  cache.exports = exports;
};
const updateCache = (path, imports, exports) => {
  cache.imports.set(path, imports);
  cache.exports.set(path, exports);
};

const removePrevCache = path => {
  cache.imports.delete(path);
  cache.exports.delete(path);
};

const getPathImportNamespace = (namespace, filePath) => sel(namespace, cache.imports.get(filePath));

const mergeExport = (_exports) => {
  const defaultExport = find(e => e.has('keys'), _exports);
  const mergedNames = go(
    _exports,
    filter(e => e.has('names')),
    map(e => e.get('names')),
    ns => flat([ns, defaultExport ? 'default' : []], 2),
  );

  return new Map(entries({
    names: new Set(mergedNames),
    default: defaultExport ? defaultExport.get('keys') : new Set(),
  }));
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

const isNodeModule = path => !/^\.|(\.\.\/)|(\/)/.test(path);

/**
 * parse import declaration
 * info: source, specifiers
 */
const parseImport = (import_declaration, cur_path, context) => {
  if (isNodeModule(import_declaration.source.value)) return;
  const destFilePath = resolve.relative(import_declaration.source.value, cur_path, context.settings);

  const namespace_indexed_import = go(
    import_declaration,
    sel('specifiers'),
    filter(specifier => [
      TYPE.IMPORT_NAMESPACE_SPECIFIER,
      TYPE.IMPORT_DEFAULT_SPECIFIER,
    ].includes(specifier.type)),
    map(specifier => {
      const type = specifier.type === TYPE.IMPORT_DEFAULT_SPECIFIER ? 'default' : 'namespace';
      return {
        [specifier.local.name]: { type, source: destFilePath },
      };
    }),
    xs => extend({}, ...xs),
  );

  return new Map(entries({
    form: IMPORT,
    namespace_indexed_import,
  }));
};

// names, form, type
const parseNamedExport = (export_declaration) => {
  const parseDeclaration = (declaration) => {
    if (declaration.type === TYPE.FUNCTION_DECLARATION) return [declaration.id.name];
    return map(d => d.id.name, declaration.declarations);
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

// export declaration -> exportsMap
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
const prepareImportsAndExports = (file, context) => {
  const content = fs.readFileSync(file).toString();

  // const ast = parse(resolve(file, context), content, context);
  const ast = babelParser.parse(content, {
    sourceType: 'unambiguous',
  }).program;

  return go(
    ast.body,
    map(node => {
      const cur_path = resolve(file, context);
      return match(node.type)
        .case(equals(TYPE.IMPORT_DECLARATION))(() => parseImport(node, cur_path, context))
        .case(equals(TYPE.EXPORT_NAMED_DECLARATION))(() => parseNamedExport(node))
        .case(equals(TYPE.EXPORT_DEFAULT_DECLARATION))(() => parseDefaultExport(node))
        .else(() => null);
    }),
    filter(identity),
    partition(line => line.get('form') === EXPORT),
    ([_exports, _imports]) => {
      const __imports = go(
        _imports,
        map(i => i.get('namespace_indexed_import')),
        (objs) => extend({}, ...objs),
      );

      return [__imports, mergeExport(_exports)];
    },
  );
};

let srcFiles;
let lastPrepareKey;

const parseAll = (ignoreExports, context) => {
  log('prepare start!');
  const prepareKey = JSON.stringify({
    ignoreExports: (ignoreExports || []).sort(),
    extensions: Array.from(getFileExtensions(context.settings)).sort(),
  });

  if (prepareKey === lastPrepareKey) {
    return;
  }
  log('process cwd', process.cwd());

  srcFiles = resolveFiles([process.cwd()], ignoreExports, context);
  // srcFiles = resolveFiles([path.join(process.cwd(), './tests')], ignoreExports, context);

  go(
    srcFiles,
    map(file => [file, ...prepareImportsAndExports(file, context)]),
    parse_results => reduce((acc, [file, _imports, _exports]) => {
      acc.imports.set(file, _imports);
      acc.exports.set(file, _exports);
      return acc;
    }, { imports: new Map(), exports: new Map() }, parse_results),
    setCache,
  );

  lastPrepareKey = prepareKey;
};

const parseFile = (path, context) =>
  go(
    removePrevCache(path),
    () => prepareImportsAndExports(path, context),
    updateCache,
  );

module.exports = {
  meta: {
    type: 'problem',
    schema: [],
  },
  create: context => {
    const {
      ignoreExports = [],
    } = context.options[0] || {};

    const file = context.getFilename();

    log('file :' + file);

    parseAll(ignoreExports, context);
    parseFile(file);

    log('------------parse finish \n\n');

    return {
      MemberExpression: node => {
        log(`\n\n<-----${TYPE.MEMBER_EXPRESSION}---->\n\n`);
        const namespace = node.object.name;
        const property = node.property.name;

        if (node.object.type !== TYPE.IDENTIFIER) return;
        if (node.property.type !== TYPE.IDENTIFIER) return;

        const namespaceInfo = getPathImportNamespace(namespace, file);

        if (!namespaceInfo) return;

        const exportInfo = cache.exports.get(namespaceInfo.source);

        if (namespaceInfo.type === 'default' && !exportInfo.get('default').has(property)) {
          return context.report(
            node,
            `imported default namespace '${namespace}' does not have object property '${property}'`,
          );
        }

        if (
          namespaceInfo.type === 'namespace' &&
          !exportInfo.get('names').has(property) &&
          !exportInfo.get('names').length // default 가 없는 경우
        ) {
          return context.report(
            node,
            `imported '* as' namespace '${namespace}' does not have named export '${property}'`,
          );
        }
      },
    };
  },
};
