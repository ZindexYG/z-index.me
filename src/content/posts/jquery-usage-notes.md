---
title: jQuery的使用心得
pubDate: 2017-12-18 00:43:19
tags:
    - jQuery
    - 读书笔记
cover: /posts//accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/posts//jquery-banner.jpg)

> 本文大部分都在参考 [《锋利的jQuery》](https://book.douban.com/subject/10792216/) 一书，几乎可以说是读书笔记

<!-- more -->

### 规则 && 格式

1. 对于同一个对象不超过三个操作直接一行显示；
2. 对于同一个对象的较多操作，每个操作一行；
```javascript
//例子
$(this).removerClass('add')
       .addClass('remove')
```
3. 对于多个对象的少量操作，每个对象一行，其中涉及子元素的可做缩进处理；
```javascript
//例子
$(this).addClass('add')
       .childe.show().
siblings().removerClass('remove')
```
4. 如果获取 JQ 对象，在变量前面加上 `$` 符号
```javascript
var $var = $(this)
```
5. 如果获取的 DOM 对象，则不需要
```javascript
var v = $(this)[0]
```
6. JQ 对象和 DOM 对象之间的转换
```javascript
//1.[index]方法
var $cr = $('#cr')
var cr = $cr[0]

//2.get(index)方法
var $cr = $('#cr')
var cr = $cr.get(0)
```
7. $('className Or ID') 获取的永远是对象，即便网页上没有，即当 jQ 检索某个元素是否存在时候，需根据长度或转化为 dom 对象来判断对象是否存在
```javascript
if($('#tt')){//do something} X

if($('#tt').length > 0){//do somthing}  ✓
```

### jQ 如何解决事件冒泡

在 jQ.1.7 中，`on()` 是首选绑定事件，

```javascript
$(document).on('click','.btn',function(){
  event.preventDefault();
  //do somthing
})
```
#### `on()` 与 `bind()` 的区别

`on()` 绑定的对象可以是动态生成的，而 `bind()` 绑定的对象必须是事先存在的

#### 阻止冒泡行为

```javascript

// 如果事件可取消，则取消该事件，而不停止事件的进一步传播
event.preventDefault();

// 直接阻止默认行为
event.stopPropagation();

//同时对时间对象停止冒泡和默认行为，在事件处理函数中返回 false
$('element').click(function () {
    //do somthing
    return false
})

```

### jQuey 的 Ajax()

#### 解析

```js
  $.ajax({
    url: '', // 接口地址
    type: '',//请求方式
    dataType: '',//获取格式
    data: {param: 'value'},//请求参数
  })
  .done(function() {
    //链接获取成功
    console.log("success");
  })
  .fail(function() {
    //链接获取失败
    console.log("error");
  })
  .always(function() {
    //无论失败或者成功
    console.log("complete");
  });

  //post 快速请求
  $.post(url, {param: 'value'}, function(data, textStatus, xhr) {},'type');

  //get 快速请求
  $.get(url, function(data) {},'type');


```

`$.ajax()`，`$.post()`，`$.get()` 都是 jQuery 中的全局函数

#### $.ajaxSetup() 设置默认值

为以后要用到的Ajax请求设置默认的值,使用 `名称/值` 对来规定 AJAX 请求的设置。

```javascript
$.ajaxSetup({
  url:'url',
  dataType:post,
})
```

### 常用的 JQ 代码段

#### 1. 禁用页面的右键菜单

```javascript
$(document).ready(function(){
    $(document).bind("contextmenu", function(){
        return false
    })
})
```

#### 2. 新窗口的开页面

```javascript
$(document).ready(function() {
    //1.
    $('a[href^="http://"]').attr("target", "_blank")

    //2.
    $('a[re]$="external"').click(function(){
        this.target = "_blank"
    })
})
```

#### 3. 判断浏览器类型

PS:**JQ1.3 后，官方贵贱使用$.supper 来代替 $.browser**

```javascript
$(document).ready(function() {
    //firefox 2 and above
    if($.browse.mozilla && $.browser.version >="1.8") {
        //do something
    }
    //safari
    if($.browse.safari) {
        //do something
    }
    // chorme
    if($.browse.chrome) {
        //do something
    }
    // opera
    if($.browse.opera) {
        //do something
    }
    //ie7 and below
    if($.browser.msie && $.browser.version <= 6){
        //do something
    }
    //ie6 and anything
    if($.browser.msie && $.browser.version >6) {
        //do something
    }
})
```

#### 4. 输入框文字获取焦点

```javascript
$(document).ready(function() {
    $('input.text').val('点击回车即可搜索')
    textFill($('input.text'))
})

function textFill(input) {
    //input focus text function
    var originalvalue = input.val()
    input.focus(function () {
        if($.trim(input.val())== originalvalue){
            input.val('')
        }
    }).blur(function () {
        if($.trim(input.val()) == '') {
            input.val(originalvalue)
        }
    })
}
```
#### 5. 返回头部滑动动画

```javascript
jQuery.fn.scrollTo =function (speed) {
    var targetOffset = $(this).offset().top
    $('html, body').stop().animate({scrollTop: targetOffset}, speed)
    return this
}

$('#button').click(function(){
    $('body').scrollTo(500)
    return false
})
```

#### 6. 获取鼠标位置

```javascript
$(document).ready(function() {
    $(document).mousemove(function(e){
        $('#XY').html("X:"+e.pageX + "| Y:" + e.pageY)
    })

})
```

#### 7. 判断元素是否存在

```javascript
$(document).ready(function(){
    if($('#id').length){
        //do something
    }
})
```

#### 8. 点击 div 也可以跳转

```javascript
$('div').click(function(){
    window.location = $(this).find('a').attr('href')
    return false
})
```

#### 9. 根据浏览器大小添加样式

```javascript
$(document).ready(function() {
    function checkWindowSize() {
        if($(window).width > 1200){
            $('body').addClass('add')
        } else {
            $('body').removeClass('add')
        }
    }
})
$(window).resize(checkWindowSize)
```

#### 10. 设置 div 在屏幕中央

```javascript
$(document).ready(function(){
    jQuery.fn.center = function (){
        this.css('position','absolute')
        this.css('top', ($(window).height() - this.height()) / 2 + $(window).scrollTop() + 'px')
        this.css('left', ($(window).width() - this.width()) / 2 + $(window).scrollLeft() + 'px')
    }
    $('#xy').center()
})
```

#### 11. 创建自己的选择器

```javascript
$(document).ready(function () {
    $.extend($.expr[':'], {
        moreThen500px: function(a) {
            return $(a).width() > 500;
        }
    });
    $('.box:moreThen500px').click(function () {
        //do
    })
})
```

#### 12. 关闭所有动画效果

```javascript
$(document).ready(function() {
    jQuery.fx.off = true
})
```

#### 13. 检测鼠标的左右键

```javascript
$(document).ready(function() {
    $('#xy').mousedown(function(e){
        alert(e.which)
        //1 = 鼠标左键，2 = 鼠标中键，3 = 鼠标右键
    })
})
```

#### 14. 回车提交表单

```javascript
$(document).ready(function() {
    $('input').keyup(function(e){
        if(e.which === '13'){
            alert('ok')
        }
    })
})
```

#### 15. 设置全局 ajax 参数

```javascript
$('#load').ajaxStart(function(){
    showLoading();
    disableButtons();
});
$('#load').ajaxCompleta(function(){
    hideLoading();
    enableButtons();
})
```

#### 16. 获取选中的下拉框

```javascript
$('#someElement').find('option:selected')
$('#someElement option:selected')
```

#### 17. 切换复选框

```javascript
var tog =false
$('button').click(function(){
    $('input[type=checkbox]').attr('checked',!tog)
    tog = !tog
})
```

#### 18. 使用 siblings() 来选择同辈元素

```javascript
$('#nav li').click(function(){
    $(this).addClass('active')
            .siblings().removeClass('active')
})
```

#### 19. 个性化链接

```javascript
$(document).ready(function(){
    $('a[href$=pdf]').addClass('pdf')
})
```

#### 20. 一段时间后自动关闭或者隐藏元素

```javascript
setTimeout(function() {
    $('div').fadeIn(400)
}, 3000)
```

