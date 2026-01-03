---
title: 理解 JavaScript 中 Reduce()
pubDate: 2020-10-25 20:51:01
tags:
  - JavaScript
cover: /posts/js-api-reduce.png
description: 新鲜的调料，与从前不同的是？
---

![](/posts//js-api-reduce.png)

> 新鲜的调料，与从前不同的是？

<!-- more -->

### 关于前言

`reduce()` 是一个有用的函数式编程技术，特别在需求上需要对象或数组聚合的时候。本文将要介绍 `reduce()` 方法，并对比使用 `map()` 与 `filter()`

`reduce()` 的一般用法：

```javascript
const array1 = [1, 2, 3, 4];
const reducer = (accumulator, currentValue) => accumulator + currentValue;

// 1 + 2 + 3 + 4
console.log(array1.reduce(reducer));
// expected output: 10

// 5 + 1 + 2 + 3 + 4
console.log(array1.reduce(reducer, 5));
// expected output: 15
```

`PS：reduce() 第二参数为可选参数，会影响 reduce() 最后返回值的格式`

最为常见的用法，即是返回数组中所值的总和，如：

```javascript
const input = [1, 100, 1000, 10000]
const sum = input.reduce((accumulator, item) => {
  return accumulator + item
}, 0) // 11101
```

### 关于 map() 与 reduce()

返回新数组

```javascript
const numbers = [1, 10, 100]

const map_squared = numbers.map(item => Math.pow(item, 2))  // [1, 100, 10000]

const reduce_squared = numbers.reduce((acc, number) => {
  acc.push(Math.pow(number, 2))
  return acc
}, []) // [1, 100, 10000]
```

### 关于 filter() 与 reduce()

返回过滤数组

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const filter_evenNumbers = numbers.filter(number => number % 2 === 0)
// [2, 4, 6, 8, 10]

const reduce_evenNumbers = numbers.reduce((acc, number) => {
  if (number % 2 == 0) {
    acc.push(number)
  }
  return acc
}, [])
// [2, 4, 6, 8, 10]
```

### 关于数组转化为对象

需求：需要从数组中统计数据，并最终返回该数据对象

```javascript
const voters = [
  { name: "Bob", age: 30, voted: true },
  { name: "Jake", age: 32, voted: true },
  { name: "Kate", age: 25, voted: false },
  { name: "Sam", age: 20, voted: false },
  { name: "Phil", age: 21, voted: true },
  { name: "Ed", age: 55, voted: true },
  { name: "Tami", age: 54, voted: true },
  { name: "Mary", age: 31, voted: false },
  { name: "Becky", age: 43, voted: false },
  { name: "Joey", age: 41, voted: true },
  { name: "Jeff", age: 30, voted: true },
  { name: "Zack", age: 19, voted: false },
]

// initialVotes 为最终返回的对象的格式，并设置默认值为 0
// *Votes       有选票
// *            无选票
const initialVotes = {
  youngVotes: 0,
  youth: 0,
  midVotes: 0,
  mids: 0,
  oldVotes: 0,
  olds: 0,
}

// key 对象转换
const peersToVotePeers = {
  youth: "youngVotes",
  mids: "midVotes",
  olds: "oldVotes",
}

voters.reduce((acc, voter) => {
  if(voter.age < 26)
    peers = "youth"
  } else if (voter.age < 36) {
    peers = "mids"
  } else {
    peers = "olds"
  }
  if (!voter.voted) {
    // 无选票人员 +1
    return { ...acc, [peers]: acc[peers] + 1 }
  } else {
    const votePeers = peersToVotePeers[peers];
    // 统计有选票人员 +1，同时该年龄段人员 +1
    return {
      ...acc,
      [peers]: acc[peers] + 1,
      [votePeers]: acc[votePeers] + 1,
    }
  }
}, initialVotes)

/*
{
  youngVotes: 1,
  youth: 4,
  midVotes: 3,
  mids: 4,
  oldVotes: 3,
  olds: 4
}
 */
```

### 关于总结

本文是关于 `reduce()` 的一些思考，及其与 `map()` 与 `filter()` 的对比

总结思考，`reduce()` 在处理数组对象统计的时候更显优势

感谢阅读

----

### 关于参考

- [understanding-reduce-in-javascript](https://www.aboutmonica.com/blog/2020-03-29-understanding-reduce-in-javascript)
- [Array.prototype.reduce()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
