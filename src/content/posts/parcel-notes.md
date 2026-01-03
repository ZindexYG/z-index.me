---
title: parcel 游记
pubDate: 2018-01-09 23:57:59
tags:
    - 打包工具
    - ES6
    - jQuery
cover: /posts//accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/posts//parcel-banner.jpg)

> 本文是记录着两天使用 parcel 的情况，以及遇到的坑（犯过的傻...

<!-- more -->

### 前言

[parcel](https://parceljs.org/)，一款适合小型到中型规模项目（代码行小于 15k）的打包工具；

### 分析项目

分析一下：本人的项目内需要的东西不多；

- babel(用于写 ES6)
- SCSS(用于快速的写 css)
- normalize.css(清除浏览器自带样式的 css)

### 开始配置

#### 全局下载 parcel

```bash
npm install -g parcel-bundler
```

#### 创建项目

```
mkdir parcel_demo
cd parcel_demo
npm init -y
```

#### 下载与配置所需依赖

`babel-preset-env` 用于转换 es6 语法；

```bash
npm install --save-dev babel-preset-env
echo {"presets": ["env"]} > .babelrc
```

`node-sass` 用于转换 scss 语法；

```bash
npm install --save-dev node-sass
```

`PostCSS` 使用插件转换 CSS 的工具，``.postcssrc`` 文件里面的 `modules` 设置为 `false` 的话，打包出来的 css 就不会带 hash 值；

```bash
npm install --save-dev postcss-modules autoprefixer
echo {"modules": true,"plugins": {"autoprefixer": {"grid": true}}}>.postcssrc
```

`PostHTML` 通过插件转换 HTML 的工具

```bash
npm install --save-de posthtml-img-autosize
echo {"plugins": {"posthtml-img-autosize": {"root": "./posts/"}}}>.posthtmlrc
```

#### npm 指令配置

打开项目里面的 ``package.json`` 文件，找到 `scripts` 这个字段，配置如下；

```json
//...
{
  "scripts":{
    "start": "parcel index.html",
    "build": "parcel build index.html -d build --public-url ./ "
  }
}
//...
```

`start` 指令 HMR 的配置指令 这个指令不需要任何附带操作，也不需要关系文件之间的路径，打开 `http://localhost:1234` 即可

```bash
parcel index.html
```

`build` 指令是打包指令 后面
- `-d` 后面跟着的是指打包后存储到那个文件，若没有此文件夹，会自动生成，
- `--public-url` 后面跟着的是所有 `js` `css`打包后的路径是什么，本人配置 `./`，表示跟打包后的 `index.html` 同一级目录

### 总结

本人项目正在进行中，如若遇到什么坑，会后续更新，感谢阅读~
