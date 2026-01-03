---
title: 高德地图JS_api小总结
pubDate: 2018-03-29 21:49:05
tags:
    - webpack
    - ES6
    - plugs
cover: /posts//accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/posts//amap-banner.jpg)

> 一个练手项目的总结，其中感觉最有趣的就是高德地图的文档了（简直不要太友好了~）

<!-- more -->

### 最基础的调用

[高德地图JS_API](https://lbs.amap.com/api/javascript-api/summary)

```html
...
<body>
  <!--创建容器 -->
  <div id="container"></div>
  <!--引入高德地图JSAPI -->
  <script type="text/javascript" src="http://webapi.amap.com/maps?v=1.4.4&key=您申请的key值"></script>
  <!--引入UI组件库（1.0版本） -->
  <script src="http：//webapi.amap.com/ui/1.0/main.js"></script>
  <!-- 基础调用 -->
  <script>
    var map = new AMap.Map('container',{
        resizeEnable: true,
        zoom: 10,
        center: [116.480983, 40.0958]
    });
  </script>
</body>
...
```


### Vue 调用

#### 心酸过程

推荐一下 由 [饿了么](https://github.com/ElemeFE) 出品的 [vue-amap](https://github.com/ElemeFE/vue-amap) 高德地图组件，整体来说还是比较不错的，但是遇到几处 bug 超出了本人的知识范围，只好放弃。

最后 看到了 [在Vue中完美的使用高德地图](http://vue-gaode.rxshc.com/) 这篇文章

#### 调用过程（蛮好玩的）

这里引用了一个方法 remoteLoad() 蛮好用的脚本加载方法；

```javascript

async created() {
  if (window.AMap && window.AMapUI) {
    this.initMap()
  } else {
    await remoteLoad('http://webapi.amap.com/maps?v=1.4.5&key={key}')
    await remoteLoad('http://webapi.amap.com/ui/1.0/main.js')
    this.initMap()
  }
},
methods: {
  initMap(){
    // 初始化 AMap
    this.map  = new AMap.Map('layMap', {
      resizeEnable: true,
      center: [116.30946, 39.937629],
      zoom: 3
    });
    /*
      使用插件就根据 高德 Api 创建
      例如: DistrictSearch
     */
    AMap.service('AMap.DistrictSearch', () => {
      //实例化DistrictSearch
      this.district = new AMap.DistrictSearch({
        extensions: 'all',
        subdistrict: 1,
        showbiz: true
      })
    })
  }
}
```

### 插件的两种调用办法

#### 直接初始化

无论是纯页面，还是 vue 异步加载均可以直接在链接后面加上`plugin` 参数并赋予值；

这种办法适用于在一个组件内多次调用了垓插件，又不想多次初始化的情况；

```bash
http://webapi.amap.com/maps?v=1.4.4&key=您申请的key值&plugin=AMap.DistrictSearch
```

#### 根据需要调用

部分插件在使用之前，需要使用 `AMap.service` 方法加载插件，然后在回调函数中可以进行服务的设定和查询：

```javascript
AMap.service('AMap.DistrictSearch', function() {
  //实例化DistrictSearch
  this.district = new AMap.DistrictSearch({
    extensions: 'all',
    subdistrict: 1,
    showbiz: true
  })
})
```

### 小结

练手项目 - [demo](http://z-index.me/ele-ui-layout/dist/#/)

可能会顿卡，刷新应该就好了

- 感谢 [@白白](https://github.com/ZhangPuXi)
- 感谢 [@猪不乐意](http://www.rxshc.com/)

感谢阅读
