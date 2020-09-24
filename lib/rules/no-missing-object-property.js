"use strict";var _fxjs = require("fxjs");
var _resolve = _interopRequireDefault(require("eslint-module-utils/resolve"));
var _fs = _interopRequireDefault(require("fs"));
var TYPE = _interopRequireWildcard(require("../constant_type.js"));
var _constant = require("../constant");
var _acorn = require("acorn");function _getRequireWildcardCache() {if (typeof WeakMap !== "function") return null;var cache = new WeakMap();_getRequireWildcardCache = function _getRequireWildcardCache() {return cache;};return cache;}function _interopRequireWildcard(obj) {if (obj && obj.__esModule) {return obj;}if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") {return { "default": obj };}var cache = _getRequireWildcardCache();if (cache && cache.has(obj)) {return cache.get(obj);}var newObj = {};var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;for (var key in obj) {if (Object.prototype.hasOwnProperty.call(obj, key)) {var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;if (desc && (desc.get || desc.set)) {Object.defineProperty(newObj, key, desc);} else {newObj[key] = obj[key];}}}newObj["default"] = obj;if (cache) {cache.set(obj, newObj);}return newObj;}function _interopRequireDefault(obj) {return obj && obj.__esModule ? obj : { "default": obj };}function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}function _toConsumableArray(arr) {return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();}function _nonIterableSpread() {throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _iterableToArray(iter) {if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);}function _arrayWithoutHoles(arr) {if (Array.isArray(arr)) return _arrayLikeToArray(arr);}function _typeof(obj) {"@babel/helpers - typeof";if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {_typeof = function _typeof(obj) {return typeof obj;};} else {_typeof = function _typeof(obj) {return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;};}return _typeof(obj);}function _slicedToArray(arr, i) {return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();}function _nonIterableRest() {throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");}function _unsupportedIterableToArray(o, minLen) {if (!o) return;if (typeof o === "string") return _arrayLikeToArray(o, minLen);var n = Object.prototype.toString.call(o).slice(8, -1);if (n === "Object" && o.constructor) n = o.constructor.name;if (n === "Map" || n === "Set") return Array.from(o);if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);}function _arrayLikeToArray(arr, len) {if (len == null || len > arr.length) len = arr.length;for (var i = 0, arr2 = new Array(len); i < len; i++) {arr2[i] = arr[i];}return arr2;}function _iterableToArrayLimit(arr, i) {if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;var _arr = [];var _n = true;var _d = false;var _e = undefined;try {for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {_arr.push(_s.value);if (i && _arr.length === i) break;}} catch (err) {_d = true;_e = err;} finally {try {if (!_n && _i["return"] != null) _i["return"]();} finally {if (_d) throw _e;}}return _arr;}function _arrayWithHoles(arr) {if (Array.isArray(arr)) return arr;}
require('@babel/polyfill');

var wrapArr = function wrapArr(xs) {return xs instanceof Array ? xs : [xs];};

var babelParser = require('@babel/parser');

var log = function log(str) {
  if (str instanceof Error) {
    str = JSON.stringify({
      stack: str.stack,
      message: str.message });

  }
  _fs["default"].appendFileSync('./debug-log.txt', str + '\n');
  // console.log(str);
};

// cache
var cache = {};
var setCache = function setCache(_ref) {var imports = _ref.imports,exports = _ref.exports;
  cache.imports = imports;
  cache.exports = exports;
};

var updateImportCache = function updateImportCache(imports, filePath) {
  (0, _fxjs.assign)(cache.imports.get(filePath), imports);
};

var updateDefaultExportCache = function updateDefaultExportCache(exportsMap, filePath) {
  var export_cache = cache.exports.get(filePath);
  (0, _fxjs.each)(
  function (key) {return export_cache.get('default').add(key);},
  exportsMap.get('default') // keys
  );
};

var updateNamedExportCache = function updateNamedExportCache(exportsMap, filePath) {
  var export_cache = cache.exports.get(filePath);
  (0, _fxjs.each)(
  function (name) {return export_cache.get('names').add(name);},
  exportsMap.get('names') // keys
  );
};

var logCache = function logCache() {
  log('imports');
  (0, _fxjs.map)(function (_ref2) {var _ref3 = _slicedToArray(_ref2, 2),path = _ref3[0],namespace = _ref3[1];
    log(path + ' -> \n');
    (0, _fxjs.map)(function (_ref4) {var _ref5 = _slicedToArray(_ref4, 2),k = _ref5[0],v = _ref5[1];
      log("\t".concat(k, ": ").concat(_typeof(v) === 'object' ? JSON.stringify(v) : v));
    }, (0, _fxjs.entries)(namespace));
    log('');
  }, cache.imports);

  log('\nexports');
  (0, _fxjs.map)(function (_ref6) {var _ref7 = _slicedToArray(_ref6, 2),path = _ref7[0],sources = _ref7[1];
    log(path + ' -> \n');
    (0, _fxjs.map)(function (_ref8) {var _ref9 = _slicedToArray(_ref8, 2),k = _ref9[0],v = _ref9[1];
      log("\t".concat(k, ": ").concat(_toConsumableArray(v).join(',')));
    }, sources);
    log('');
  }, cache.exports);
};

var getPathImportNamespace = function getPathImportNamespace(namespace, filePath) {return (0, _fxjs.sel)(namespace, cache.imports.get(filePath));};

var isEmptyObject = function isEmptyObject(obj) {return (0, _fxjs.keys)(obj).length;};
var updateImport = function updateImport(import_declaration, filePath, context) {
  var parsed_import = (0, _fxjs.go)(
  parseImport(import_declaration, filePath, context),
  (0, _fxjs.ifElse)(_fxjs.identity, function (i) {return i.get('.namespace_indexed_import');}, _fxjs.identity));

  var cache_import = cache.imports.get(filePath);

  if (!parsed_import) return;

  var uncached = isEmptyObject(cache_import) ? parsed_import : (0, _fxjs.go)(
  parsed_import,
  _fxjs.entriesL,
  (0, _fxjs.reject)(function (_ref10) {var _ref11 = _slicedToArray(_ref10, 2),namespace = _ref11[0],_ref11$ = _ref11[1],type = _ref11$.type,source = _ref11$.source;
    var i = cache_import[namespace] || {};
    return i.type === type && i.source === source;
  }));


  if (!uncached.length) return;

  updateImportCache(filePath, (0, _fxjs.object)(uncached));
};

var mergeExport = function mergeExport(_exports) {
  var defaultExport = (0, _fxjs.find)(function (e) {return e.has('keys');}, _exports);
  var mergedNames = (0, _fxjs.go)(
  _exports,
  (0, _fxjs.filter)(function (e) {return e.has('names');}),
  (0, _fxjs.map)(function (e) {return e.get('names');}),
  function (ns) {return (0, _fxjs.flat)([ns, defaultExport ? 'default' : []], 2);});


  return new Map((0, _fxjs.entries)({
    names: new Set(mergedNames),
    "default": defaultExport ? defaultExport.get('keys') : new Set() }));

};

var traverseNode = (0, _fxjs.curry2)(function (type, fn, node) {
  (0, _fxjs.go)(
  node,
  _fxjs.valuesL,
  _fxjs.flatL,
  (0, _fxjs.filterL)(function (n) {return n instanceof _acorn.Node;}),
  (0, _fxjs.mapL)((0, _fxjs.tap)(function (n) {return n.type === type ? fn(n) : null;})),
  (0, _fxjs.mapL)(function (n) {return traverseNode(type, fn, n);}),
  _fxjs.takeAll);

});

// eslint/lib/util/glob-util has been moved to eslint/lib/util/glob-utils with version 5.3
// and has been moved to eslint/lib/cli-engine/file-enumerator in version 6
var listFilesToProcess;
try {
  var FileEnumerator = require('eslint/lib/cli-engine/file-enumerator').FileEnumerator;
  listFilesToProcess = function listFilesToProcess(src, extensions) {
    var e = new FileEnumerator({
      extensions: extensions });

    return Array.from(e.iterateFiles(src), function (_ref12) {var filePath = _ref12.filePath,ignored = _ref12.ignored;return {
        ignored: ignored,
        filename: filePath };});

  };
} catch (e1) {
  // Prevent passing invalid options (extensions array) to old versions of the function.
  // https://github.com/eslint/eslint/blob/v5.16.0/lib/util/glob-utils.js#L178-L280
  // https://github.com/eslint/eslint/blob/v5.2.0/lib/util/glob-util.js#L174-L269
  var originalListFilesToProcess;
  try {
    originalListFilesToProcess = require('eslint/lib/util/glob-utils').listFilesToProcess;
    listFilesToProcess = function listFilesToProcess(src, extensions) {
      return originalListFilesToProcess(src, {
        extensions: extensions });

    };
  } catch (e2) {
    originalListFilesToProcess = require('eslint/lib/util/glob-util').listFilesToProcess;

    listFilesToProcess = function listFilesToProcess(src, extensions) {
      var patterns = src.reduce(function (carry, pattern) {
        return carry.concat(extensions.map(function (extension) {
          return /\*\*|\*\./.test(pattern) ? pattern : "".concat(pattern, "/**/*").concat(extension);
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
var resolveFiles = function resolveFiles(src, ignoreExports, context) {
  var extensions = Array.from(getFileExtensions(context.settings));
  return (0, _fxjs.pluck)('filename', listFilesToProcess(src, extensions));
};

var getFileExtensions = function getFileExtensions(settings) {
  // start with explicit JS-parsed extensions
  var exts = new Set(settings['import/extensions'] || ['.js']);

  // all alternate parser extensions are also valid
  if ('import/parsers' in settings) {
    for (var parser in settings['import/parsers']) {
      var parserSettings = settings['import/parsers'][parser];
      if (!Array.isArray(parserSettings)) {
        throw new TypeError('"settings" for ' + parser + ' must be an array');
      }
      parserSettings.forEach(function (ext) {return exts.add(ext);});
    }
  }

  return exts;
};

var isNodeModule = function isNodeModule(path) {return !/^\.|(\.\.\/)|(\/)/.test(path);};

/**
                                                                                           * parse import declaration
                                                                                           * info: source, specifiers
                                                                                           */
var parseImport = function parseImport(import_declaration, cur_path, context) {
  if (isNodeModule(import_declaration.source.value)) return;
  var destFilePath = _resolve["default"].relative(import_declaration.source.value, cur_path, context.settings);

  var namespace_indexed_import = (0, _fxjs.go)(
  import_declaration,
  (0, _fxjs.sel)('specifiers'),
  (0, _fxjs.filter)(function (specifier) {return [
    TYPE.IMPORT_NAMESPACE_SPECIFIER,
    TYPE.IMPORT_DEFAULT_SPECIFIER].
    includes(specifier.type);}),
  (0, _fxjs.map)(function (specifier) {
    var type = specifier.type === TYPE.IMPORT_DEFAULT_SPECIFIER ? 'default' : 'namespace';
    return _defineProperty({},
    specifier.local.name, { type: type, source: destFilePath });

  }),
  function (xs) {return _fxjs.extend.apply(void 0, [{}].concat(_toConsumableArray(xs)));});


  return new Map((0, _fxjs.entries)({
    form: _constant.IMPORT,
    namespace_indexed_import: namespace_indexed_import }));

};

// names, form, type
var parseNamedExport = function parseNamedExport(export_declaration) {
  var parseDeclaration = function parseDeclaration(declaration) {
    if (declaration.type === TYPE.FUNCTION_DECLARATION) return [declaration.id.name];
    return (0, _fxjs.map)(function (d) {return d.id.name;}, declaration.declarations);
  };

  var names = (0, _fxjs.go)(
  export_declaration,
  function (d) {
    if (d.declaration) return parseDeclaration(d.declaration);
    return (0, _fxjs.map)(function (s) {return s.exported.name;}, d.specifiers);
  },
  function (ns) {return new Set(ns);});


  return new Map(Object.entries({
    names: names,
    form: _constant.EXPORT }));

};

// export declaration -> exportsMap
var parseDefaultExport = function parseDefaultExport(export_declaration) {
  if (export_declaration.declaration.type !== TYPE.OBJECT_EXPRESSION) return;

  var keys = (0, _fxjs.go)(
  export_declaration.declaration.properties,
  (0, _fxjs.reject)((0, _fxjs.sel)('computed')),
  (0, _fxjs.pluck)('key'),
  (0, _fxjs.map)(function (k) {return (
      (0, _fxjs.equals)(k.type, TYPE.LITERAL) ? k.value :
      (0, _fxjs.equals)(k.type, TYPE.IDENTIFIER) ? k.name : '');}),
  (0, _fxjs.filter)(_fxjs.identity),
  function (ks) {return new Set(ks);});


  return new Map(Object.entries({
    keys: keys,
    form: _constant.EXPORT }));

};

/**
    * parse all source files and build up 2 maps containing the existing imports and exports
    */
var prepareImportsAndExports = function prepareImportsAndExports(srcFiles, context) {
  (0, _fxjs.go)(
  srcFiles,
  (0, _fxjs.map)(function (file) {
    var content = _fs["default"].readFileSync(file).toString();

    // const ast = parse(resolve(file, context), content, context);
    var ast = babelParser.parse(content, {
      sourceType: 'unambiguous' }).
    program;var _go =

    (0, _fxjs.go)(
    ast.body,
    (0, _fxjs.map)(function (node) {
      var cur_path = (0, _resolve["default"])(file, context);
      return (0, _fxjs.match)(node.type)["case"](
      (0, _fxjs.equals)(TYPE.IMPORT_DECLARATION))(function () {return parseImport(node, cur_path, context);})["case"](
      (0, _fxjs.equals)(TYPE.EXPORT_NAMED_DECLARATION))(function () {return parseNamedExport(node);})["case"](
      (0, _fxjs.equals)(TYPE.EXPORT_DEFAULT_DECLARATION))(function () {return parseDefaultExport(node);})["else"](
      function () {return null;});
    }),
    (0, _fxjs.filter)(_fxjs.identity),
    (0, _fxjs.partition)(function (line) {return line.get('form') === _constant.EXPORT;}),
    function (_ref14) {var _ref15 = _slicedToArray(_ref14, 2),_exports = _ref15[0],_imports = _ref15[1];
      var __imports = (0, _fxjs.go)(
      _imports,
      (0, _fxjs.map)(function (i) {return i.get('namespace_indexed_import');}),
      function (objs) {return _fxjs.extend.apply(void 0, [{}].concat(_toConsumableArray(objs)));});


      return [__imports, mergeExport(_exports)];
    }),_go2 = _slicedToArray(_go, 2),imports = _go2[0],exports = _go2[1];


    return [file, imports, exports];
  }),
  function (parse_results) {return (0, _fxjs.reduce)(function (acc, _ref16) {var _ref17 = _slicedToArray(_ref16, 3),file = _ref17[0],_imports = _ref17[1],_exports = _ref17[2];
      acc.imports.set(file, _imports);
      acc.exports.set(file, _exports);
      return acc;
    }, { imports: new Map(), exports: new Map() }, parse_results);},
  setCache);


  log('finish prepare!');
};

var srcFiles;
var lastPrepareKey;

var doPreparation = function doPreparation(ignoreExports, context) {
  log('prepare start!');
  var prepareKey = JSON.stringify({
    ignoreExports: (ignoreExports || []).sort(),
    extensions: Array.from(getFileExtensions(context.settings)).sort() });


  if (prepareKey === lastPrepareKey) {
    return;
  }
  log('process cwd', process.cwd());

  srcFiles = resolveFiles([process.cwd()], ignoreExports, context);
  // srcFiles = resolveFiles([path.join(process.cwd(), './tests')], ignoreExports, context);

  prepareImportsAndExports(srcFiles, context);
  lastPrepareKey = prepareKey;
};

module.exports = {
  meta: {
    type: 'problem',
    schema: [] },

  create: function create(context) {var _ref18 =


    context.options[0] || {},_ref18$ignoreExports = _ref18.ignoreExports,ignoreExports = _ref18$ignoreExports === void 0 ? [] : _ref18$ignoreExports;

    doPreparation(ignoreExports, context);
    // logCache();
    var file = context.getFilename();

    log('file :' + file);
    log('\n------------parse finish \n\n');

    return {
      MemberExpression: function MemberExpression(node) {
        log("\n\n<-----".concat(TYPE.MEMBER_EXPRESSION, "---->\n\n"));
        var namespace = node.object.name;
        var property = node.property.name;

        if (node.object.type !== TYPE.IDENTIFIER) return;
        if (node.property.type !== TYPE.IDENTIFIER) return;

        var namespaceInfo = getPathImportNamespace(namespace, file);

        if (!namespaceInfo) return;

        var exportInfo = cache.exports.get(namespaceInfo.source);

        if (namespaceInfo.type === 'default' && !exportInfo.get('default').has(property)) {
          return context.report(
          node, "imported default namespace '".concat(
          namespace, "' does not have object property '").concat(property, "'"));

        }

        if (
        namespaceInfo.type === 'namespace' &&
        !exportInfo.get('names').has(property) &&
        !exportInfo.get('names').length // default 가 없는 경우
        ) {
            return context.report(
            node, "imported '* as' namespace '".concat(
            namespace, "' does not have named export '").concat(property, "'"));

          }
      },
      ExportNamedDeclaration: function ExportNamedDeclaration(node) {
        log("\n\n<-----".concat(TYPE.EXPORT_NAMED_DECLARATION, "---->\n\n"));
        (0, _fxjs.go)(
        node,
        parseNamedExport,
        wrapArr,
        mergeExport,
        function (exportsMap) {return updateNamedExportCache(exportsMap, file);});

      },
      ExportDefaultDeclaration: function ExportDefaultDeclaration(node) {
        log("\n\n<-----".concat(TYPE.EXPORT_DEFAULT_DECLARATION, "---->\n\n"));
        (0, _fxjs.go)(
        node,
        parseDefaultExport,
        wrapArr,
        mergeExport,
        function (exportsMap) {return updateDefaultExportCache(exportsMap, file);});

      },
      ImportDeclaration: function ImportDeclaration(node) {
        log("\n\n<-----".concat(TYPE.IMPORT_DECLARATION, "---->\n\n"));
        updateImport(node, file, context);
      } };

  } };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ydWxlcy9uby1taXNzaW5nLW9iamVjdC1wcm9wZXJ0eS5qcyJdLCJuYW1lcyI6WyJyZXF1aXJlIiwid3JhcEFyciIsInhzIiwiQXJyYXkiLCJiYWJlbFBhcnNlciIsImxvZyIsInN0ciIsIkVycm9yIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0YWNrIiwibWVzc2FnZSIsImZzIiwiYXBwZW5kRmlsZVN5bmMiLCJjYWNoZSIsInNldENhY2hlIiwiaW1wb3J0cyIsImV4cG9ydHMiLCJ1cGRhdGVJbXBvcnRDYWNoZSIsImZpbGVQYXRoIiwiZ2V0IiwidXBkYXRlRGVmYXVsdEV4cG9ydENhY2hlIiwiZXhwb3J0c01hcCIsImV4cG9ydF9jYWNoZSIsImtleSIsImFkZCIsInVwZGF0ZU5hbWVkRXhwb3J0Q2FjaGUiLCJuYW1lIiwibG9nQ2FjaGUiLCJwYXRoIiwibmFtZXNwYWNlIiwiayIsInYiLCJzb3VyY2VzIiwiam9pbiIsImdldFBhdGhJbXBvcnROYW1lc3BhY2UiLCJpc0VtcHR5T2JqZWN0Iiwib2JqIiwibGVuZ3RoIiwidXBkYXRlSW1wb3J0IiwiaW1wb3J0X2RlY2xhcmF0aW9uIiwiY29udGV4dCIsInBhcnNlZF9pbXBvcnQiLCJwYXJzZUltcG9ydCIsImlkZW50aXR5IiwiaSIsImNhY2hlX2ltcG9ydCIsInVuY2FjaGVkIiwiZW50cmllc0wiLCJ0eXBlIiwic291cmNlIiwibWVyZ2VFeHBvcnQiLCJfZXhwb3J0cyIsImRlZmF1bHRFeHBvcnQiLCJlIiwiaGFzIiwibWVyZ2VkTmFtZXMiLCJucyIsIk1hcCIsIm5hbWVzIiwiU2V0IiwidHJhdmVyc2VOb2RlIiwiZm4iLCJub2RlIiwidmFsdWVzTCIsImZsYXRMIiwibiIsIk5vZGUiLCJ0YWtlQWxsIiwibGlzdEZpbGVzVG9Qcm9jZXNzIiwiRmlsZUVudW1lcmF0b3IiLCJzcmMiLCJleHRlbnNpb25zIiwiZnJvbSIsIml0ZXJhdGVGaWxlcyIsImlnbm9yZWQiLCJmaWxlbmFtZSIsImUxIiwib3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MiLCJlMiIsInBhdHRlcm5zIiwicmVkdWNlIiwiY2FycnkiLCJwYXR0ZXJuIiwiY29uY2F0IiwibWFwIiwiZXh0ZW5zaW9uIiwidGVzdCIsInNsaWNlIiwicmVzb2x2ZUZpbGVzIiwiaWdub3JlRXhwb3J0cyIsImdldEZpbGVFeHRlbnNpb25zIiwic2V0dGluZ3MiLCJleHRzIiwicGFyc2VyIiwicGFyc2VyU2V0dGluZ3MiLCJpc0FycmF5IiwiVHlwZUVycm9yIiwiZm9yRWFjaCIsImV4dCIsImlzTm9kZU1vZHVsZSIsImN1cl9wYXRoIiwidmFsdWUiLCJkZXN0RmlsZVBhdGgiLCJyZXNvbHZlIiwicmVsYXRpdmUiLCJuYW1lc3BhY2VfaW5kZXhlZF9pbXBvcnQiLCJzcGVjaWZpZXIiLCJUWVBFIiwiSU1QT1JUX05BTUVTUEFDRV9TUEVDSUZJRVIiLCJJTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIiLCJpbmNsdWRlcyIsImxvY2FsIiwiZXh0ZW5kIiwiZm9ybSIsIklNUE9SVCIsInBhcnNlTmFtZWRFeHBvcnQiLCJleHBvcnRfZGVjbGFyYXRpb24iLCJwYXJzZURlY2xhcmF0aW9uIiwiZGVjbGFyYXRpb24iLCJGVU5DVElPTl9ERUNMQVJBVElPTiIsImlkIiwiZCIsImRlY2xhcmF0aW9ucyIsInMiLCJleHBvcnRlZCIsInNwZWNpZmllcnMiLCJPYmplY3QiLCJlbnRyaWVzIiwiRVhQT1JUIiwicGFyc2VEZWZhdWx0RXhwb3J0IiwiT0JKRUNUX0VYUFJFU1NJT04iLCJrZXlzIiwicHJvcGVydGllcyIsIkxJVEVSQUwiLCJJREVOVElGSUVSIiwia3MiLCJwcmVwYXJlSW1wb3J0c0FuZEV4cG9ydHMiLCJzcmNGaWxlcyIsImZpbGUiLCJjb250ZW50IiwicmVhZEZpbGVTeW5jIiwidG9TdHJpbmciLCJhc3QiLCJwYXJzZSIsInNvdXJjZVR5cGUiLCJwcm9ncmFtIiwiYm9keSIsIklNUE9SVF9ERUNMQVJBVElPTiIsIkVYUE9SVF9OQU1FRF9ERUNMQVJBVElPTiIsIkVYUE9SVF9ERUZBVUxUX0RFQ0xBUkFUSU9OIiwibGluZSIsIl9pbXBvcnRzIiwiX19pbXBvcnRzIiwib2JqcyIsInBhcnNlX3Jlc3VsdHMiLCJhY2MiLCJzZXQiLCJsYXN0UHJlcGFyZUtleSIsImRvUHJlcGFyYXRpb24iLCJwcmVwYXJlS2V5Iiwic29ydCIsInByb2Nlc3MiLCJjd2QiLCJtb2R1bGUiLCJtZXRhIiwic2NoZW1hIiwiY3JlYXRlIiwib3B0aW9ucyIsImdldEZpbGVuYW1lIiwiTWVtYmVyRXhwcmVzc2lvbiIsIk1FTUJFUl9FWFBSRVNTSU9OIiwib2JqZWN0IiwicHJvcGVydHkiLCJuYW1lc3BhY2VJbmZvIiwiZXhwb3J0SW5mbyIsInJlcG9ydCIsIkV4cG9ydE5hbWVkRGVjbGFyYXRpb24iLCJFeHBvcnREZWZhdWx0RGVjbGFyYXRpb24iLCJJbXBvcnREZWNsYXJhdGlvbiJdLCJtYXBwaW5ncyI6ImFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhCO0FBQ0FBLE9BQU8sQ0FBQyxpQkFBRCxDQUFQOztBQUVBLElBQU1DLE9BQU8sR0FBRyxTQUFWQSxPQUFVLENBQUFDLEVBQUUsVUFBSUEsRUFBRSxZQUFZQyxLQUFkLEdBQXNCRCxFQUF0QixHQUEyQixDQUFDQSxFQUFELENBQS9CLEVBQWxCOztBQUVBLElBQU1FLFdBQVcsR0FBR0osT0FBTyxDQUFDLGVBQUQsQ0FBM0I7O0FBRUEsSUFBTUssR0FBRyxHQUFHLFNBQU5BLEdBQU0sQ0FBQUMsR0FBRyxFQUFJO0FBQ2pCLE1BQUlBLEdBQUcsWUFBWUMsS0FBbkIsRUFBMEI7QUFDeEJELElBQUFBLEdBQUcsR0FBR0UsSUFBSSxDQUFDQyxTQUFMLENBQWU7QUFDbkJDLE1BQUFBLEtBQUssRUFBRUosR0FBRyxDQUFDSSxLQURRO0FBRW5CQyxNQUFBQSxPQUFPLEVBQUVMLEdBQUcsQ0FBQ0ssT0FGTSxFQUFmLENBQU47O0FBSUQ7QUFDREMsaUJBQUdDLGNBQUgsQ0FBa0IsaUJBQWxCLEVBQXFDUCxHQUFHLEdBQUcsSUFBM0M7QUFDQTtB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Q0FBNUIsRUFMWjs7QUFPRCxPQXBESTtBQXFETHdDLE1BQUFBLGlCQUFpQixFQUFFLDJCQUFBcEgsSUFBSSxFQUFJO0FBQ3pCMUQsUUFBQUEsR0FBRyxxQkFBY3VHLElBQUksQ0FBQ3dDLGtCQUFuQixlQUFIO0FBQ0E3RyxRQUFBQSxZQUFZLENBQUN3QixJQUFELEVBQU80RSxJQUFQLEVBQWFsRyxPQUFiLENBQVo7QUFDRCxPQXhESSxFQUFQOztBQTBERCxHQTNFYyxFQUFqQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGlmRWxzZSwgZWFjaCwgYXNzaWduLCBvYmplY3QsIGVudHJpZXNMLCBleHRlbmQsIHJlZHVjZSwgZmxhdCwgZW50cmllcywgZmluZCwgaWRlbnRpdHksIHJlamVjdCwgZXF1YWxzLCBtYXRjaCwgcGx1Y2ssIGZpbHRlciwgc2VsLCBnbywgbWFwLCBtYXBDLCBwYXJ0aXRpb24sIGN1cnJ5MiwgdmFsdWVzTCwgZmxhdEwsIGZpbHRlckwsIG1hcEwsIHRhcCwgdGFrZUFsbCwga2V5cyB9IGZyb20gJ2Z4anMnO1xuaW1wb3J0IHJlc29sdmUgZnJvbSAnZXNsaW50LW1vZHVsZS11dGlscy9yZXNvbHZlJztcbmltcG9ydCBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBUWVBFIGZyb20gJy4uL2NvbnN0YW50X3R5cGUuanMnO1xuaW1wb3J0IHsgRVhQT1JULCBJTVBPUlQgfSBmcm9tICcuLi9jb25zdGFudCc7XG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnYWNvcm4nO1xucmVxdWlyZSgnQGJhYmVsL3BvbHlmaWxsJyk7XG5cbmNvbnN0IHdyYXBBcnIgPSB4cyA9PiB4cyBpbnN0YW5jZW9mIEFycmF5ID8geHMgOiBbeHNdO1xuXG5jb25zdCBiYWJlbFBhcnNlciA9IHJlcXVpcmUoJ0BiYWJlbC9wYXJzZXInKTtcblxuY29uc3QgbG9nID0gc3RyID0+IHtcbiAgaWYgKHN0ciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgc3RyID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgc3RhY2s6IHN0ci5zdGFjayxcbiAgICAgIG1lc3NhZ2U6IHN0ci5tZXNzYWdlLFxuICAgIH0pO1xuICB9XG4gIGZzLmFwcGVuZEZpbGVTeW5jKCcuL2RlYnVnLWxvZy50eHQnLCBzdHIgKyAnXFxuJyk7XG4gIC8vIGNvbnNvbGUubG9nKHN0cik7XG59O1xuXG4vLyBjYWNoZVxuY29uc3QgY2FjaGUgPSB7fTtcbmNvbnN0IHNldENhY2hlID0gKHsgaW1wb3J0cywgZXhwb3J0cyB9KSA9PiB7XG4gIGNhY2hlLmltcG9ydHMgPSBpbXBvcnRzO1xuICBjYWNoZS5leHBvcnRzID0gZXhwb3J0cztcbn07XG5cbmNvbnN0IHVwZGF0ZUltcG9ydENhY2hlID0gKGltcG9ydHMsIGZpbGVQYXRoKSA9PiB7XG4gIGFzc2lnbihjYWNoZS5pbXBvcnRzLmdldChmaWxlUGF0aCksIGltcG9ydHMpO1xufTtcblxuY29uc3QgdXBkYXRlRGVmYXVsdEV4cG9ydENhY2hlID0gKGV4cG9ydHNNYXAsIGZpbGVQYXRoKSA9PiB7XG4gIGNvbnN0IGV4cG9ydF9jYWNoZSA9IGNhY2hlLmV4cG9ydHMuZ2V0KGZpbGVQYXRoKTtcbiAgZWFjaChcbiAgICBrZXkgPT4gZXhwb3J0X2NhY2hlLmdldCgnZGVmYXVsdCcpLmFkZChrZXkpLFxuICAgIGV4cG9ydHNNYXAuZ2V0KCdkZWZhdWx0JyksIC8vIGtleXNcbiAgKTtcbn07XG5cbmNvbnN0IHVwZGF0ZU5hbWVkRXhwb3J0Q2FjaGUgPSAoZXhwb3J0c01hcCwgZmlsZVBhdGgpID0+IHtcbiAgY29uc3QgZXhwb3J0X2NhY2hlID0gY2FjaGUuZXhwb3J0cy5nZXQoZmlsZVBhdGgpO1xuICBlYWNoKFxuICAgIG5hbWUgPT4gZXhwb3J0X2NhY2hlLmdldCgnbmFtZXMnKS5hZGQobmFtZSksXG4gICAgZXhwb3J0c01hcC5nZXQoJ25hbWVzJyksIC8vIGtleXNcbiAgKTtcbn07XG5cbmNvbnN0IGxvZ0NhY2hlID0gKCkgPT4ge1xuICBsb2coJ2ltcG9ydHMnKTtcbiAgbWFwKChbcGF0aCwgbmFtZXNwYWNlXSkgPT4ge1xuICAgIGxvZyhwYXRoICsgJyAtPiBcXG4nKTtcbiAgICBtYXAoKFtrLCB2XSkgPT4ge1xuICAgICAgbG9nKGBcXHQke2t9OiAke3R5cGVvZiB2ID09PSAnb2JqZWN0JyA/IEpTT04uc3RyaW5naWZ5KHYpIDogdn1gKTtcbiAgICB9LCBlbnRyaWVzKG5hbWVzcGFjZSkpO1xuICAgIGxvZygnJyk7XG4gIH0sIGNhY2hlLmltcG9ydHMpO1xuXG4gIGxvZygnXFxuZXhwb3J0cycpO1xuICBtYXAoKFtwYXRoLCBzb3VyY2VzXSkgPT4ge1xuICAgIGxvZyhwYXRoICsgJyAtPiBcXG4nKTtcbiAgICBtYXAoKFtrLCB2XSkgPT4ge1xuICAgICAgbG9nKGBcXHQke2t9OiAke1suLi52XS5qb2luKCcsJyl9YCk7XG4gICAgfSwgc291cmNlcyk7XG4gICAgbG9nKCcnKTtcbiAgfSwgY2FjaGUuZXhwb3J0cyk7XG59O1xuXG5jb25zdCBnZXRQYXRoSW1wb3J0TmFtZXNwYWNlID0gKG5hbWVzcGFjZSwgZmlsZVBhdGgpID0+IHNlbChuYW1lc3BhY2UsIGNhY2hlLmltcG9ydHMuZ2V0KGZpbGVQYXRoKSk7XG5cbmNvbnN0IGlzRW1wdHlPYmplY3QgPSBvYmogPT4ga2V5cyhvYmopLmxlbmd0aDtcbmNvbnN0IHVwZGF0ZUltcG9ydCA9IChpbXBvcnRfZGVjbGFyYXRpb24sIGZpbGVQYXRoLCBjb250ZXh0KSA9PiB7XG4gIGNvbnN0IHBhcnNlZF9pbXBvcnQgPSBnbyhcbiAgICBwYXJzZUltcG9ydChpbXBvcnRfZGVjbGFyYXRpb24sIGZpbGVQYXRoLCBjb250ZXh0KSxcbiAgICBpZkVsc2UoaWRlbnRpdHksIGkgPT4gaS5nZXQoJy5uYW1lc3BhY2VfaW5kZXhlZF9pbXBvcnQnKSwgaWRlbnRpdHkpLFxuICApO1xuICBjb25zdCBjYWNoZV9pbXBvcnQgPSBjYWNoZS5pbXBvcnRzLmdldChmaWxlUGF0aCk7XG5cbiAgaWYgKCFwYXJzZWRfaW1wb3J0KSByZXR1cm47XG5cbiAgY29uc3QgdW5jYWNoZWQgPSBpc0VtcHR5T2JqZWN0KGNhY2hlX2ltcG9ydCkgPyBwYXJzZWRfaW1wb3J0IDogZ28oXG4gICAgcGFyc2VkX2ltcG9ydCxcbiAgICBlbnRyaWVzTCxcbiAgICByZWplY3QoKFtuYW1lc3BhY2UsIHsgdHlwZSwgc291cmNlIH1dKSA9PiB7XG4gICAgICBjb25zdCBpID0gY2FjaGVfaW1wb3J0W25hbWVzcGFjZV0gfHwge307XG4gICAgICByZXR1cm4gaS50eXBlID09PSB0eXBlICYmIGkuc291cmNlID09PSBzb3VyY2U7XG4gICAgfSksXG4gICk7XG5cbiAgaWYgKCF1bmNhY2hlZC5sZW5ndGgpIHJldHVybjtcblxuICB1cGRhdGVJbXBvcnRDYWNoZShmaWxlUGF0aCwgb2JqZWN0KHVuY2FjaGVkKSk7XG59O1xuXG5jb25zdCBtZXJnZUV4cG9ydCA9IChfZXhwb3J0cykgPT4ge1xuICBjb25zdCBkZWZhdWx0RXhwb3J0ID0gZmluZChlID0+IGUuaGFzKCdrZXlzJyksIF9leHBvcnRzKTtcbiAgY29uc3QgbWVyZ2VkTmFtZXMgPSBnbyhcbiAgICBfZXhwb3J0cyxcbiAgICBmaWx0ZXIoZSA9PiBlLmhhcygnbmFtZXMnKSksXG4gICAgbWFwKGUgPT4gZS5nZXQoJ25hbWVzJykpLFxuICAgIG5zID0+IGZsYXQoW25zLCBkZWZhdWx0RXhwb3J0ID8gJ2RlZmF1bHQnIDogW11dLCAyKSxcbiAgKTtcblxuICByZXR1cm4gbmV3IE1hcChlbnRyaWVzKHtcbiAgICBuYW1lczogbmV3IFNldChtZXJnZWROYW1lcyksXG4gICAgZGVmYXVsdDogZGVmYXVsdEV4cG9ydCA/IGRlZmF1bHRFeHBvcnQuZ2V0KCdrZXlzJykgOiBuZXcgU2V0KCksXG4gIH0pKTtcbn07XG5cbmNvbnN0IHRyYXZlcnNlTm9kZSA9IGN1cnJ5MigodHlwZSwgZm4sIG5vZGUpID0+IHtcbiAgZ28oXG4gICAgbm9kZSxcbiAgICB2YWx1ZXNMLFxuICAgIGZsYXRMLFxuICAgIGZpbHRlckwobiA9PiBuIGluc3RhbmNlb2YgTm9kZSksXG4gICAgbWFwTCh0YXAobiA9PiBuLnR5cGUgPT09IHR5cGUgPyBmbihuKSA6IG51bGwpKSxcbiAgICBtYXBMKG4gPT4gdHJhdmVyc2VOb2RlKHR5cGUsIGZuLCBuKSksXG4gICAgdGFrZUFsbCxcbiAgKTtcbn0pO1xuXG4vLyBlc2xpbnQvbGliL3V0aWwvZ2xvYi11dGlsIGhhcyBiZWVuIG1vdmVkIHRvIGVzbGludC9saWIvdXRpbC9nbG9iLXV0aWxzIHdpdGggdmVyc2lvbiA1LjNcbi8vIGFuZCBoYXMgYmVlbiBtb3ZlZCB0byBlc2xpbnQvbGliL2NsaS1lbmdpbmUvZmlsZS1lbnVtZXJhdG9yIGluIHZlcnNpb24gNlxubGV0IGxpc3RGaWxlc1RvUHJvY2VzcztcbnRyeSB7XG4gIGNvbnN0IEZpbGVFbnVtZXJhdG9yID0gcmVxdWlyZSgnZXNsaW50L2xpYi9jbGktZW5naW5lL2ZpbGUtZW51bWVyYXRvcicpLkZpbGVFbnVtZXJhdG9yO1xuICBsaXN0RmlsZXNUb1Byb2Nlc3MgPSBmdW5jdGlvbiAoc3JjLCBleHRlbnNpb25zKSB7XG4gICAgY29uc3QgZSA9IG5ldyBGaWxlRW51bWVyYXRvcih7XG4gICAgICBleHRlbnNpb25zOiBleHRlbnNpb25zLFxuICAgIH0pO1xuICAgIHJldHVybiBBcnJheS5mcm9tKGUuaXRlcmF0ZUZpbGVzKHNyYyksICh7IGZpbGVQYXRoLCBpZ25vcmVkIH0pID0+ICh7XG4gICAgICBpZ25vcmVkLFxuICAgICAgZmlsZW5hbWU6IGZpbGVQYXRoLFxuICAgIH0pKTtcbiAgfTtcbn0gY2F0Y2ggKGUxKSB7XG4gIC8vIFByZXZlbnQgcGFzc2luZyBpbnZhbGlkIG9wdGlvbnMgKGV4dGVuc2lvbnMgYXJyYXkpIHRvIG9sZCB2ZXJzaW9ucyBvZiB0aGUgZnVuY3Rpb24uXG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lc2xpbnQvZXNsaW50L2Jsb2IvdjUuMTYuMC9saWIvdXRpbC9nbG9iLXV0aWxzLmpzI0wxNzgtTDI4MFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZXNsaW50L2VzbGludC9ibG9iL3Y1LjIuMC9saWIvdXRpbC9nbG9iLXV0aWwuanMjTDE3NC1MMjY5XG4gIGxldCBvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcztcbiAgdHJ5IHtcbiAgICBvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcyA9IHJlcXVpcmUoJ2VzbGludC9saWIvdXRpbC9nbG9iLXV0aWxzJykubGlzdEZpbGVzVG9Qcm9jZXNzO1xuICAgIGxpc3RGaWxlc1RvUHJvY2VzcyA9IGZ1bmN0aW9uIChzcmMsIGV4dGVuc2lvbnMpIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbExpc3RGaWxlc1RvUHJvY2VzcyhzcmMsIHtcbiAgICAgICAgZXh0ZW5zaW9uczogZXh0ZW5zaW9ucyxcbiAgICAgIH0pO1xuICAgIH07XG4gIH0gY2F0Y2ggKGUyKSB7XG4gICAgb3JpZ2luYWxMaXN0RmlsZXNUb1Byb2Nlc3MgPSByZXF1aXJlKCdlc2xpbnQvbGliL3V0aWwvZ2xvYi11dGlsJykubGlzdEZpbGVzVG9Qcm9jZXNzO1xuXG4gICAgbGlzdEZpbGVzVG9Qcm9jZXNzID0gZnVuY3Rpb24gKHNyYywgZXh0ZW5zaW9ucykge1xuICAgICAgY29uc3QgcGF0dGVybnMgPSBzcmMucmVkdWNlKChjYXJyeSwgcGF0dGVybikgPT4ge1xuICAgICAgICByZXR1cm4gY2FycnkuY29uY2F0KGV4dGVuc2lvbnMubWFwKChleHRlbnNpb24pID0+IHtcbiAgICAgICAgICByZXR1cm4gL1xcKlxcKnxcXCpcXC4vLnRlc3QocGF0dGVybikgPyBwYXR0ZXJuIDogYCR7cGF0dGVybn0vKiovKiR7ZXh0ZW5zaW9ufWA7XG4gICAgICAgIH0pKTtcbiAgICAgIH0sIHNyYy5zbGljZSgpKTtcblxuICAgICAgcmV0dXJuIG9yaWdpbmFsTGlzdEZpbGVzVG9Qcm9jZXNzKHBhdHRlcm5zKTtcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogcmVhZCBhbGwgZmlsZXMgbWF0Y2hpbmcgdGhlIHBhdHRlcm5zIGluIHNyYyBhbmQgaWdub3JlRXhwb3J0c1xuICogcmV0dXJuIGFsbCBmaWxlcyBtYXRjaGluZyBzcmMgcGF0dGVybiwgd2hpY2ggYXJlIG5vdCBtYXRjaGluZyB0aGUgaWdub3JlRXhwb3J0cyBwYXR0ZXJuXG4gKi9cbmNvbnN0IHJlc29sdmVGaWxlcyA9IChzcmMsIGlnbm9yZUV4cG9ydHMsIGNvbnRleHQpID0+IHtcbiAgY29uc3QgZXh0ZW5zaW9ucyA9IEFycmF5LmZyb20oZ2V0RmlsZUV4dGVuc2lvbnMoY29udGV4dC5zZXR0aW5ncykpO1xuICByZXR1cm4gcGx1Y2soJ2ZpbGVuYW1lJywgbGlzdEZpbGVzVG9Qcm9jZXNzKHNyYywgZXh0ZW5zaW9ucykpO1xufTtcblxuY29uc3QgZ2V0RmlsZUV4dGVuc2lvbnMgPSAoc2V0dGluZ3MpID0+IHtcbiAgLy8gc3RhcnQgd2l0aCBleHBsaWNpdCBKUy1wYXJzZWQgZXh0ZW5zaW9uc1xuICBjb25zdCBleHRzID0gbmV3IFNldChzZXR0aW5nc1snaW1wb3J0L2V4dGVuc2lvbnMnXSB8fCBbJy5qcyddKTtcblxuICAvLyBhbGwgYWx0ZXJuYXRlIHBhcnNlciBleHRlbnNpb25zIGFyZSBhbHNvIHZhbGlkXG4gIGlmICgnaW1wb3J0L3BhcnNlcnMnIGluIHNldHRpbmdzKSB7XG4gICAgZm9yIChjb25zdCBwYXJzZXIgaW4gc2V0dGluZ3NbJ2ltcG9ydC9wYXJzZXJzJ10pIHtcbiAgICAgIGNvbnN0IHBhcnNlclNldHRpbmdzID0gc2V0dGluZ3NbJ2ltcG9ydC9wYXJzZXJzJ11bcGFyc2VyXTtcbiAgICAgIGlmICghQXJyYXkuaXNBcnJheShwYXJzZXJTZXR0aW5ncykpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJzZXR0aW5nc1wiIGZvciAnICsgcGFyc2VyICsgJyBtdXN0IGJlIGFuIGFycmF5Jyk7XG4gICAgICB9XG4gICAgICBwYXJzZXJTZXR0aW5ncy5mb3JFYWNoKGV4dCA9PiBleHRzLmFkZChleHQpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZXh0cztcbn07XG5cbmNvbnN0IGlzTm9kZU1vZHVsZSA9IHBhdGggPT4gIS9eXFwufChcXC5cXC5cXC8pfChcXC8pLy50ZXN0KHBhdGgpO1xuXG4vKipcbiAqIHBhcnNlIGltcG9ydCBkZWNsYXJhdGlvblxuICogaW5mbzogc291cmNlLCBzcGVjaWZpZXJzXG4gKi9cbmNvbnN0IHBhcnNlSW1wb3J0ID0gKGltcG9ydF9kZWNsYXJhdGlvbiwgY3VyX3BhdGgsIGNvbnRleHQpID0+IHtcbiAgaWYgKGlzTm9kZU1vZHVsZShpbXBvcnRfZGVjbGFyYXRpb24uc291cmNlLnZhbHVlKSkgcmV0dXJuO1xuICBjb25zdCBkZXN0RmlsZVBhdGggPSByZXNvbHZlLnJlbGF0aXZlKGltcG9ydF9kZWNsYXJhdGlvbi5zb3VyY2UudmFsdWUsIGN1cl9wYXRoLCBjb250ZXh0LnNldHRpbmdzKTtcblxuICBjb25zdCBuYW1lc3BhY2VfaW5kZXhlZF9pbXBvcnQgPSBnbyhcbiAgICBpbXBvcnRfZGVjbGFyYXRpb24sXG4gICAgc2VsKCdzcGVjaWZpZXJzJyksXG4gICAgZmlsdGVyKHNwZWNpZmllciA9PiBbXG4gICAgICBUWVBFLklNUE9SVF9OQU1FU1BBQ0VfU1BFQ0lGSUVSLFxuICAgICAgVFlQRS5JTVBPUlRfREVGQVVMVF9TUEVDSUZJRVIsXG4gICAgXS5pbmNsdWRlcyhzcGVjaWZpZXIudHlwZSkpLFxuICAgIG1hcChzcGVjaWZpZXIgPT4ge1xuICAgICAgY29uc3QgdHlwZSA9IHNwZWNpZmllci50eXBlID09PSBUWVBFLklNUE9SVF9ERUZBVUxUX1NQRUNJRklFUiA/ICdkZWZhdWx0JyA6ICduYW1lc3BhY2UnO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgW3NwZWNpZmllci5sb2NhbC5uYW1lXTogeyB0eXBlLCBzb3VyY2U6IGRlc3RGaWxlUGF0aCB9LFxuICAgICAgfTtcbiAgICB9KSxcbiAgICB4cyA9PiBleHRlbmQoe30sIC4uLnhzKSxcbiAgKTtcblxuICByZXR1cm4gbmV3IE1hcChlbnRyaWVzKHtcbiAgICBmb3JtOiBJTVBPUlQsXG4gICAgbmFtZXNwYWNlX2luZGV4ZWRfaW1wb3J0LFxuICB9KSk7XG59O1xuXG4vLyBuYW1lcywgZm9ybSwgdHlwZVxuY29uc3QgcGFyc2VOYW1lZEV4cG9ydCA9IChleHBvcnRfZGVjbGFyYXRpb24pID0+IHtcbiAgY29uc3QgcGFyc2VEZWNsYXJhdGlvbiA9IChkZWNsYXJhdGlvbikgPT4ge1xuICAgIGlmIChkZWNsYXJhdGlvbi50eXBlID09PSBUWVBFLkZVTkNUSU9OX0RFQ0xBUkFUSU9OKSByZXR1cm4gW2RlY2xhcmF0aW9uLmlkLm5hbWVdO1xuICAgIHJldHVybiBtYXAoZCA9PiBkLmlkLm5hbWUsIGRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucyk7XG4gIH07XG5cbiAgY29uc3QgbmFtZXMgPSBnbyhcbiAgICBleHBvcnRfZGVjbGFyYXRpb24sXG4gICAgZCA9PiB7XG4gICAgICBpZiAoZC5kZWNsYXJhdGlvbikgcmV0dXJuIHBhcnNlRGVjbGFyYXRpb24oZC5kZWNsYXJhdGlvbik7XG4gICAgICByZXR1cm4gbWFwKHMgPT4gcy5leHBvcnRlZC5uYW1lLCBkLnNwZWNpZmllcnMpO1xuICAgIH0sXG4gICAgbnMgPT4gbmV3IFNldChucyksXG4gICk7XG5cbiAgcmV0dXJuIG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoe1xuICAgIG5hbWVzLFxuICAgIGZvcm06IEVYUE9SVCxcbiAgfSkpO1xufTtcblxuLy8gZXhwb3J0IGRlY2xhcmF0aW9uIC0+IGV4cG9ydHNNYXBcbmNvbnN0IHBhcnNlRGVmYXVsdEV4cG9ydCA9IChleHBvcnRfZGVjbGFyYXRpb24pID0+IHtcbiAgaWYgKGV4cG9ydF9kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbi50eXBlICE9PSBUWVBFLk9CSkVDVF9FWFBSRVNTSU9OKSByZXR1cm47XG5cbiAgY29uc3Qga2V5cyA9IGdvKFxuICAgIGV4cG9ydF9kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbi5wcm9wZXJ0aWVzLFxuICAgIHJlamVjdChzZWwoJ2NvbXB1dGVkJykpLFxuICAgIHBsdWNrKCdrZXknKSxcbiAgICBtYXAoayA9PlxuICAgICAgZXF1YWxzKGsudHlwZSwgVFlQRS5MSVRFUkFMKSA/IGsudmFsdWVcbiAgICAgICAgOiBlcXVhbHMoay50eXBlLCBUWVBFLklERU5USUZJRVIpID8gay5uYW1lIDogJycpLFxuICAgIGZpbHRlcihpZGVudGl0eSksXG4gICAga3MgPT4gbmV3IFNldChrcyksXG4gICk7XG5cbiAgcmV0dXJuIG5ldyBNYXAoT2JqZWN0LmVudHJpZXMoe1xuICAgIGtleXMsXG4gICAgZm9ybTogRVhQT1JULFxuICB9KSk7XG59O1xuXG4vKipcbiAqIHBhcnNlIGFsbCBzb3VyY2UgZmlsZXMgYW5kIGJ1aWxkIHVwIDIgbWFwcyBjb250YWluaW5nIHRoZSBleGlzdGluZyBpbXBvcnRzIGFuZCBleHBvcnRzXG4gKi9cbmNvbnN0IHByZXBhcmVJbXBvcnRzQW5kRXhwb3J0cyA9IChzcmNGaWxlcywgY29udGV4dCkgPT4ge1xuICBnbyhcbiAgICBzcmNGaWxlcyxcbiAgICBtYXAoKGZpbGUpID0+IHtcbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZmlsZSkudG9TdHJpbmcoKTtcblxuICAgICAgLy8gY29uc3QgYXN0ID0gcGFyc2UocmVzb2x2ZShmaWxlLCBjb250ZXh0KSwgY29udGVudCwgY29udGV4dCk7XG4gICAgICBjb25zdCBhc3QgPSBiYWJlbFBhcnNlci5wYXJzZShjb250ZW50LCB7XG4gICAgICAgIHNvdXJjZVR5cGU6ICd1bmFtYmlndW91cycsXG4gICAgICB9KS5wcm9ncmFtO1xuXG4gICAgICBjb25zdCBbaW1wb3J0cywgZXhwb3J0c10gPSBnbyhcbiAgICAgICAgYXN0LmJvZHksXG4gICAgICAgIG1hcChub2RlID0+IHtcbiAgICAgICAgICBjb25zdCBjdXJfcGF0aCA9IHJlc29sdmUoZmlsZSwgY29udGV4dCk7XG4gICAgICAgICAgcmV0dXJuIG1hdGNoKG5vZGUudHlwZSlcbiAgICAgICAgICAgIC5jYXNlKGVxdWFscyhUWVBFLklNUE9SVF9ERUNMQVJBVElPTikpKCgpID0+IHBhcnNlSW1wb3J0KG5vZGUsIGN1cl9wYXRoLCBjb250ZXh0KSlcbiAgICAgICAgICAgIC5jYXNlKGVxdWFscyhUWVBFLkVYUE9SVF9OQU1FRF9ERUNMQVJBVElPTikpKCgpID0+IHBhcnNlTmFtZWRFeHBvcnQobm9kZSkpXG4gICAgICAgICAgICAuY2FzZShlcXVhbHMoVFlQRS5FWFBPUlRfREVGQVVMVF9ERUNMQVJBVElPTikpKCgpID0+IHBhcnNlRGVmYXVsdEV4cG9ydChub2RlKSlcbiAgICAgICAgICAgIC5lbHNlKCgpID0+IG51bGwpO1xuICAgICAgICB9KSxcbiAgICAgICAgZmlsdGVyKGlkZW50aXR5KSxcbiAgICAgICAgcGFydGl0aW9uKGxpbmUgPT4gbGluZS5nZXQoJ2Zvcm0nKSA9PT0gRVhQT1JUKSxcbiAgICAgICAgKFtfZXhwb3J0cywgX2ltcG9ydHNdKSA9PiB7XG4gICAgICAgICAgY29uc3QgX19pbXBvcnRzID0gZ28oXG4gICAgICAgICAgICBfaW1wb3J0cyxcbiAgICAgICAgICAgIG1hcChpID0+IGkuZ2V0KCduYW1lc3BhY2VfaW5kZXhlZF9pbXBvcnQnKSksXG4gICAgICAgICAgICAob2JqcykgPT4gZXh0ZW5kKHt9LCAuLi5vYmpzKSxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgcmV0dXJuIFtfX2ltcG9ydHMsIG1lcmdlRXhwb3J0KF9leHBvcnRzKV07XG4gICAgICAgIH0sXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gW2ZpbGUsIGltcG9ydHMsIGV4cG9ydHNdO1xuICAgIH0pLFxuICAgIHBhcnNlX3Jlc3VsdHMgPT4gcmVkdWNlKChhY2MsIFtmaWxlLCBfaW1wb3J0cywgX2V4cG9ydHNdKSA9PiB7XG4gICAgICBhY2MuaW1wb3J0cy5zZXQoZmlsZSwgX2ltcG9ydHMpO1xuICAgICAgYWNjLmV4cG9ydHMuc2V0KGZpbGUsIF9leHBvcnRzKTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwgeyBpbXBvcnRzOiBuZXcgTWFwKCksIGV4cG9ydHM6IG5ldyBNYXAoKSB9LCBwYXJzZV9yZXN1bHRzKSxcbiAgICBzZXRDYWNoZSxcbiAgKTtcblxuICBsb2coJ2ZpbmlzaCBwcmVwYXJlIScpO1xufTtcblxubGV0IHNyY0ZpbGVzO1xubGV0IGxhc3RQcmVwYXJlS2V5O1xuXG5jb25zdCBkb1ByZXBhcmF0aW9uID0gKGlnbm9yZUV4cG9ydHMsIGNvbnRleHQpID0+IHtcbiAgbG9nKCdwcmVwYXJlIHN0YXJ0IScpO1xuICBjb25zdCBwcmVwYXJlS2V5ID0gSlNPTi5zdHJpbmdpZnkoe1xuICAgIGlnbm9yZUV4cG9ydHM6IChpZ25vcmVFeHBvcnRzIHx8IFtdKS5zb3J0KCksXG4gICAgZXh0ZW5zaW9uczogQXJyYXkuZnJvbShnZXRGaWxlRXh0ZW5zaW9ucyhjb250ZXh0LnNldHRpbmdzKSkuc29ydCgpLFxuICB9KTtcblxuICBpZiAocHJlcGFyZUtleSA9PT0gbGFzdFByZXBhcmVLZXkpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbG9nKCdwcm9jZXNzIGN3ZCcsIHByb2Nlc3MuY3dkKCkpO1xuXG4gIHNyY0ZpbGVzID0gcmVzb2x2ZUZpbGVzKFtwcm9jZXNzLmN3ZCgpXSwgaWdub3JlRXhwb3J0cywgY29udGV4dCk7XG4gIC8vIHNyY0ZpbGVzID0gcmVzb2x2ZUZpbGVzKFtwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy4vdGVzdHMnKV0sIGlnbm9yZUV4cG9ydHMsIGNvbnRleHQpO1xuXG4gIHByZXBhcmVJbXBvcnRzQW5kRXhwb3J0cyhzcmNGaWxlcywgY29udGV4dCk7XG4gIGxhc3RQcmVwYXJlS2V5ID0gcHJlcGFyZUtleTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIHNjaGVtYTogW10sXG4gIH0sXG4gIGNyZWF0ZTogY29udGV4dCA9PiB7XG4gICAgY29uc3Qge1xuICAgICAgaWdub3JlRXhwb3J0cyA9IFtdLFxuICAgIH0gPSBjb250ZXh0Lm9wdGlvbnNbMF0gfHwge307XG5cbiAgICBkb1ByZXBhcmF0aW9uKGlnbm9yZUV4cG9ydHMsIGNvbnRleHQpO1xuICAgIC8vIGxvZ0NhY2hlKCk7XG4gICAgY29uc3QgZmlsZSA9IGNvbnRleHQuZ2V0RmlsZW5hbWUoKTtcblxuICAgIGxvZygnZmlsZSA6JyArIGZpbGUpO1xuICAgIGxvZygnXFxuLS0tLS0tLS0tLS0tcGFyc2UgZmluaXNoIFxcblxcbicpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIE1lbWJlckV4cHJlc3Npb246IG5vZGUgPT4ge1xuICAgICAgICBsb2coYFxcblxcbjwtLS0tLSR7VFlQRS5NRU1CRVJfRVhQUkVTU0lPTn0tLS0tPlxcblxcbmApO1xuICAgICAgICBjb25zdCBuYW1lc3BhY2UgPSBub2RlLm9iamVjdC5uYW1lO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eSA9IG5vZGUucHJvcGVydHkubmFtZTtcblxuICAgICAgICBpZiAobm9kZS5vYmplY3QudHlwZSAhPT0gVFlQRS5JREVOVElGSUVSKSByZXR1cm47XG4gICAgICAgIGlmIChub2RlLnByb3BlcnR5LnR5cGUgIT09IFRZUEUuSURFTlRJRklFUikgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IG5hbWVzcGFjZUluZm8gPSBnZXRQYXRoSW1wb3J0TmFtZXNwYWNlKG5hbWVzcGFjZSwgZmlsZSk7XG5cbiAgICAgICAgaWYgKCFuYW1lc3BhY2VJbmZvKSByZXR1cm47XG5cbiAgICAgICAgY29uc3QgZXhwb3J0SW5mbyA9IGNhY2hlLmV4cG9ydHMuZ2V0KG5hbWVzcGFjZUluZm8uc291cmNlKTtcblxuICAgICAgICBpZiAobmFtZXNwYWNlSW5mby50eXBlID09PSAnZGVmYXVsdCcgJiYgIWV4cG9ydEluZm8uZ2V0KCdkZWZhdWx0JykuaGFzKHByb3BlcnR5KSkge1xuICAgICAgICAgIHJldHVybiBjb250ZXh0LnJlcG9ydChcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBgaW1wb3J0ZWQgZGVmYXVsdCBuYW1lc3BhY2UgJyR7bmFtZXNwYWNlfScgZG9lcyBub3QgaGF2ZSBvYmplY3QgcHJvcGVydHkgJyR7cHJvcGVydHl9J2AsXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChcbiAgICAgICAgICBuYW1lc3BhY2VJbmZvLnR5cGUgPT09ICduYW1lc3BhY2UnICYmXG4gICAgICAgICAgIWV4cG9ydEluZm8uZ2V0KCduYW1lcycpLmhhcyhwcm9wZXJ0eSkgJiZcbiAgICAgICAgICAhZXhwb3J0SW5mby5nZXQoJ25hbWVzJykubGVuZ3RoIC8vIGRlZmF1bHQg6rCAIOyXhuuKlCDqsr3smrBcbiAgICAgICAgKSB7XG4gICAgICAgICAgcmV0dXJuIGNvbnRleHQucmVwb3J0KFxuICAgICAgICAgICAgbm9kZSxcbiAgICAgICAgICAgIGBpbXBvcnRlZCAnKiBhcycgbmFtZXNwYWNlICcke25hbWVzcGFjZX0nIGRvZXMgbm90IGhhdmUgbmFtZWQgZXhwb3J0ICcke3Byb3BlcnR5fSdgLFxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBFeHBvcnROYW1lZERlY2xhcmF0aW9uOiBub2RlID0+IHtcbiAgICAgICAgbG9nKGBcXG5cXG48LS0tLS0ke1RZUEUuRVhQT1JUX05BTUVEX0RFQ0xBUkFUSU9OfS0tLS0+XFxuXFxuYCk7XG4gICAgICAgIGdvKFxuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgcGFyc2VOYW1lZEV4cG9ydCxcbiAgICAgICAgICB3cmFwQXJyLFxuICAgICAgICAgIG1lcmdlRXhwb3J0LFxuICAgICAgICAgIGV4cG9ydHNNYXAgPT4gdXBkYXRlTmFtZWRFeHBvcnRDYWNoZShleHBvcnRzTWFwLCBmaWxlKSxcbiAgICAgICAgKTtcbiAgICAgIH0sXG4gICAgICBFeHBvcnREZWZhdWx0RGVjbGFyYXRpb246IG5vZGUgPT4ge1xuICAgICAgICBsb2coYFxcblxcbjwtLS0tLSR7VFlQRS5FWFBPUlRfREVGQVVMVF9ERUNMQVJBVElPTn0tLS0tPlxcblxcbmApO1xuICAgICAgICBnbyhcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIHBhcnNlRGVmYXVsdEV4cG9ydCxcbiAgICAgICAgICB3cmFwQXJyLFxuICAgICAgICAgIG1lcmdlRXhwb3J0LFxuICAgICAgICAgIGV4cG9ydHNNYXAgPT4gdXBkYXRlRGVmYXVsdEV4cG9ydENhY2hlKGV4cG9ydHNNYXAsIGZpbGUpLFxuICAgICAgICApO1xuICAgICAgfSxcbiAgICAgIEltcG9ydERlY2xhcmF0aW9uOiBub2RlID0+IHtcbiAgICAgICAgbG9nKGBcXG5cXG48LS0tLS0ke1RZUEUuSU1QT1JUX0RFQ0xBUkFUSU9OfS0tLS0+XFxuXFxuYCk7XG4gICAgICAgIHVwZGF0ZUltcG9ydChub2RlLCBmaWxlLCBjb250ZXh0KTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfSxcbn07XG4iXX0=