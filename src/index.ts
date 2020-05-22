// ref:
// - https://umijs.org/plugins/api
import { IApi } from '@umijs/types';
import winPath from 'slash2';
import serveStatic from 'serve-static';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import path from 'path';
import rimraf from 'rimraf';
import less from 'less';
import defaultTheme from './defaultTheme';
import uglifycss from 'uglifycss';

interface ThemeConfig {
  theme?: string;
  stylePath: string;
  fileName: string;
  key?: string;
  modifyVars?: { [key: string]: string };
}

export default function (api: IApi) {
  api.logger.info('use plugin');

  let options: {
    theme: ThemeConfig[];
  } = defaultTheme;
  // 获取主题 json 配置文件
  const themeConfigPath = winPath(path.join(api.paths.cwd || '', 'config/theme.config.ts'));

  if (existsSync(themeConfigPath)) {
    options = require(themeConfigPath);
  }

  const { cwd, absOutputPath, absNodeModulesPath = '' } = api.paths;
  const outputPath = absOutputPath;
  const themeTemp = winPath(path.join(absNodeModulesPath, '.plugin-theme'));
  // 增加中间件
  api.addMiddewares(() => {
    return serveStatic(themeTemp);
  });

  // dev 配置
  api.onDevCompileDone(() => {
    api.logger.info('cache in :' + themeTemp);
    api.logger.info('💄  build theme');
    // 建立相关的临时文件夹
    try {
      if (existsSync(themeTemp)) {
        rimraf.sync(themeTemp);
      }
      if (existsSync(winPath(path.join(themeTemp, 'theme')))) {
        rimraf.sync(winPath(path.join(themeTemp, 'theme')));
      }
      mkdirSync(themeTemp);
      mkdirSync(winPath(path.join(themeTemp, 'theme')));
    } catch (error) {
      console.log(error);
    }
    const antdPath = require.resolve('antd');
    const darkPath = path.join(antdPath, '../../dist/antd.dark.min.css');

    writeFileSync(`${themeTemp}/theme/dark.css`, readFileSync(darkPath).toString());
  })
}