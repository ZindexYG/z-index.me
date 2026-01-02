---
title: Ajax 之文件上传
date: 2018-05-31 23:40:57
tags:
    - javascript
    - ajax
    - ES6
cover: /images/accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/images/uploading-file-banner.jpg)

> 这个应该是用来做菜的~

<!-- more -->

## FormData

### 简单的上传例子

```javascript
/*
  先在 html 里面准便好 <input class="file-input" tpye="file" /> 标签
*/

var fileInput = document.querySelector('.file-input');
var formData = new FormData();

//添加 formData 上传文件
fileInput.onchange = function(e){
  formData.append("fileIn", this.value);
}

//上传文件
var request = new XMLHttpRequest();
request.open("POST", "/ajax.php");
request.send(formData);

```

### 解读步骤

1. `fileInput` 的 `dom` 对象获取， `FormData` 对象生成；
2. 使用 `fileInput` 的 `onchange`  事件来获取，文件的内容；
3. 使用 `formData` 的 `append` 方法来添加一个新值到 `formData` 里面来；
4. 使用 `XMLHttpRequest` 的 `send` 的方法来上传文件；

### 原理说明

`FormData` 对象其实不止是可以用来上传文件，如同其名，可以模拟一系列表单控件的键值对，然后用于 `XMLHttpRequest` 的提交，其最大的优点就是可以异步上传一个二进制文件；

`FormData` 是无法读取文件的，其核心就是通过 `append()`，将文件变成新增字段，来上传文件；

## FileReader

### 简单的读取文件例子

```javascript

/*
  先在 html 里面准便好 <input class="file-input" tpye="file" /> 标签
*/

var fileInput = document.querySelector('.file-input');
// 创建 FileReader 对象
var fileReader = new FileReader();

fileInput.onchange = function(e){
  // 获取原声 File 对象
  var file = event.target.files[0];
  // 以二进制读取文件对象
  fileReader.readAsArrayBuffer(file);
  //fileReader.readAsDataURL(file); // 以data:URL 格式的字符串以表示读取文件的内容
  //fileReader.readAsText(file); //以字符串形式表示读取到的文件内容
}

// 读取操作完成后
fileReader.onload = function (e) {
  console.log(e)
}

```

### 解读步骤

1. 创建 `FileReader` 对象；
2. 通过 `fileInput` 的 `dom` 对象 `onchange` 的方法， 获取原始 `File` 对象；
3. 通过 `FileReader` 中其中一种读取方式，读取原始 `File` 对象；
4. 通过 `FileReader` 的 `onload` 方法获取来继续读取完成后的操作；

### 原理说明

一般来说，读取文件应用场景应该是需要作断点续存的时候，或者想要预览上传的图片；

预览图片例子

```javascript

var fileInput = document.querySelector('.file-input');
var imgSrc = document.querySelector('.img')
// 创建 FileReader 对象
var fileReader = new FileReader();

fileInput.onchange = function(e){
  // 获取原声 File 对象
  var file = event.target.files[0];

  fileReader.readAsDataURL(file); // 以data:URL 格式的字符串以表示读取文件的内容
}

// 读取操作完成后
fileReader.onload = function (e) {
  console.log(e)
  imgSrc.src = e.target.result
}

```

由于本人使用 `FileReader` 得并不多，所以这里不作详细讨论了，有兴趣的同学可以，直接去看[MDN文档](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)

## 总结

虽然上传文件很早就尝试过了，但是当时理解并不是很深入，而且加上最近几次在这方面知识的打击，有点不太能认了；

感谢 [白白](https://github.com/ZhangPuXi) 的几次指导，（指导了好几次，本人还是忘了)

感谢 [MDN](https://developer.mozilla.org/zh-CN/) 提供的文档给予我一定的灵感
- [FormData 对象的使用](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData/Using_FormData_Objects)
- [FileReader](https://developer.mozilla.org/zh-CN/docs/Web/API/FileReader)

感谢阅读，欢迎指出文章的不足之处，以及讨论更多的代码优化
