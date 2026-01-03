---
title: Hexo DIY 有感
pubDate: 2020-05-09 11:14:15
tags:
  - 随记
  - Hexo
  - EJS
cover: /posts//accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/posts//hexo-banner.jpg)

> 开启，新世界的旅程 ~

<!-- more -->

### 前景

> 愿景：自己的 blog ，很是希望阅读舒服的地方

需求：

1. 设计简单，方便阅读
2. [hexo-theme](https://hexo.io/themes/) 上似乎都没达到自己起期待
3. 懒设计，观察到 [贾老大的博客](https://blog.jiasm.org/) 开启魔改

### 知识前景

- 大概熟悉 `EJS`
- 大概熟悉 `yml`
- 大概熟悉 `styl`

相关文档

- [hexo 变量](https://hexo.io/zh-cn/docs/variables)
- [hexo 辅助函数](https://hexo.io/zh-cn/docs/helpers)
- [ejs 文档](https://ejs.bootcss.com/)

### 主题基本结构

theme 的文件结构，观察其他主题也差不多是这样，可自行新建

```bash
/theme
  |-- layout/                     // 布局
  |     |-- _partial/             // 局部文件
  |     |      |-- footer.ejs
  |     |      |-- head.ejs
  |     |      |-- header.ejs
  |     |-- index.ejs             // 主界面
  |     |-- layout.ejs            // 布局相关
  |     |-- links.ejs             // 友情链接
  |     |-- post.ejs              // post 相关
  |-- source/                     // 资源文件
  |     ｜-- css/
  |     ｜-- fonts/
  |     ｜-- images/
  |-- _config.yml
  |-- .gitgnore
  |-- LICENSE
  |-- package.json
  |-- README.md
```

### 遇到问题

1. `hexo` 版本问题，辅助函数方法有改变

``paginator`` 在 `V3.x` 与 `V4.x` 的区别 会导致 ``hexo server`` 启动不成功

```javascript
paginator({
  prev_text: '<div class="paginator-item"><i class="fa fa-angle-left"></i></div>',
  next_text: '<div class="paginator-item"><i class="fa fa-angle-right"></i></div>',
  escape:false // V4 新增, 默认 true ，不渲染 html 标记
})
```

2. 大佬也忙，`layout` 上存在 `fixed` 问题

修改 ``/theme/layout/layout.ejs`` 路径下

```html
<!-- 修改前面 -->
<body class='fixed'>

<!-- 修改后 -->
<body>
```

PS：该问题在 文章数量大于或等于 8 的时候，不会出现，仅有在小于或等于 6 的时候会出现

3. `post` 界面上导航，当页面标题过多，会有显示问题

暂时没太多的想法，没修改

仅帮助修改成了可在 ``_config.yml`` 配置 ``left | right``

4. 启动时候会产生 ``theme.menu`` 丢失问题

原因：大佬把 ``menu`` 配置写在全局 ``config`` 上了

解决：现将配置后退只 主题 ``_config.yml``

5. ``favicon`` 无配置项目

已经新增入主题配置内 _config.yml，相关页面也写好配置

```html
<!-- theme/layout/_partial/head.esj -->
<% if (theme.favicon.small) { %>
<link rel="icon" type="image/png" sizes="16x16" href="<%- url_for(theme.favicon.small) %> " />
<% } %>
<% if(theme.favicon.medium) { %>
<link rel="icon" type="image/png" sizes="32x32" href="<%- url_for(theme.favicon.small) %> " />
<% } %>
<% if (theme.favicon.apple_touch_icon) { %>
<link rel="apple-touch-icon" sizes="180x180" href="<%- url_for(theme.favicon.apple_touch_icon) %>">
<% } %>

```

6. 友链页面无法展示

原因，友链为使用 hexo 新建页面，友情链接内容为资源页面内容

解决：
- 新建 ``_data/links.yml``
- 新建 ``links/index`` (可使用 `` hexo new page --path about/me "About me" ``)

``_data/links.yml``

```yml
XXX:
  link: https://xx.com/     # 地址
  avatar: https://xxx.jpg   # 头像
```

``links/index``

```markdown
---
layout: links
title: links
date: 2018-05-06 08:08:12
tags:
---
```

### 总结

- 了解了一点 ``ejs``
- 了解了一点 ``hexo``
- 了解了一点 ``yml``

个人感觉 ``hexo`` 功能在写的方面还算满足个人需求了，主题与阅读上还存在很多问题，但并不是每个需求问题都能有官方的解决方案，其他人的解决方案也并不一定能完全满足，自己花时间为自己所喜爱的事情学习一下了

大佬也是普通人，有生活与工作，第一次提了 PR 有点害羞

感谢 [@贾顺名](https://blog.jiasm.org/) 指导并不嫌弃小弟叨扰

> 感谢阅读
