"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _react() {
  const data = _interopRequireDefault(require("react"));

  _react = function _react() {
    return data;
  };

  return data;
}

function _slash() {
  const data = _interopRequireDefault(require("slash2"));

  _slash = function _slash() {
    return data;
  };

  return data;
}

function _serveStatic() {
  const data = _interopRequireDefault(require("serve-static"));

  _serveStatic = function _serveStatic() {
    return data;
  };

  return data;
}

function _fs() {
  const data = require("fs");

  _fs = function _fs() {
    return data;
  };

  return data;
}

function _path() {
  const data = _interopRequireDefault(require("path"));

  _path = function _path() {
    return data;
  };

  return data;
}

function _rimraf() {
  const data = _interopRequireDefault(require("rimraf"));

  _rimraf = function _rimraf() {
    return data;
  };

  return data;
}

function _less() {
  const data = _interopRequireDefault(require("less"));

  _less = function _less() {
    return data;
  };

  return data;
}

var _defaultTheme = _interopRequireDefault(require("./defaultTheme"));

function _uglifycss() {
  const data = _interopRequireDefault(require("uglifycss"));

  _uglifycss = function _uglifycss() {
    return data;
  };

  return data;
}

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(api) {
  api.logger.info('use plugin');
  let options = _defaultTheme.default; // 获取主题 json 配置文件

  const themeConfigPath = (0, _slash().default)(_path().default.join(api.paths.cwd || '', 'config/theme.config.ts'));

  if ((0, _fs().existsSync)(themeConfigPath)) {
    options = require(themeConfigPath);
  }

  const _api$paths = api.paths,
        cwd = _api$paths.cwd,
        absOutputPath = _api$paths.absOutputPath,
        _api$paths$absNodeMod = _api$paths.absNodeModulesPath,
        absNodeModulesPath = _api$paths$absNodeMod === void 0 ? '' : _api$paths$absNodeMod;
  const outputPath = absOutputPath;
  const themeTemp = (0, _slash().default)(_path().default.join(absNodeModulesPath, '.plugin-theme')); // 增加中间件

  api.addMiddewares(() => {
    return (0, _serveStatic().default)(themeTemp);
  }); // dev 配置

  api.onDevCompileDone(() => {
    api.logger.info('cache in :' + themeTemp);
    api.logger.info('💄  build theme'); // 建立相关的临时文件夹

    try {
      if ((0, _fs().existsSync)(themeTemp)) {
        _rimraf().default.sync(themeTemp);
      }

      if ((0, _fs().existsSync)((0, _slash().default)(_path().default.join(themeTemp, 'theme')))) {
        _rimraf().default.sync((0, _slash().default)(_path().default.join(themeTemp, 'theme')));
      }

      (0, _fs().mkdirSync)((0, _slash().default)(_path().default.join(themeTemp, 'theme')));
    } catch (error) {
      console.log(error);
    } // 读取 options 配置，根据配置生成对应资源


    options.theme.forEach(themeOpt => {
      const fileName = themeOpt.fileName,
            stylePath = themeOpt.stylePath;
      const antdLess = (0, _fs().readFileSync)(stylePath, 'utf-8');

      _less().default.render(antdLess, {}).then(out => {
        const css = _uglifycss().default.processString(out.css);

        (0, _fs().writeFileSync)(fileName, css);
      });
    });
  });
}