---
title: Sublime 配置与使用
pubDate: 2017-12-17 10:05:11
tags:
    - Sublime
    - 工具
    - 语言环境
cover: /images/accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/images/sublime-index.jpg)

> 工具只是工具，本文只是本人的一点心得，无意引战

<!-- more -->

### 基础配置

`Preferences – Distraction-Settings` 打开；

```javascript

"trim_trailing_white_space_on_save": true, //是否自动移除多余空格
"ensure_newline_at_eof_on_save": true,//是否在结束符号上换行
"highlight_line": true,//是否显示高亮
"disable_tab_abbreviations": true, //是否使用 tab 案件 显示缩写
"translate_tabs_to_spaces": true, // 是否将 tab 符号 换为空格
"draw_minimap_border": true, //是否打开小地图的边框
"save_on_focus_lost": true,//是否打开吃失去焦点时立即自动保存
"word_wrap": true,//是否打开自动换行
"fade_fold_buttons": false, //是否打开右侧的闭合标签的符号
"bold_folder_labels": true,//是否打开侧栏加粗显示
"highlight_modified_tabs": true,//是否打开高亮尚未保存的文件
"vintage_start_in_command_mode": true,//命令模式是否看开启
"auto_find_in_selection": true,//是否打开选中范围搜索

"scroll_past_end": true,//是否打开滚动结束行为
"tab_completion": false,//是否打开 tab 自动完成标签

"default_line_ending": "unix",//默认table
"ignored_packages": [],
"line_padding_bottom": 1,//行下间距
"line_padding_top": 1,//行上间距

"font_options": "subpixel_antialias",//字体默认配置
"font_face": "microsoft yahei",// 字体选择
"tab_size": 2,//标签栏，字体大小
"font_size": 14,//字代替大小

"color_scheme": "Packages/ayu/ayu.tmTheme",//颜色选择
"theme": "Soda Light.sublime-theme",//主题

"rulers": [
    80
],//行距

```

### 配置 Package Control

 Package Control 也算是插件管理器，官网在 [这里](https://packagecontrol.io/)；

快捷键 `` clrl+` `` 或者 `View -> Show Console` 打开窗口，粘贴下方代码至窗口，等待配置完成，重启即可；

```
import urllib.request,os,hashlib; h = '6f4c264a24d933ce70df5dedcf1dcaee' + 'ebe013ee18cced0ef93d5f746d80ef60'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

准备完成，现在可以玩弄插件了；

### 插件列表

下面是我平常使用的插件列表；

- Alignment / 多选择器/
- AutoFileName / 自动补全文件路径与文件名/
- Sublime Batter Completion / 代码提示/
- BracketHighlighter / 行高亮工具/
- CSS Format / css代码提示/
- Emmet / 创建文件/
- GitSavvy / sublime 里面的git 工具/
- JsFormat / javascript格式化(貌似没更新了，没用了)/
- LESS / LESS 代码提示/
- Markdown Preview / MD文档格式化显示工具，好用/
- Nodejs / 链接 nodejs(主要用作依赖)/
- QuoteHTML / 把 HTML 拼接成 js 插入字符串/
- SideBar / 侧栏增强工具/
- SublimeTmpl / 新建文件模板/
- AutoPrefixer / 自动补全浏览器私有前缀 /
- HTML/CSS/JS Prettify / 格式化插件/

### 个人使用癖好

配置完插件之后，有几个配置，属于个人癖好，各位看官可以看着玩，打开 `Preferences – key-Bindings`；

#### 迅速打开浏览器

加上这个配置可以在编辑文件时候，按 `F5` 可以直接用浏览器打开该文件，同理可以配置其他浏览器；

```javascript
 // chrome
{
  "keys": ["F5"],
  "command": "side_bar_files_open_with",
  "args": {
    "paths": [],
    "application": "C:\\Users\\user_name\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe",
    "extensions": ".*"
  }
},
```
#### QutoHTML 把 HTML 拼接成 js 插入字符串

详细看过 `QutoHTML` 文档的应该会发现它，有好几种模式，我这里只列举 `single` 和 `double`，即转变一行，和多行的字符串；

```javascript
{
    "keys": ["ctrl+alt+`"],
    "command": "quote_html",
    "args": {
        "action": "single"
    }
}, {
    "keys": ["ctrl+alt+shift+'"],
    "command": "quote_html",
    "args": {
        "action": "double"
    }
},
```

#### GitSavvy 的翻译

这个是我目前用的最舒服的一个 git 插件了

[GitSavvy -- 原文介绍](https://github.com/divmain/GitSavvy)

[GitSavvy -- 视频教程](https://www.youtube.com/watch?v=HLU_D8ZiqRs)

- 最常用的一个指令 `shift` + `ctrl` + 'p' 输入 `Git:status` 或者 `gs`

-- OTHER (公共操作) 公共操作几乎所有的都一样就不每一页都解析了  --

原文 | 翻译 |快捷键
-- | -- | --
refresh ststus | 刷新 | [r]
toggle this help menu | 显示 or 隐藏操作帮助 | [?]
transition to next dashboard | 下一项操作表 | [tab]
transition to previous dashboard | 上一项操作表 | [shift - tab]
move cursor to next file | 光标移动到下一个文件 | [.]
move cursor to previous file | 光标移动到上一个文件 | [,]

##### status <small>状态操作表</small>

-- SELECTED FILE(单个文件操作) --

原文 | 翻译 |快捷键
-- | -- | --
open file | 打开选中文件 |[o]
stage file | 选中文件进入 add 模式 |[s]
unstage file | 选中文件取消 add 模式 |[u]
discard changes to file | 放弃修改文件 |[d]
open file on remote | 打开所选的远程仓库文件 |[h]
launch external merge tool for conflict | 为冲突文件启动工具 |[M]
diff file inline | 对比文件内部差异 |[l]
diff file | 对比文件与最新版本差异 |[e]

-- ALL FILE(全文件操作) --

原文 | 翻译 |快捷键
-- | -- | --
stage all unstaged files | 所有未进入暂缓区的文件，进入暂缓区 |[a]
stage all unstaged and untracked files | 所有未进入暂缓区的文件，进入暂缓区，包括新建 |[A]
unstage all staged files | 所有文件退出暂缓区 |[U]
discard all unstaged changes | 取消所有未进入暂缓区文件的修改 |[D]
diff all files | 查看所有文件的差异 |[f]
diff all cached files | 查看所有有作改变文件的差异 |[F]

-- ACTIONS (提交操作) --

原文 | 翻译 |快捷键
-- | -- | --
commit | 提交 | [c]
commit, including unstaged  | 把包含未进入暂缓区的一起提交 | [C]
amend previous commit | 恢复到之前的提交 | [m]
push current branch | 提交到某分支 | [p]
ignore file | 忽略所选文件 | [i]
ignore pattern | 忽略模式 | [I]

-- STASHES (恢复操作) --

原文 | 翻译 |快捷键
-- | -- | --
apply stash | 恢复工作区，修改内容不变 | [t][a]
pop stash | 恢复版本号，同时修改内容 | [t][p]
show stash | 查看修改区文件修改情况 | [t][s]
create stash | 创建修改区 | [t][c]
create stash including unstaged | 将所有未修改的文件都包含到修改区 | [t][u]
create stash of staged changes only | 只对修改过的文件创建修改区 | [t][g]
drop stash | 撤销修改 | [t][d]

#### branches <small>分支操作表</small>

-- ACTIONS (操作) --

左边

原文 | 翻译 |快捷键
-- | -- | --
checkout | 选中分支切换 | [c]
create from selected branch | 创建并切换到该分支 | [b]
delete | 删除分支 | [d]
delete (force) | 强制删除 | [D]
rename (local) | 重命名 | [R]
configure tracking | 查看分支情况 | [t]
diff against active | 查看工作区与分支区别 | [f]
diff history against active | 查看该分支历史差异 | [h]
edit branch description | 编辑分支描述 | [e]

右边

原文 | 翻译 |快捷键
-- | -- | --
push selected to remote | 推送所选分支到远程 | [p]
push all branches to remote | 推送所有分支到远程 | [P]
fetch remote branches | 获取远程分支 | [h]
merge selected into active branch | 合并分支 | [m]
fetch and merge into active branch | 获取远程分支并合并当前分支 | [M]
show branch log| 查看分支日志 | [L]
show branch log graph | 查看分支日志图表 | [g]


##### rebase <small>合并操作表</small>

-- MANIPULATE COMMITS (提交操作) --

左边

原文 | 翻译 |快捷键
-- | -- | --
squash commit with previous | 压缩之前的提交信息 | [q]
squash commit with ... | 压缩某一段提交信息 | [Q]
squash all commits | 压缩所有提交信息 | [S]
drop commit | 撤销提交 | [p]
edit commit message | 编辑提交信息 | [e]
move commit down (after next) | 提交信息下移 | [d]
move commit after ... | 提交信息移至某处之前 | [D]
move commit up (before previous) | 提交信息上移 | [u]
move commit before ... | 提交信息移至某处之后 | [U]
show commit | 查看所有提交信息 | [w]

右边

原文 | 翻译 |快捷键
-- | -- | --
define base ref for dashboard | 以本地选择为基准 | [f]
rebase branch on top of.. | 提交至某远程仓库 | [r]
toggle preserve merges mode | 切换 保留 or 合并 模式 | [m]
continue rebase | 跳过本次提交 | [c]
skip commit during rebase | 重新绑定跳过的提交 | [k]
abort rebase | 终止提交 | [A]

##### tages <small>标签操作表</small>

-- ACTIONS (行为) --

原文 | 翻译 |快捷键
-- | -- | --
create | 创建标签 | [c]
create smart tag | 创建智能标签 | [s]
delete | 删除标签 | [d]
push to remote | 所选标签提交至远程仓库 | [p]
push all tags to remote | 提交所有标签到远程仓库 | [P]
view commit | 查看提交信息 | [L]

##### graph <small>查看操作日志</small>
