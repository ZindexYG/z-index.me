---
title: Ajax 基础知识
pubDate: 2018-04-23 21:38:29
tags:
    - javascript
    - ajax
    - ES6
cover: /posts//accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/posts//ajax-banner.jpg)

>代码一把梭,快来人教我做菜吧

<!-- more -->

## Ajax

`ajax` 直接看一个老版本例子

```javascript

var xmlHttp = null

// 老版本的 IE5 和 IE6 使用 ActiveX 对象
if (window.XMLHttpRequest) {
  xmlHttp = new XMLHttpRequest();
} else {
  xmlHttp = new ActiveObject('Microsoft.XMLHTTP');
}

/*
 一个请求过程
 xmlHttp
    responseType //设定数据返回类型
    open(module,url,async) //module == get && post url == 链接 saync==true && false 是否异步
    setRequestHeader() // 设定发送请求的头部
    send() //发送请求
*/

xmlHttp.responseType = 'JSON';
xmlHttp.open('GET', 'https://www.apiopen.top/satinApi', 'true');
xmlHttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xmlHttp.send();

/*
 onreadystatechange：只要 readyState 属性发生变化，就会调用相应的处理函数，一般用于获取返回的数据
*/
xmlHttp.onreadystatechange = function () {
  if(xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === 200) {
    console.log(xmlHttp.responseText)
  }
}
```

### 解读步骤

使用 `ajax` 发送链接，不外乎几个步骤；

1. 创建 `XMLHttpRequest` 对象；
2. 配置发送请求的模式 `get` or `post`，以及请求链接，是否异步，返回数据格式
3. 使用 `XMLHttpRequest` 对象 `open()` 方法，根据配置发送请求
4. 使用 `XMLHttpRequest` 对象 `responseType` 属性，设定返回数据类型
5. 根据 `XMLHttpRequest` 对象 `onreadystatechange` 事件监听 `readyState` 属性变化，获取 `responseText` 返回数据；

### 注意事项

1. 当设定为同步请求的时候，请求会等到服务器响应就绪才继续执行。如果服务器繁忙或缓慢，应用程序会挂起或停止，这时候就不需要使用 `onreadystatechange` 函数 ,直接获取`responseText`即可
2. 当设定为 `post` 请求的时候，`send()` 可以传入参数，例：

```javascript

//...

xmlHttp.responseType = dataType;
xmlHttp.open('POST', url, aysnc);
xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlHttp.send(parems);

xmlHttp.onreadystatechange = function () {
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    callback(xmlHttp.response);
  }
}
```

## Jsonp

### 简单实现

```javascript
function jsonp(req){
  var script = document.createElement('script');
  var url = req.url + '?callback=' + req.callback.name;
  script.src = url;
  document.getElementsByTagName('head')[0].appendChild(script);
}
```

### 原理解读

利用 `<script>` 标签的 `src` 属性来实现 `get` 请求；

### 为什么会有 Jsonp

[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy) 大概了解一下？

1. 协议，端口（如果有指定）和域名都相同，则具有相同的源，页面可以直接通过请求，获得数据；
2. 突破协议请求，即是说所的跨域；
3. 通过 `jsonp` 技巧获取的数据已经不是 `json`，而是 `JS` 类型的数据（大部分是对象），所以 `jsonp` 只有 `get` 请求，没有 `post`；

### jsonp的最优方案

```javascript
(function (global) {
  var id = 0,
      container = document.getElementsByTagName("head")[0];

function jsonp(options) {
    if(!options || !options.url) return;

    var scriptNode = document.createElement("script"),
        data = options.data || {},
        url = options.url,
        callback = options.callback,
        fnName = "jsonp" + id++;

    // 添加回调函数
    data["callback"] = fnName;

    // 拼接url
    var params = [];
    for (var key in data) {
        params.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
    }
    url = url.indexOf("?") > 0 ? (url + "&") : (url + "?");
    url += params.join("&");
    scriptNode.src = url;

    // 传递的是一个匿名的回调函数，要执行的话，暴露为一个全局方法
    global[fnName] = function (ret) {
        callback && callback(ret);
        container.removeChild(scriptNode);
        delete global[fnName];
    }

    // 出错处理
    scriptNode.onerror = function () {
        callback && callback({error:"error"});
        container.removeChild(scriptNode);
        global[fnName] && delete global[fnName];
    }

    scriptNode.type = "text/javascript";
    container.appendChild(scriptNode)
  }

  global.jsonp = jsonp;

})(this);
/*
  使用示例
 */
jsonp({
  url : "www.example.com",
  data : {id : 1},
  callback : function (res) {
    console.log(res);
  }
});
```

## 目前所知发起请求的方式

1. 用 `form` 标签发起 `get` 和 `post` 请求，会刷新页面或跳转页面;
2. 用 `a` 标签只能发起 `get` 请求,会刷新当前页面或跳转页面;
3. 用 `link` 标签只能发起 `get` 请求,无法访问服务器的响应文本,只能以 `CSS`、`favicon` 的形式展示;
4. 用 `img` 标签只能发起 `get` 请求，跨域请求技术的一种,无法访问服务器的响应文本,只能以图片的形式展示,只能用于浏览器与服务器间的单向通信;
5. 用 `script` 标签只能发起 `get` 请求，只能以脚本的形式执行(jsonp的原理);
6. 使用 `Ajax` 发送异步或者同步请求;

## 总结

本文上面的方法都是很直白的，没有任何封装成分，之所以直接上代码，是因为不太想啰嗦了，不懂得欢迎前来质询；

[这里](https://github.com/ZindexYG/learn/blob/master/js_ajax_demo/script/get_ajax_module.js)有封装过的装逼代码，但是没有用到设计模式成分，所以依然是很 low 哒，欢迎指出错误并讨论更优方案；

感谢校长的[文章](http://www.liaoyunduo.com/2018/01/20/22/)启发；

感谢阅读；
