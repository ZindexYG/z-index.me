---
title: WebSocket + React 的简单 Demo
date: 2020-11-05 21:49:32
tags:
    - react
    - websocket
    - node
cover: /images/accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/images/newWebSocket.png)

> 或许别人也有，这里也不见得更好

<!-- more -->

### 关于需求

> 简单接受服务端信息的功能

`前端需求分析`

- 可接受服务端信息
- 可关闭会话
- 可重启会话

`知识需求`

- 一点点 TS + React
- 一点点 node +express
- 一点点 websocket

### 关于最简 demo

- 前端仅实现 `启动 WebSocket` 与 `接受会话` 为关键
- 服务端 node 会实现计时器里实现不断发送信息的任务

```Typescript
import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';

const App = () => {
  const ws = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState('');
  //启动
  useLayoutEffect(() => {
    ws.current = new WebSocket('ws://localhost:7070');
    ws.current.onmessage = e => {
      setMessage(e.data);
    };
    return () => {
      ws.current?.close();
    };
  }, [ws]);


  return (
    <div className='App'>
      <div className='container'>
          {message}
      </div>
    </div>
  );
};
```

### 关于主动会话与主动开关机制

熟悉一下 相关方法

- WebSocket.send() 发送会话
- WebSocket.close() 关闭会话
- WebSocket.onmessage() 接受会话

在例子里，组件渲染的时候已经开始了 WebSocket 链接，根据需求是要主动开启 WebSocket 链接的，例子关键 WebSocket 需要提取出来

```TypeScript
const webSocketInit = useCallback(() => {
    if (!ws.current) {
      ws.current = new WebSocket('ws://localhost:7070');
    }
  }, [ws]);
```

React 是喜欢不可变数据的，这里使用了 useCallback 包裹了相关方法，以达到可主动链接且不会造成多次渲染的目的

在组件生命周期外，或许需要关闭会话，达到浏览器资源释放的问题

```TypeScript
useLayoutEffect(()=>{
  // do somting
  return ()=>{
    ws.current?.close();
  }
},[ws])
```

React Hooks Api 内建议这样释放资源，同理可以在 commpoent api 内使用 xxx 释放资源

### 关于最终展示的代码

个人认为在最终代码内，最好有日志打印，使用 Hooks api 来监听 WebSocket 的状态去打印日志会显得很费劲且繁琐不堪，得益于 WebSocket 自有的 api 就可以做到很好的日志答应

```TypeScript

import React, { useState, useRef, useLayoutEffect, useCallback } from 'react';
import Header from './components/header';
import './App.less';

const App = () => {
  const ws = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState('');
  const [readyState, setReadyState] = useState('正在链接中');
  const [rdNum, SetRdNum] = useState<number>(0);

  /**
   * 伪随机函数，测试用
   *  */
  const getRandomInt = useCallback(() => {
    SetRdNum(Math.floor(Math.random() * Math.floor(999)));
  }, []);

  const webSocketInit = useCallback(() => {
    const stateArr = [
      '正在链接中',
      '已经链接并且可以通讯',
      '连接正在关闭',
      '连接已关闭或者没有链接成功',
    ];
    if (!ws.current || ws.current.readyState === 3) {
      ws.current = new WebSocket('ws://localhost:7070');
      ws.current.onopen = _e =>
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      ws.current.onclose = _e =>
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      ws.current.onerror = e =>
        setReadyState(stateArr[ws.current?.readyState ?? 0]);
      ws.current.onmessage = e => {
        setMessage(e.data);
      };
    }
  }, [ws]);

  /**
   * 初始化 WebSocket
   * 且使用 WebSocket 原声方法获取信息
   *  */
  useLayoutEffect(() => {
    getRandomInt();
    webSocketInit();
    return () => {
      ws.current?.close();
    };
  }, [ws, getRandomInt, webSocketInit]);

  console.log('ws.readyState', ws.current?.readyState);

  return (
    <div className='App'>
      <Header status={readyState} />
      <div className='container'>
        <div>{message}</div>
        {/* <div>{readyState}</div> */}
        <div
          onClick={() => {
            ws.current?.close();
          }}>
          Clone
        </div>
        <div
          onClick={() => {
            getRandomInt();
            webSocketInit();
          }}>
          start
        </div>
        <div
          onClick={() => {
            if (ws.current?.readyState !== 1) {
              console.log('尚未链接成功');
              setMessage('正在链接');
              return;
            }
            ws.current?.send(rdNum.toString());
          }}>
          ID:{rdNum}
        </div>
      </div>
    </div>
  );
};

export default App;
```

### 关于 QA

#### Q：为什么不实用 socket.io?

简单需求下，没必要下载一个库，学习 WebSocket 也有利于理解 socket 源码，或许后期也会在项目使用 socket.io

#### Q：为什么要在 function commopent 内里做 WebSocket 初始化？

可以肯定，在外初始化肯定是更好阅读与理解的，如下例子：

```TypeScript
import React from 'react';

const ws = new WebSocket('ws://loaclhost:7070');

const App = () => {
  // do ing...
};
```

考虑到后续的 WebSocket 状态均需要在 function commopent 内显示，所以最终选择了在内初始化的选择，目前还没看到优秀的在外且可接受状态的优秀例子

#### Q：为什么不能直接使用 WebSocket.readyState 的状态来打印状态？

WebSocket.readyState 实际上并没有跟着返回消息或者操作更新了状态，需要主动获取来感知状态的更新

### 关于小结

本文或许没多到新鲜感，属于个人笔记的流水线文章

感谢各位阅读!

---

### 关于借鉴

- [JavaScript | WebSocket 讓前後端沒有距離](https://medium.com/enjoy-life-enjoy-coding/javascript-websocket-%E8%AE%93%E5%89%8D%E5%BE%8C%E7%AB%AF%E6%B2%92%E6%9C%89%E8%B7%9D%E9%9B%A2-34536c333e1b)
- [WebSocket() - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/WebSocket/WebSocket)
- [Using WebSockets in Your React/Redux App](https://www.pluralsight.com/guides/using-web-sockets-in-your-reactredux-app)
