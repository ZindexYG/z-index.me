---
title: bs-table入坑记
pubDate: 2017-12-28 22:00:48
tags:
    - bootstrap
    - 笔记
    - plugs
cover: /images/accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---
![](/images/BTable-banner.jpg)

> 本文旨在记录我使用 bootstrap-table 时候的一些记录,和与部分需求结合的使用情况

<!-- more -->

### [bootstrap-table](http://bootstrap-table.wenzhixin.net.cn/zh-cn/)

基于 jQuery 的表格插件，重在该有的都有，相当适合上手，下称 `bs-table`

### 基础玩法

最基本的引入和把玩，并没有很多高超的技巧，只要引入了　`css`，和 `js`，在不适用的情况下，在 `table`标签内直接添加 `data-toggle="table"` 也是可以激活 `bs-table`

```html
<link href="../style/bootstrap.min.css">
<link href="../style/bootstrap-table.min.css">
  <!-- some more... -->
  <table data-toggle="table">
    <thead>
      <th>
      <!-- some -->
      </th>
    </thead>
    <tbody>
      <th>
      <!-- some -->
      </th>
    </tbody>
    <tbody id="dataBody">
    </tbody>
  </table>
 <!-- some more... -->
<script src="../js/jquery.min.js"></script>
<script src="../js/bootstrap.min.js"></script>
<script src="../js/bootstrap-table.min.js"></script>
<script src="../js/bootstrap-table-zh-CN.min.js"></script>
```
### 初始化插件参数

具体文档已[官方](http://bootstrap-table.wenzhixin.net.cn/zh-cn/documentation/)为主，官方的翻译也还好，此处列举代码里面的参数都是本人常用的，初始化插件参数的方式有两种：

#### 直接在标签里面添加参数

```html
<table class="table text-nowrap"
  data-toggle="table"
  data-checkbox-header="true"
  data-show-toggle="true"
  data-show-columns="true"
  data-query-params-type="undefined"
  data-show-refresh="true"
  data-search="true"
  data-strict-search="true">

  <!-- some -->

</table>
```
#### 使用 `js` 初始化带入参数

```html
<table class="table text-nowrap" id="myTable"

  <!-- some -->

</table>
```
因为引入了 `jQuery` ,所以直接用就好了

```javascript
$(document).ready(function() {
  var $myTable = $('#myTable')
  $('#myTable').bootstrapTable({
    showHeader:true,
    showFooter:false,
    showColumns:true,
    //....
  })
});
```

### 进阶玩法

好了，基本的玩法之后熟悉之后，还是需要数据来玩，才能把　`bs-table` 玩得出彩；

后台返回来的数据结构，一般会包含`当前页码`，`每页的数据量`，`数据总和`，`table 数据本身`;

这里的演示，都在借助[聚合数据](https://www.juhe.cn/)里的免费图书数据；

这边只作本人习惯的写法，过多的就不写了；

### 重要参数

名称 | 标签 | 类型 | 默认值 | 描述
-- | -- | -- | -- | --
height | data-height | Number | undefined | 定义表格的高度
striped | data-striped | Boolean | false | 设置为 true 会有隔行变色效果
sortName | data-sort-name | String | undefined | 定义排序列,通过url方式获取数据填写字段名，否则填写下标
sortOrder | data-sort-order | String | 'asc' | 定义排序方式 'asc' 或者 'desc'
idField | data-id-field | String | undefined | 指定主键列
checkboxHeader | data-checkbox-header | Boolean | true | 设置 false 将在列头隐藏check-all checkbox
silentSort | data-silent-sort | Boolean | true | 设置为 false 将在点击分页按钮时，自动记住排序项；仅在 sidePagination设置为 server时生效
ajax | data-ajax | Function | undefined | 自定义 AJAX 方法,须实现 jQuery AJAX API
queryParams | data-query-params | Function | function(params) {return params;} | 请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数 如果 queryParamsType = 'limit' ,返回参数必须包含 limit, offset, search, sort, order 否则, 需要包含: pageSize, pageNumber, searchText, sortName, sortOrder 返回false将会终止请求
queryParamsType | data-query-params-type | String | 'limit' | 设置为 'limit' 则会发送符合 RESTFul 格式的参数.
responseHandler | data-response-handler | Function | function(res) {return res;} | 加载服务器数据之前的处理程序，可以用来格式化数据，参数：res为从服务器请求到的数据；
sidePagination　| data-side-pagination | String | 'client' | 设置在哪里进行分页，可选值为 'client' 或者 'server'。设置 'server'时，必须设置 服务器数据地址（url）或者重写ajax方法
pageNumber | data-page-number | Number | 1 | 如果设置了分页，首页页码
pageSize | data-page-size | Number | 10 | 如果设置了分页，页面数据条数
pageList | data-page-list | Array | [10, 25, 50, 100, All] | 如果设置了分页，设置可供选择的页面数据条数。设置为 All 或者 Unlimited，则显示所有记录。

#### `html` 里初始化基本的参数

```html
<table class="table text-nowrap" id="#myTable"
  data-checkbox-header="true"
  data-show-toggle="false"
  data-show-columns="true"
  data-toolbar="#toolbar"
  data-query-params-type="undefined"
  data-show-refresh="true"
  data-pagination-loop="false"
  data-show-pagination-switch="false"
  data-side-pagination="server"
  data-pagination="true"
  data-search="true"
  data-strict-search="true"
  data-show-export="true">
  <thead>
      <tr>
        <th data-field="getCheck" data-checkbox="true"></th>
        <th data-field="title">书名</th>
        <th data-field="sub1">简介</th>
        <th data-field="reading">购买数量</th>
        <!-- some -->
      </tr>
    </thead>
</table>

```

#### `js` 里完成请求与数据处理

```javascript

$(document).ready(function() {
  var url = 'http://apis.juhe.cn/goodbook/querycatalog_id=242&dtype=&key=adbe8a45c24acd16f0315f4ee463215b'
  var $myTable = $('#myTable')
  $('#myTable').bootstrapTable({
    //.... option init
    ajax: ajaxRequest,
    responseHandler: responseHandler,
    queryParams: queryParams,
    pageList: [15],
    pageSize: 15,
    pageNumber: 1,
    silent: true,
  })
  //ajax 请求
  function ajaxRequest(parames) {
    $.post(url, parames.data, function (result, textStatus, xhr) {
      //返回值处理
        result.resultcode ? parames.success(function () {
          //行与总数带入
          return {
            "rows": result.result.data.List,
            "total": result.result.data.totalNum,
          }
        }()) : parames.error(function () {
          return {}
        }())
      })
      .fail(function () {
        parames.error({})
      })
  }
  //请求参数处理
    function queryParams(params) {
      params = {
        pageSize: params.pageSize,
        PageNumber: params.pageNumber,
        pn: params.pageNumber,
      }
      return params
    }
  //返回值处理
    function responseHandler(result) {
      var pageDate = result.rows ? result.rows : 0

      return {
        "rows": result.rows || [], //总页数,前面的key必须为"total"
        "total": result.total || [], //行数据，前面的key要与之前设置的dataField的值一致.
      };
    };
});

```



