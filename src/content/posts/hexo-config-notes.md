---
title: Hexo配置随记
pubDate: 2018-04-01 11:40:05
tags:
    - 随记
    - Hexo
cover: /posts//accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---
![](/posts//hexo-banner.jpg)

> 你看起来不错，来做我的菜吧 ~

<!-- more -->

## 前置

一键搭建？不存在的!

查看本随记的时候，请先安装好了 [Node.js](https://nodejs.org/en/) 与 [Git](https://git-scm.com/)

`Hexo` 的全局安装

```bash
npm install -g hexo-cli
```
## 开始建站

### 本地建站

进入一个安全的目录，比如`F:/`，注意别在根目录 `/` 瞎搞，打开 `Git bash`，逐个输入指令，

```bash
hexo init <hexo_name> //本地创建 hexo 文件夹

cd <hexo_name> //指令进入所创建的 hexo 文件夹

npm install //下载 hexo 所需的依赖

hexo server //启动本地服务，
```

默认情况下，访问网址为：`http://localhost:4000/`这下可以大概看到自己的站点是个啥样了，开启第一篇文章之路，运行下一个指令，


```bash
hexo new [第一篇文章]
```

默认 `[第一篇文章].md` 文件会生成在 `<hexo_name>\source\_posts\` 路径下，`.md` 是一款使用 [Markdown语法](http://markdown.cn/) 的写作文件，[Markdown语法](http://markdown.cn/)了解一下？

更多文章指令，尽在[基本操作-写作](https://hexo.io/zh-cn/docs/writing.html)

### 基本配置

官方的 [配置文档](https://hexo.io/zh-cn/docs/configuration.html) 里面或许太过凌乱不堪，直接看文件 `_config.yml` 并开始配置一些建站需要的几个基本属性先，

参数 | 描述 | 备注
-- | -- | --
title | 网站标题 | 修改为自己的网站标题
subtitle | 网站副标题 |
description | 网站描述 | 简单加点描述 有利于SEO
author | 您的名字 |
language | 网站使用的语言 | zh-Hans（中文）
timezone | 网站时区 |

建站之后，就请去 官网了解一下 [建站文档](https://hexo.io/zh-cn/docs/setup.html)， 这里说的比已经很全面了


## 部署配置

一键建站是不太可能的，配置好之后一键部署上线还是可以的，这里我们关注的是 `Git` 上面的部署，其余部署配置，[部署文档](https://hexo.io/zh-cn/docs/deployment.html) 了解一下？ 顺便 `Github` 官方配置 [GitPage](https://pages.github.com/) 了解一下？

展开讲一下，首先先安装 `hexo-deployer-git`

```bash
npm install hexo-deployer-git --save
```

然后在 `GitHub` 上新建一个空 `repo`，名称为 「你的用户名.github.io」，接着找到配置文件 `_config.yml`,搜索关键字 `deploy` 配置如下


```json
deploy:
  type: git
  repo: <repository url> //库（Repository）地址 例：你的用户名.github.io
  branch: [branch] //分支名称 例：master
  message: [message] //自定义提交信息，默认是更新日期 可不填写
```

接下来运行指令，即可在 `你的用户名.github.io` 网址上看到你的 `bolg` 了

```bash
hexo generate
//生成静态文件，快捷指令：hexo g

hexo deploy
//部署上传文件，快捷指令：hexo d
```

大概就是`项目 -> setting -> GitHub Page -> 开启` 这样一个流程 ，就可以预览 `blog` 了

打开项目，打开 `Github page` 功能，[官方开启说明](https://pages.github.com/)

## 总结

其实大部分的而配置都是可以在官方的[文档](https://hexo.io/zh-cn)这边大概是一丢丢配置，以及常用指令的总结，后续看反馈，可以继续写一篇 [NexT](http://theme-next.iissnan.com/) 主题上面的配置，如果写不下，`本酱` 就直接在这里更吧~

好了，今年的 4月到了，1号完美的没有人跟`本酱`表白~

感谢阅读~

感谢[学姐大人](https://yufan.me/)很久以前（大概3年前）的推荐；

感谢[小心校长大人](http://www.liaoyunduo.com/)的[配置指导文章](http://www.liaoyunduo.com/2017/10/01/1/)；

感谢两位同学的催更，[天亮](#)，[凯荣](#)；
