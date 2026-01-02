---
title: 管理系统内 Tag 功能的实现
pubDate: 2019-08-08 00:03:52
tags:
    - 业务
    - react
    - vue
cover: /images/accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/images/tagImage-banner.jpg)

> 愈发纯熟的业务代码——开始做菜

<!-- more -->

<style>
.posts-expand .post-body img{
  margin: 10px 0;
}
</style>
### 1.背景 && 需求分析

#### 1.1 背景

某日，被后台拿着一个别人实现好的管理系统说道了一顿，说需要实现得比某框架更好

地址：[pig4cloud](https://pigx.pig4cloud.com/)

#### 1.2 需求分析

需求：管理系统内实现浏览器 Tag 标签的功能

分析：

  1. `切换 Tag 不主动更新页面（重点）`
  2. 关闭活动中的 Tag 切换至后一个
  3. 若关闭 Tag 为最后一个，切换至前一个


### 2. 实现逻辑



技术栈：react + react-router + react-redux + react-saga

重点：`组件更新，页面不变`

上 demo ：[![Edit react-tag-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-tag-demo-z88jy?fontsize=14)

#### 2.1 内存逻辑

思路：却分活动状态内的存，和在打开过的内存，两个内存同事更新，切换 Tag 从打开过的数组内调取数据，有数据使用该数据，无数据则发起请求

- tagList 侧栏点击过的 Tag 数组
- activeTag 活动状态的 Tag

操作同归在 `Reduce` 内，方便后续 Tag 内外部交互

```javascript
/*.
目录：/src/store/index.js
*/
const appReducer ={
  tabListStatus: (state = { tabList: [], activeTab: null }, action) => {
    switch (action.type) {
      case 'tabListChange':
          //
      case 'tabListAdd':
          //
      case 'tabListRemove':
          //
      case 'tabListClear':
          //
      default:
        return state
    }
  },
  // ...
}

```

所有内存初始状态，都在 `App.js`->`componentDidUpdate` 生命周期内存操作

```javascript
/*
目录：/src/App.js
 */

componentDidUpdate(prevProps, prevState) {
  if (this.props.tabListStatus !== prevProps.tabListStatus) {
    const { tabList, activeTab } = this.props.tabListStatus
    sessionStorage.setItem('tabList', JSON.stringify(tabList))
    sessionStorage.setItem('activeTab', JSON.stringify(activeTab))
    this.setState({
      tabList,
      activeTab: activeTab !== null ? activeTab.key : '/'
    })
  }
}

```

#### 2.2 外部交互逻辑

1. 侧栏逻辑，新增
2. 点击逻辑，切换 Tag
3. 关闭 Tag

```javascript

class App extends Component {
  // 点击侧栏
  handleOnMenuItem = param => {
    const { tabListAdd, tabListStatus } = this.props
    const { tabList } = tabListStatus
    const userMenu = menuDataSource
    const menu = this.menuItemFilter(userMenu, `/nav_${param.key}`)

    let paramTab = {
      title: menu.name,
      key: menu.path,
      queryParam: {},
      dataSource: {}
    }

    //判断是否为新增
    let pushBol = true
    tabList.map(tab => {
      if (tab.key === paramTab.key) {
        pushBol = false
        paramTab = Object.assign({},paramTab,tab)
      }
      return tab
    })

    if (pushBol) {
      tabList.push(paramTab)
    }

    tabListAdd({
      tabList,
      activeTab: paramTab
    })

    this.toPath(`nav_${param.key}`)
  }
  // 点击 Tag
  onChange = activeKey => {
    // console.log('....', activeKey)
    const { tabListStatus, tabListAdd } = this.props
    const { tabList } = tabListStatus
    const userMenu = tabList
    const menu = this.menuChangeFilter(userMenu, activeKey)

    const paramTab = {
      ...menu
    }

    tabListAdd({
      tabList,
      activeTab: paramTab
    })

    this.toPath(activeKey)
  }
  // 关闭逻辑
  remove = targetKey => {
    let activeKey = this.state.activeTab
    let panes = this.state.tabList
    let lastIndex
    panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = panes.length - 1 === i ? i - 1 : i
      }
    })
    const panesFilter = panes.filter(pane => pane.key !== targetKey)

    if (panesFilter.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panesFilter[lastIndex]
      } else {
        activeKey = panesFilter[0]
      }
    } else {
      activeKey = null
    }

    this.props.tabListAdd({
      tabList: panesFilter,
      activeTab: activeKey
    })

    this.toPath(activeKey !== null ? activeKey.key : '/')
  }

  // ...
}

```


#### 2.3 内部交互逻辑

- 判断是否新增
- 操作更新 `onChange`, `onClear`, `onSubmit`

使用标记符号，或者直接判断一个 key 值是否存在值，来发送请求，demo 内使用 dataSource 是否存在为空来判断是否需要发送请求

```javascript

componentDidMount() {
  const { tabListStatus, musicList_query_param, musicList } = this.props
  const { dataSource } = tabListStatus.activeTab

  if (!Object.keys(dataSource).length) {
    musicList(musicList_query_param)
  }
}

```
操作更新 `onChange`, `onClear`, `onSubmit` 除了这一些以外还会存在不同的操作，demo 大致分了这几个操作，均使用 reducer 操作，App.js 内监听操作，更改内存，模块内不参与内存更改

```javascript

onChange = (tabList, e) => {
  e.persist()
  if (!e || !e.target) {
    return
  }
  const { target } = e
  const operateParam = operateQuery(tabList, {
    [target.id]: target.type === 'checkbox' ? target.checked : target.value
  })

  this.props.tabListChange(operateParam)
}

```

### 3. 对比

#### 3.1 Vue 的实现

- 技术栈：vue + vue-router + vuex
- UI 框架：ant-design

关键：keep-alive

[![Edit vue-tag-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/vue-tag-demo-qi4dr?fontsize=14)

#### 3.2 React 的实现

- 技术栈：react + react-router + redux
- UI 框架：ant-design

关键：redux 与内存处理

[![Edit react-tag-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/react-tag-demo-z88jy?fontsize=14)


### 4. 总结

实现上面肯定是 Vue 更快实现的，但对使用 React 内存的控制也是一件非常好玩的事情，如果项目大了，就更好玩了

实际上这种实现有点鸡肋，因为用户一个不留意，关了页面，这些 Tag 就不存在了，无论是那种管理系统，这个实现如果配合到后台，可能就更好玩了

感谢 [@白白](https://github.com/ZhangPuXi)，感谢 [@同事]()，都提供了很不错的思路

感谢阅读，代码很烂，请轻喷
