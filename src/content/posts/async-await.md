---
title: Async/Await 代替 Promise.all()
pubDate: 2019-08-17 00:37:59
tags:
    - 面试
    - es6
    - es7
cover: /posts/async-await.jpg
description: 新调料，新味道
---
![](/posts/async-await.jpg)

>新调料，新味道

<!-- more -->

## 基本概念

### Promise

保存着一个未来可用的值的代理，本身是严格按照异步方式执行的

```javascript
function resolveUnderThreeSeconds(delay) {
  return new Promise(function(resolve, reject) {
    setTimeout(() => resolve('success'), delay)
    setTimeout(() => reject('fail'), 3000)
  })
}

resolveUnderThreeSeconds(2000)
  .then(res => {
    console.log('res', res)
  })
  .catch(err => {
    console.log('err', err)
  })
```

编写异步代码时，可能两个任务中的一个任务会依赖另一个任务的结果，因此这两个任务必须串行执行

`Promise.all()` 方法接受一个 `Promise` 数组，数组内所有 `Promise` 执行成功后，根据传入顺序返回各个 `Promise` 的结果数据，其中一个被拒绝，即会暂停，返回错误信息

```javascript
const p1 = Promise.reject('failed')
const p2 = Promise.resolve('success')
const p3 = Promise.resolve('success')
const p = Promise.all([p1, p2, p3]).catch(err => console.log(err))
```

### Async/Await

async 函数兼顾了基于 Promise 的实现和生成器风格的同步写法

```javascript
function resolveAfter2Seconds() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve('resolved');
    }, 2000);
  });
}

async function asyncCall() {
  console.log('calling');
  var result = await resolveAfter2Seconds();
  console.log(result);
  // expected output: 'resolved'
}

asyncCall();

````
## 实现

### 功能分析

关键：`Promise.all()` 传入的是 `promise` 数组，数组内所有 `Promise` 执行成功后，根据传入顺序返回各个 `Promise` 的结果数据，其中一个被拒绝，即会暂停，并返回错误信息

数组进入 `async` 函数，循环使用 `async/await` 执行进入的数组函数，然后将函数结果组成数组，最后返回该数组即可

`try/catch` 可获取 `async` 函数内，任意 `await` 的错误，即可满足 `其中一个被拒绝，即会暂停，并返回错误信息` 的功能


```javascript
async function asyncAlls(jobs) {
  try {
    // 循环执行
    let results = jobs.map(async job => await job)
    let res = []
    // 组合数组
    for (const result of results) {
      res.push(await result)
    }
    return res
  } catch (error) {
    throw new Error(error)
  }
}
```


### 实例展示

```javascript

function doJob(x, sec) {
  if (!x) {
    throw new Error('test error')
  }
  return new Promise(resolve => {
    console.log('Start: ' + x)
    setTimeout(() => {
      console.log('End: ' + x)
      resolve(x)
    }, sec * 100)
  })
}

async function asyncAlls(jobs) {
  try {
    let results = jobs.map(async job => await job)
    let res = []
    for (const result of results) {
      res.push(await result)
    }
    return res
  } catch (error) {
    throw new Error(error)
  }
}
(async function() {
  try {
    const all1 = await asyncAlls([doJob(1, 1), doJob(2, 1), doJob(0, 1), doJob(4, 1)])
    console.log('all1', all1)
  } catch (error) {
    console.log('0', error)
  }
  try {
    const all2 = await asyncAlls([doJob(5, 1), doJob(6, 1), doJob(7, 1), doJob(8, 1)])
    console.log('all2', all2)
  } catch (error) {
    console.log('1', error)
  }
})()


````

## 总结

本文思路源于一个面试题，迫于好奇，花了点时间实现了一下，期间有诸多不懂的地方也请教了许多小伙伴，感谢诸位小伙伴解惑

---

## 参考


[JavaScript Async/Await: Serial, Parallel and Complex Flow](https://techbrij.com/javascript-async-await-parallel-sequence)
[ES6 系列之我们来聊聊 Async](https://github.com/mqyqingfeng/Blog/issues/100)


