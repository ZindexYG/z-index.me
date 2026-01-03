---
title: 愈发简单的 JS 库开发
pubDate: 2025-08-07 14:34:41
tags:
    - javascript
    - vite
    - rollup
cover: /posts//accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![banner](/posts//accessible-js-Library-Development.jpg)


> 是的，再不看书，书里的知识就过时了

<!-- more -->


### 关于目录

1. 实践
2. 礼仪
3. Q&A

### 关于实践

#### 古法初始化项目

话不多说，先来一波古法新建文件以及文件夹

```bash
# 新建项目 && 进入项目
mkdir js-lib-temp & cd js-lib-temp
# 初始化
npm init -y
# 新建文件
mkdir -p src && touch src/index.js
```

打开 src/index.js，写点简单的代码

```js
export default function () {
  console.log('hello world')
}
```

ok，咱的库只输出个 hello world，接下来就开始到处 say hi 呗


#### 古法打包配置初始化

目标是在三种模块规范 CommonJS、 ESModule、UMD 中正常使用，目前最为流行的就是通过 rollupjs 来打包

```bash
npm install --save-dev rollup

# 新建 config 文件夹，以及相关的配置文件
mkdir -p config

# 新建 UMD 配置
touch config/rollup.config.aio.js
# 新建 ESM 配置
touch config/rollup.config.esm.js
# 新建 commonjs 配置
touch config/rollup.config.js
# 新建整体配置
touch config/rollup.js

# 一行搞定，也不是不行
# mkdir -p config && touch config/rollup.config.aio.js config/rollup.config.esm.js config/rollup.config.js config/rollup.js
```

还需要下载一些插件 babel 与 rollup 相关的插件

```bash
# Babel 相关
# Babel 的核心库，负责将 ES6+ 代码转换为兼容旧环境的 JavaScript
npm install --save-dev @babel/core
# 优化 Babel 转译结果，减少重复的辅助代码，提升包体积和运行效率。
npm install --save-dev @babel/plugin-transform-runtime
# Babel 预设，自动根据目标环境转译最新的 JavaScript 语法
npm install --save-dev @babel/preset-env
# Babel 运行时依赖
# 配合 @babel/plugin-transform-runtime 使用，避免辅助函数重复
npm install --save-dev @babel/runtime


# rollup 相关
# 在 Rollup 打包时集成 Babel，支持源码转译。
npm install --save-dev @rollup/plugin-babel
# 让 Rollup 能处理 CommonJS 模块（如 npm 包），转换为 ES6 模块。
npm install --save-dev  @rollup/plugin-commonjs
# 让 Rollup 能解析 node_modules 里的第三方依赖。
npm install --save-dev  @rollup/plugin-node-resolve
```

#### 古法打包逻辑代码

```js
// config/rollup.js
const {
  babel,
} = require('@rollup/plugin-babel')
const pkg = require('../package.json')

const version = pkg.version
/**
 * 构建输出文件的头部注释信息
 * @type {string}
 */
let banner = `/*!
 * ${pkg.name} ${version}
 * Licensed under MIT
 */
`

/**
 * 获取 Babel 编译器插件配置
 * @param {object} [opt] - 可选参数（当前未使用）
 * @returns {import('@rollup/plugin-babel').BabelInputPlugin} Babel 插件实例
 */
function getCompiler(_opt) {
  return babel({
    babelrc: false, // 不读取外部 .babelrc 文件，使用此处配置
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: '> 0.5%, last 2 versions, not dead', // 浏览器兼容性目标
            node: 'current', // LTS or 版本号
          },
          modules: false, // 不转换模块类型
          loose: false, // 严格模式
        },
      ],
    ],
    plugins: [
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: 2, // 使用 core-js@2 polyfill
          // helpers: false,  // 注释掉，默认 helpers 为 true
          regenerator: false, // 不转换 generator
        },
      ],
    ],
    babelHelpers: 'runtime', // 使用 runtime helpers
    exclude: 'node_modules/**', // 排除 node_modules
  })
}

/**
 * 插件名称
 * @type {string}
 */
exports.name = 'js-lib-temp'

/**
 * 构建输出文件的头部注释信息
 * @type {string}
 */
exports.banner = banner

/**
 * 获取 Babel 编译器插件配置
 * @type {Function}
 */
exports.getCompiler = getCompiler

```


```js
// config/rollup.config.js
const common = require('./rollup.js')

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
    banner: common.banner,
  },
  plugins: [common.getCompiler()],
}
```

```js

// config/rollup.config.esm.js
const common = require('./rollup.js')

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/index.esm.js',
    format: 'es',
    banner: common.banner,
  },
  plugins: [common.getCompiler()],
}

```

```js
// config/rollup.config.aio.js
const commonjs = require('@rollup/plugin-commonjs')
const nodeResolve = require('@rollup/plugin-node-resolve')

const common = require("./rollup.js")

module.exports = {
  input: 'src/index.js',
  output: {
    file: 'dist/index.aio.js',
    format: 'umd',
    name: common.name,
    banner: common.banner,
  },
  plugins: [
    nodeResolve({
      main: true,
      extensions: ['.js'],
    }),
    commonjs({
      include: 'node_modules/**',
    }),
    common.getCompiler(),
  ],
}
```


#### 修改 package.json 相关内容

- main：CommonJS 规范的入口文件
- module：ES Module 规范的入口文件，

```json
{
  "main": "dist/index.js", // 指定 CommonJS 规范的入口文件
  "module": "dist/index.esm.js", // 指定 ES Module 规范的入口文件
  "scripts": {
    "build:self": "rollup -c config/rollup.config.js",
    "build:esm": "rollup -c config/rollup.config.esm.js",
    "build:aio": "rollup -c config/rollup.config.aio.js",
    "build": "npm run build:self && npm run build:esm && npm run build:aio",
  }
}
```

运行 `npm run build` 后，即可在 CommonJS、ESModule、UMD 三个环境中运行了，调用示例：


#### 关于调用

##### CommonJS (Node.js 环境)
```js
// test-cjs.js
const sayHi = require('./dist/index.js');
sayHi(); // 输出: hello world
```

##### ESModule (现代打包工具或浏览器支持 ESModule)
```js
// test-esm.mjs
import sayHi from './dist/index.esm.js';
sayHi(); // 输出: hello world
```

##### UMD (浏览器全局引用)

```html
<script src="./dist/index.aio.js"></script>
<script>
  // 假设 package.json 的 name 字段为 js-lib-temp
  jsLibTemp(); // 输出: hello world
</script>
```


### 关于礼仪

#### 完善对应的目录与注释部份

```bash
├── README.md               # 项目说明文档
├── TODO.md                 # 待办事项记录（可选
├── CHANGELOG.md            # 变更日志（可选
├── config                   # Rollup 配置文件夹
│   ├── rollup.config.aio.js   # UMD 打包配置（适用于浏览器全局引用）
│   ├── rollup.config.esm.js   # ES Module 打包配置（适用于现代打包工具）
│   ├── rollup.config.js       # CommonJS 打包配置（适用于 Node.js）
│   └── rollup.js              # 公共 Rollup 配置与工具函数
├── dist                    # 打包输出目录
│   ├── index.aio.js            # UMD 格式输出文件
│   ├── index.esm.js            # ES Module 格式输出文件
│   └── index.js                # CommonJS 格式输出文件
├── package.json            # 项目依赖与配置信息
└── src                     # 源码目录
    └── index.js                # 主入口文件
```

##### README通常包含以下内容：

1. **库介绍**：简要说明库的功能、解决的问题和适用场景，帮助用户快速了解项目价值。
2. **使用指南**：提供安装、引入、调用等基础用法示例，让用户能快速上手。
3. **贡献指南**：说明如何参与贡献，包括代码规范、提 issue、提 PR 的流程，鼓励社区参与。


#### 关于开源协议

选择合适的开源协议对于 JS 库的传播和社区贡献非常重要。常见的协议有 MIT、BSD、Apache 等，不同协议在专利授权、商标使用、责任承担等方面略有差异。下表对比了三种主流协议的常见权利：

|              | MIT | BSD | Apache |
| ------------ | --- | --- | ------ |
| 商业用途     | [x] | [x] | [x]    |
| 可以修改     | [x] | [x] | [x]    |
| 可以分发     | [x] | [x] | [x]    |
| 授予专利许可 |     |     | [x]    |
| 私人使用     | [x] | [x] | [x]    |
| 商标使用     |     |     | [ ]    |
| 承担责任     | [ ] | [ ] | [ ]    |

一般来说，MIT 协议最为宽松，适合大多数 JS 库项目。


### Q&A

#### Q：Vite 与 Rollup 的关系、分别在什么场景下使用

A：Vite 和 Rollup 都是现代前端构建工具。Rollup 专注于库/包的打包，支持多种模块格式（如 CJS、ESM、UMD），适合开发 npm 包和 JS 库。Vite 则是基于 Rollup 的开发服务器和构建工具，主打开发体验（如热更新、极速冷启动），适合开发应用（如 SPA、组件库 demo），但底层生产构建依然用 Rollup。简单来说，开发库用 Rollup，开发应用用 Vite。

#### Q：为什么要分别输出 CJS、ESM、UMD 三种格式？

A：不同的使用场景和工具链对模块格式有不同要求。CJS 主要用于 Node.js 环境，ESM 适合现代打包工具和浏览器原生支持，UMD 兼容性最好，适合直接在浏览器通过 script 标签引入。三种格式都输出，能让你的库被更多场景和用户使用。

#### Q：如何让库支持 TypeScript？

A：可以在 src 目录下使用 TypeScript（如 src/index.ts），并安装相关依赖（typescript、@rollup/plugin-typescript 等）。Rollup 配置中引入 typescript 插件即可。建议同时生成类型声明文件（.d.ts），方便 TypeScript 用户使用。


#### Q：如何保证库的体积最小？

A：可以通过合理配置 Babel（如只引入需要的 polyfill）、使用 Rollup 的 tree-shaking、external 配置排除外部依赖、压缩输出（如使用 terser 插件）等方式减小包体积。


### 总结

`感谢阅读`

本文属于是阅读完《现代 JS 库开发：原理、技术与实践》的读后感
