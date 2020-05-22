# umi-plugin-theme



## Install

```bash
# or yarn
$ npm install umi-plugin-theme -D
```


## Usage

Configure `theme.config.ts` in `config` dir.

eg.
```js
// theme.config.ts
export default {
  theme: [
    {
      stylePath: require.resolve('antd/lib/style/themes/dark.less'), // your theme file path.
      fileName: 'dark.css', // the generated css file name.
    }
  ]
}

```


## LICENSE

MIT
