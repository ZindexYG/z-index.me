---
title: 微信小程序实习记
pubDate: 2020-06-25 19:23:28
tags:
  - 小程序
  - CSS
  - Note
cover: /posts/MiniProgram.png
description: 看起来还算有趣
---

![](/posts/MiniProgram.png)

> 看起来还算有趣

<!-- more -->

### 关于图片

- 图片放大后，用户可以直接保存下载
- 参数是个数组，可以在放大后左右翻动
- 按钮下载功能，顺序是，先下载文件，然后缓存的图片调用 `saveImageToPhotoAlbum`

```javascript
Page({
  // 放大
  handleExpend: function () {
    wx.previewImage({
      urls:[url]
    })
  }，
  // 下载
  handleDownload: function () {
    wx.dowloadFile({
      url:url,
      success:res=>{
        if (res.statusCode ===200) {
          wx.showToast({
            title: '保存成功',
            icon: 'success',
            duration: 2000,
          })
          wx.saveImageToPhotoAlbum({
            filePath: res.tempFilePath
          })
        }
      },
      fail:err=>{
        wx.showToast({
          title: '保存失败',
          icon: 'fail',
          duration: 2000
        })
      },
    })
  },
})

```

### 关于分享

- 可以是关于小程序的分享
- 可以是关于具体功能页面的分享（带参数）
- 可以区分是自定义按钮的分享，或是右上角的分享

```javascript
Page({
  // 相关页面，有这个方法即调用了分享功能
  onShareAppMessage: function (res) {
    /*
    res：
      - from       转发事件来源。 button：页面内转发按钮；menu：右上角转发菜单
     */
    return {
      title: [String],
      path: [url?params],
      imageUrl?: [url] //不设置，会被程序自动截取当前页面
    }
  }
})
```

### 关于请求

- 一般的请求，开发者需要域名备案，和 https 请求， 关于一些个人开发这，这过程会略显麻烦
- 使用云开发环境，可以使用云函数来提供参数特殊的请求方式，绕过备案和 https 检测

过程

- 新建云函数
- 下载相关请求 npm 包（如 request && request-promise)
- 编写相关云函数 api
- 小程序中初始化云函数，调用相关云函数

```javascript
// 云函数 api
const request = require('request-promise');

export.main = async (event, context) => {
  return await request({
    method: event.method || 'GET',
    uri: event.uri,
    headers: event.headers || {},
    body: event.body
  }).then(body => {
    return body;
  }).catch(err => {
    return err
  })
}

// 小程序

// app 内初始化
App({
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({
        env:['相关云开发环境名称']
      })
    }
  }
})

// page 调用
[handleFunction]:()=>{
   wx.cloud.callFunction({
        name: ['相关云函数'],
        data: {
            // http域名 https域名 第三方域名 非验证域名 IP[:prot] 内网IP或花生壳域名
            uri:[url],
            headers: {
                'Content-Type':'application/json'
            },
            body:[params]
        }
    }).then(res => {
        console.log(res)
        const data = res.result
        console.log(data)
        // do something
    })
}

```

### 关于 IconFont

- 创建自定义组件
- [阿里图库](https://iconfont.cn)，需要的 Icon 放入自己的项目
- 下载，选中 css 文件内容复制到自定义组件内的 wxss 文件内

``<text class="iconfont icon-{{icon}}"></text>``

```javascript
Component({
  options: {
    styleIsolation: 'apply-shared' // 样式可被 page影响
  },
  properties: {
    icon: String
  }
})
```

### 小结

该项目属于一次个人的体验，也算是给自己接触小程序开发的一个契机，目前感觉还是很良好的

![](/posts//MiniProgram_Wallpaper.jpg)

欢迎各位关注一下我的小程序，没有复杂的功能，也不需要账号信息，希望得到大佬的指点一二

