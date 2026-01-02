---
title: 愈发熟练的 CSS 技巧
pubDate: 2018-05-26 23:56:26
comments: true
tags:
    - CSS
    - Post_css
    - layout
cover: /images/accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/images/CSS-Evolution-banner.jpg)

> 这技巧，为何你会那么熟练 ？

<!-- more -->

## rem + simple-flexible 适配方案

### 简单解析

`rem` 相对于根元素 `<html>` 的 `font-size` 的大小来计算坐作为一个单位；

`simple-flexible` 是根据手淘团队 `lib-flexible.js`，比较，改写的一个插件，兼容 UC 竖屏转横屏出现的 BUG，自定义视觉设计稿的宽度：designWidth，设定最大宽度：maxWidth

这里有 [simple-flexible](https://github.com/kujian/simple-flexible) 的 `Github` 地址，下载下来用即可;

- 第一个参数是视觉设计稿的宽度，一般视觉设计稿有 750px，可以根据实际调整
- 第二个参数则是设置制作稿的最大宽度，超过 750px，则以 750px 为最大限制；
- 使用时候的换算比例，是 1：100， 即 1rem = 100px；

### 使用步骤

1. 复制上面这段代码到页面的 `<head>` 的 `<script>` 标签里面；

2. 然后视觉设计稿大小，调整里面的最后两个参数值；

3. 根据设计像素，使用 `rem` 单位转换的视觉设计稿里面的 `px` 单位，例： 750px = 7.5rem；

### 优劣

简单实用，基本上没有什么劣势，在 [IIS](https://github.com/kujian/simple-flexible/issues/4)上也已经对最新的 IPheonX 做出了适配方案，建议使用

## rem + lib-flexible 适配方案

### 简单解析

`lib-flexible.js` 是手淘团队制作的一个 Js 插件，实际上就是能过 JS 来动态改写 `<meta>` 标签；

`lib-flexible.js` 基本原理是模拟 `vw` 把视觉稿分为 100份，以单位 a 来说，1rem = 10a;


以视觉稿 750px 为例子

```shell
1a = 7.5px， 1rem = 75px
```
### 使用步骤

可以根据上面的步骤，外部引入 CDN 也可以

```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
<script src="./node_modules/amfe-flexible/index.js"></script>
```

也可以使用模块化方式

Npm:
```shell
npm i -S amfe-flexible
```

JS:
```javascript
import 'amfe-flexible'

/*
do something
*/
```

### 优劣

在 UC 浏览器上发现了，横批竖屏转换不过来的情况，已经找到兼容方案，是通过js在页面的 `<head>` 里生成定义了 `<html>` 元素 `font-size` 的 `style` 元素来解决！

```javascript
<style id="rootFontSize">html{font-size: 100px !important;}</style>
```

而且官方也说明这个是 `vw` 的过度方案，不建议长期使用；

## PostCSS + VW 适配方案

### 简单解析

`PostCSS` 将 `CSS` 变成 `JavaScript` 的数据，使它变成可操作;

`VW` 是基于 Viewpost 视窗的长度单位;

`Viewpost` 是指浏览器可视化的区域，而可视化区域即是 `window.innerWidth/window.innerHeight` 的大小;

与 `Viewpost` 相关的单位有以下四个

- `vw` : 是 Viewport width 的简写 1vw = window.innerWidth的 1%；
- `vh` : 是 Viewport height 的简写 1vw = window.innerHeight 1%；
- `vmin` : vw 和 vh 之间的较小值
- `vmax` : vw 和 vh 之间的较大值

### 使用步骤

假设视觉设计稿的宽度是 750px 即 1vw = 7.5px，那么就得根据设计图的 px 值来转换 vw单位，为了避免这样的计算，当然就需要使用到 `PostCSS` ，以及 `postcss-px-to-viewport` 一个 `PostCSS` 的插件

本方案使用打包工具构建项目的时候使用是最酸爽的，建议在以下环境下尝试；

- [parceljs](https://parceljs.org/)
- [webpack](https://webpack.docschina.org/)

有过使用前端脚手架的童鞋，应该都有看到过项目根目录下面都会有一个 `.postcssrc` 文件，它里面都是一些配置选项比较著名的 `autoprefixer`，`cssnano`，`px2rem`，`cssnext`...等等好玩的配置插件，但是这里不作这些说明，只介绍 `postcss-px-to-viewport` 配合 vw 使用

Npm：
```shell
npm i -S postcss-px-to-viewport
```

打开 `.postcssrc`，假定视觉设计稿的宽度为 750px 改写配置如下：
```javascript
//...
"plugins": {
  "postcss-px-to-viewport": true
},
"rule": {
  "postcss-px-to-viewport": {
    "viewportWidth": 750,
    "viewportHeight": 1334,
    "unitPrecision": 5,
    "viewportUnit": "vw",
    "selectorBlackList": [],
    "minPixelValue": 1,
    "mediaQuery": false
  }
}
//...
```
配置完成之后，在项目中直接使用 px ，构建的时候就会自动转换为 vw 单位了，简直不要太爽了；


`postcss-px-to-viewport` 配置项说明

```javascript
"viewportWidth"        //设置视觉设计稿的宽度
"viewportHeight"       //设置视觉设计稿的高度
"unitPrecision":       //单位的精度，即保留多少位小数
"viewportUnit":        //转换的单位
"selectorBlackList":   //需要忽略的选择器
"minPixelValue":       //最小像素值
"mediaQuery":          //是否允许媒体查询转换为 px
```
### 优劣

vw 的兼容性貌似还没那么好，有可能需要做降级处理，需要使用到 CSS Houdini 和 CSS Polyfill 上一些针对 vw 单位做一个降级处理；

vw 在混合使用到 margin 的 px 时候 有可能超出 100vw ，目前使用 padding 来代替 marging 再配置上 box-sizing 可以解决，亦可以使用 css 的 calc() 函数来做一个计算；

转换的时候多少还存在一点像素差，无法完全还原；


## 附加 rem 也不需要计算的装置

在 sublime 上面，有一个插件 [cssrem](https://github.com/flashlizi/cssrem) 可以让放手写 px 然后 sublime 自动转换成 rem ，简直可能爱上了 css，

配置说明如下：
```javascript
px_to_rem                   // px转rem的单位比例，默认为40，基本定义是视觉设计稿的宽度/10；
max_rem_fraction_length     // px转rem的小数部分的最大长度，默认为6；
available_file_types        // 启用此插件的文件类型。默认为：[".css", ".less", ".sass"]；
```

## 总结

这里总结的三种适配方案本人都有在用，如果说用得最多的应该是第一种了，因为发现的时间比较早，所以用的自然也比较多了；

当然，还有很多本人未知的方案，但是所有的适配方案都是为了完美的还原视觉设计稿，完美解决兼容性问题，当然这都是理想状态；

感谢 [@白白](https://github.com/ZhangPuXi) 的帮忙(名词解析) + 鼓励(催稿)

感谢 [@w3cplus](https://www.w3cplus.com/)，[@前端开发博客](http://caibaojian.com/)，

感谢两位的四篇文章，给我带来的启发

- [再聊移动端页面的适配](https://www.w3cplus.com/css/vw-for-layout.html)
- [使用Flexible实现手淘H5页面的终端适配](https://www.w3cplus.com/mobile/lib-flexible-for-html5-layout.html)
- [rem自适应布局](http://caibaojian.com/flexible-js.html)
- [rem自适应js](http://caibaojian.com/simple-flexible.html)
