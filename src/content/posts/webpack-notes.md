---
title: webpack学习笔记
date: 2017-12-21 22:22:59
tags:
    - webpack
    - JavaScript
    - node
cover: /images/accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/images/webpack-banner.jpg)

> 这是一份学习笔记，仅此记录一个学习过程

<!-- more -->

## 理解 WebPack

学习 WebPack 最好是从服务端的角度出发，或者说从 node 角度出发，到程序的角度，再到用户的角度；

反过来，一部分用户是不需要一些渲染的页面的，那么从服务端开始，编写用户需要的页面；

## package.json 文件

package.json 是一个 node 生成的目录文件，下面 vue-cli 生成的一个 package.json；

```javascript
{
  "name": "vue-test",
  "version": "1.0.0",
  "description": "A Vue.js project",
  "author": "yg_zinger",
  "private": true,
  "scripts": {
    //more
  },
  "dependencies": {
    "vue": "^2.5.2",
    "vue-router": "^3.0.1"
  },
  "devDependencies": {
    // more ...
    "url-loader": "^0.5.8",
    "vue-jest": "^1.0.2",
    "vue-loader": "^13.3.0",
    "vue-style-loader": "^3.0.1",
    "vue-template-compiler": "^2.5.2",
    "webpack": "^3.6.0",
    "webpack-bundle-analyzer": "^2.9.0",
    "webpack-dev-server": "^2.9.1",
    "webpack-merge": "^4.1.0"
  },
  "engines": {
    "node": ">= 4.0.0",
    "npm": ">= 3.0.0"
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
}

```

### 常见字段解析

字段 | 解析
-- | --
name | 项目名
version | 项目版本号，（大改，次改，小改）
author | 作者名字
script | 调用命令脚本，封装功能用
dependencies | 项目运行所需的依赖包
devDependencies | 项目开发所需的依赖包
engines | 制定包的运行环境
browserlist | 浏览器兼容性问题
config | 用于添加命令行的环境变量
private |设置为ture 表示不发布到 npm 平台下

## 主要配置

如果是个人配置，大可不必使用脚手架，以及前端框架，把 webpack 当作一个打包工具即可；

个人配置上面不需要太复杂，就拿一个 webpack.config.js 来看即可

```javascript
//导入所需的依赖
var FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var webpack = require('webpack')
var path = require("path")

//模块输出
module.exports = {
  // 入口， 可以是字符串，数组，对象
  entry: './src/mian.js',
  // 输出配置， 一般有 filenema=输出名字, path=输出地址, publicPath=输出公共资源的路径 字段
  output: {
    path: __dirname + '/dist',
    publicPath: '/static/',
    filename: 'build.js'
  },
  // 插件
  plugins: [
    new webpack.ProgressPlugin(),
    new FriendlyErrorsWebpackPlugin()
  ],
  // 模块处理
  module: {
    // 字段配置
    rules: [{
      //test = 正则匹配规则， use = 匹配对应 loader or 对象 options
      test: /\.vue$/,
      use: {
        loader: "vue-loader",
        options: {
          loaders: {
            css: ExtractTextPlugin.extract({
              use: 'css-loader'
            }),
            stylus: ExtractTextPlugin.extract({
              use: ["css-loader", "scss-loader"]
            })
          }
        }
      }
    }, {
      test: /\.css$/,
      use: ['vue-style-loader', 'css-loader', 'scss-loader']
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 10000,
          name: 'images/[name].[hash:7].[ext]' // 将图片都放入images文件夹下，[hash:7]防缓存
        }
      }]
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]' // 将字体放入fonts文件夹下
        }
      }]
    }, {
      test: /\.js$/,
      use: "babel-loader",
      include: [path.resolve(__dirname, 'src')]
    }]
  }
}
// 压缩 javascript 的插件
new webpack.optimize.UglifyJsPlugin()
// 抽离 css 到css 文件
new ExtractTextPlugin({
  filename: "css/style.css"
})
```

## plugins 常用插件

现在大部分插件都会在 webpack 上面集成好，所以 [webpack文档](https://doc.webpack-china.org/plugins/) 就很关键了，多看文档多成长;

下面介绍部分常用的，也是使用一些脚手架常见的插件，与个人理解；

### 对代码处理的插件

插件 | 用处
-- | --
BannerPlugin | 给代码添加版权信息
CommonsChunkPlugin | 用于共享抽离代码，整个项目的第三方；多个子 chunk 共用打包进入 父 chunk；Mainfest 每次打包都有变化
CompressionWebpackPlugin | 使用配置算法
DefinePlugin |允许在编译时(compile time)配置的全局常量
EnvionmetPlugin | 通过 DefinePlugin 来设置 process.env 环境变量的快捷方式
ProvidePlugin | 自动加载模块，不需要 import 或者 require
UglifyJsPlugin | 自动压缩 JS 代码(需要安装，不自带)

### 辅助打包后的代码

插件 | 用处
-- | --
HtmlWebpackPlugin | 自动依据 entry 的配置引入依赖（需要安装，不自带）
cleanWebpackPlugin | 每次打包，清空配置的文件夹，包名保持不一致 （需要安装，不自带）

## 辅助开发的相关属性

属性 | 用处
-- | --
devtool | 打包后的代码与原始代码不同，控制是否生成 & 如何生成
devServer | 打开本地服务器，需要配置
watch | 持续监听文件的更改，重新构建文件，开发时期使用
watchOptions | 定制 watch 模式
performance | 展示性能提示
stats | 配置打包过程输出的内容，值：none，norml，rerbese，errors-only

## 精细的相关属性配置

属性 | 用处
-- | --
content | 设置基础路径，默认当前
resolve | 确定某块如何被解析，有默认值，可自定义
target | 打包之后代码所执行的环境
extemals | 控制某个依赖，不打包，直接从用户环境获取

## 结语

基本上到这里了，这里大部分东西都在 [Webpack社区](https://doc.webpack-china.org/) 里可以查得到，习惯用了脚手架，会让突然出现的错误，措手不及，所以我们需要学习，和记录；

当然，最近出了个 [Parcel ](https://parceljs.org/)，貌似更好用...有机会试一下











