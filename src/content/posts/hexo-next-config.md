---
title: Hexo配置随记之NexT配置
pubDate: 2018-04-09 22:31:24
tags:
    - 随记
    - Hexo
cover: /posts//accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/posts//NexT-banner.jpg)

> 你看起来很适合我，来喂饱我吧~

<!-- more -->

## 前置

已经搭建好的 `Hexo` 的平台，在本地可以用 `server` 打开的也算；

如果没有，请阅读[Hexo配置随记](http://t.cn/RnDaF00)，再执行以下指令；

```bash
hexo server
```

## 主题

[hexo主题](https://github.com/hexojs/hexo/wiki/Themes)，这里有所有的主题，任君选择，找好主题之后，从 `Github` 上面下载下来，本人使用的是 [NexT](https://github.com/iissnan/hexo-theme-next)

将主题，放入 `theme` 目录下，回到 `_config.yml` 文件，配置 `theme` 字段为 下载好的目录名称，

```bash
theme: hexo-theme-next
```

### 主题配置

这里依然更加建议去阅读 [NexT文档](https://theme-next.iissnan.com/)，本酱就直接说一下我的配置顺序好了；

这里要注意配置的路径，主题配置的路径为 `/theme/_config.yml`

#### 基本配置

参数 | 描述 | 备注
--| --| --|
favicon | 图标 | 配置一下以下属性的路径即可<br/>small<br/> medium<br/> apple_touch_icon<br/>  safari_pinned_tab
keywords | 关键词 | 有利于 SEO
footer | 页面底部属性 |
menu | 导航栏配置 | 一般根据喜好打开，或者关闭，不填写即关闭<br/>home:主页<br/>archives：归档<br/>tags：标签<br/>about：关于
menu_icons | 导航栏图标 | enable为 true 时候打开图标，根据属性名，配置图标元素
Schemes | 主题类型 | 可以在 server 下查看是否有你喜欢的类型
social | 社交账号 |
links | 友情链接 |
highlight_theme | 代码高亮模式 |

#### 统计配置

个人认为，能否促进一个人写 blog 数据是关键，所以这里说一下数据统计的配置，主要使用的 [腾讯分析](http://ta.qq.com/)

申请一个账号，QQ 账号即可，设置好站点之后，点击 `获取代码` 截取代码中 `sId` 字段后边的值，配置到 主题配置里面的 `tencent_analytics` 里即可

```bash
tencent_analytics： sId
```

#### 域名配置

在 `source/` 目录下，创建一个 `CNAME` 文件，里面只写一个自己购买的域名后保存好；

在自己域名管理器下，解析域名的时候，用 `CNAME` 方式重定向，指向自己的 `xxx.github.io` 去即可；

## 总结

`Hexo` 的配置文就到此结束了，有啥不懂，多看[NexT官方文档](https://theme-next.iissnan.com/) 和[Hexo官方文档](https://hexo.io/zh-cn/docs/configuration.html) 欢迎微博讨论 [噫酱从不言弃](http://t.cn/RmMh8rx)，

最后，感谢阅读。

感谢 [吴凯荣](#) 感谢 [亮亮](#)。
