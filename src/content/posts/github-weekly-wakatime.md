---
title: Github-Weekly-WakaTime
pubDate: 2020-05-14 23:18:12
tags:
    - gist
    - wakatime
cover: /posts/github-week-wakatime-banner.jpg
description: 今天，你摸鱼了吗？
---

![](/posts/github-week-wakatime-banner.png)

> 今天，你摸鱼了吗？

<!-- more -->

### 期望

想要自己的 ``Github -> Overview`` 上出现好看的 ``Weekly development breakdown``

![](/posts//github-week-wakatime-dg.png)


### 预备

- 一点点科学知识，方便进入 ``Github - gist`` 功能
- 一点点 node 知识
- 一点点 yml
- 最好已使用 [WakaTime](https://wakatime.com/)

### 步骤

> 以下步骤，均为烂翻译提供，并带有部分自定义设置，具体详情请移步至[官网](https://github.com/matchai/waka-box)

准备

1. 创建一个 [Github-Gist](https://gist.github.com/) ，标题与内容可随意，成功运行后会被修改，保存 ``Gist-url`` 上一串 ``key``，如：`https://gist.github.com/matchai/6d5f84419863089a167387da62dd7081` 中 ``6d5f84419863089a167387da62dd7081``
2. 创建带有 ``gist`` 功能 ``Github Token`` 并保存下来 [Token](https://github.com/settings/tokens/new)
3. 登入 ``WakaTime`` 页面，没有账号的，请[自行创建](https://wakatime.com/signup)
4. 进入 ``WakaTime`` [配置页面](https://wakatime.com/settings/profile)，勾选 ``Display coding activity publicly`` 与 ``Display languages, editors, operating systems publicly``
5. 查看 ``WakaTime`` 账号 [api-key](https://wakatime.com/settings/api-key)，并保存好

项目设置

1. ``fork`` 项目 - https://github.com/matchai/waka-box
2. 在 ``fork`` 项目下 ``Settings > Secrets``，新增 ``GH_TOKEN`` 与 ``WAKATIME_API_KEY``，Value 分别对应上面生成的 ``Github Token`` 与 ``WakaTime api-key``
3. 打开 ``.github/workflows/schedule.yml`` 文件，修改 ``GIST_ID``：自己的``gist - url``

### 建议与部分自定义

> 在 ``Github -> Overview`` 上显示内容不全的问题，导致[某大佬](https://blog.jiasm.org/)不爽，改了一把，后续本人一发不可收拾了

预备
- clone 下自己的项目到本地
- VScode + [Run Code 插件](https://marketplace.visualstudio.com/items?itemName=formulahendry.code-runner)
- ``Gist-url-key``， ``Github Token``，``WakaTime-api-key``三个密钥

修改 ``.github/workflows/schedule.yml`` 线上调试，与指向自己项目
```yml
name: Update gist with WakaTime stats
on:
  schedule:
    - cron: "0 0 * * *"      # 可修改 "*/10 * * * *" 每10分钟 action，方便调试
jobs:
  update-gist:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@master
      - name: Update gist
        uses: ZindexYG/waka-box@master  # 原 matchai/waka-box，修改成自己的
        env:
          GH_TOKEN: ${{ secrets.GH_TOKEN }}
          GIST_ID: 38913796d6d4f3f471baa354fdaf2aeb
          WAKATIME_API_KEY: ${{ secrets.WAKATIME_API_KEY }}
```


自定义输出格式，与调试<br>
调试前记得 ``npm install``<br>
打开``./index.js`` 文件
```javascript
// line - 5 为方便调试用，不可提交入
const {
  GIST_ID: gistId = 'Gist-url-key',
  GH_TOKEN: githubToken = 'Github Token',
  WAKATIME_API_KEY: wakatimeApiKey = 'WakaTime-api-key'
} = {};
/* ... */

async function updateGist(stats) {
  /* ... */
  // line - 28
  const lines = [];
  for (let i = 0; i < Math.min(stats.data.languages.length, 5); i++) {
    const data = stats.data.languages[i];
    const { name, percent, text: time } = data;
    // 内容格式
    const line = [
      name.padEnd(11),
      time
        .replace(/hrs/g, "h")
        .replace(/mins/g, "m")
        .padEnd(9),
      generateBarChart(percent, 16),
      String(percent.toFixed(1)).padStart(5) + "%"
    ];

    lines.push(line.join(" "));
  }
  // 记得全局科学，输出内容样式 console.log(lines);
}
```
- 直接点击 ``run code`` 即可调试，若不打印内容，则无内容输出
- 各项修改完成，记得 ``npm run build``
- 提交记得连带 ``dist/index.js`` 一并提交

### 感谢

> 感谢阅读，基本是为了好玩，耍的一点小把戏

- 感谢[雨雨](https://rainylog.com/)
- 感谢[老贾](https://blog.jiasm.org/)

相关项目
- https://github.com/matchai/waka-box



