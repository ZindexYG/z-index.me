---
title: 关于 Git 二三事
pubDate: 2022-07-16 19:20:55
tags:
  - git
  - read note
cover: /posts//accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![banner](/posts//git-for-teams.jpg)

> 工具往往需要反复检验

<!-- more -->

### 关于目录

- 关于描述问题
- 关于经典场景 && 解决方案
- 关于一点点小技巧
- 关于小结
- 关于常用指令合集

### 关于描述问题

> 一图胜千言

![git-status-module](/posts//git-for-teams/git-status-module.png)

例子： 选择正确的撤销方法

| 想要...                                                                   | 备注                                                   | 解决方案                      |
| ------------------------------------------------------------------------- | ------------------------------------------------------ | ----------------------------- |
| 舍弃工作目录中对一个文件的修改                                            | 修改的文件未被暂存或提交                               | checkout --[file_name]        |
| 舍弃工作目录中所有未保存的变更                                            | 文件已暂存,但未被提交                                  | reset --hard                  |
| 合并与某个特定提交(但不含)之间的多个提交                                  | --                                                     | reset [commit]                |
| 移除所有未保存的变更,包含未跟踪的文件                                     | 修改的文件未被提交                                     | clean -fd                     |
| 移除所有已暂存的变更和在某个提交之前提交的工作,但不移除工作目录中的新文件 | ---                                                    | reset --hard [commit]         |
| 移除之前的工作,但完整保留提交历史记录( “前进式回滚” )                     | 分支已经被发布,工作目录是干净的                        | revert [commit]               |
| 从分支历史记录中移除一个单独的提交                                        | 修改的文件已经被提交,工作目录是干净的,分支尚未进行发布 | rebase --interactive [commit] |
| 保留之前的工作,但与另一提交合并                                           | 选择 squash(压缩)选项                                  | rebase --interactive [commit] |

通过清晰区分自己当前所要的场景并频繁使用 `git status` 查看当前状态，来明辨的场景

### 关于经典场景 && 解决方案

#### Q：文件删除造成的变基冲突

![git-rebase](/posts//git-for-teams/git-rebase.png)

```bash
First, rewinding head to replay your work on top of it...
Applying: CH10: Stub file added with notes copied from video recording lessons.
Using index info to reconstruct a base tree...
A   ch10.asciidoc
Falling back to patching base and 3-way merge...
CONFLICT (modify/delete): ch10.asciidoc deleted in HEAD and modified in CH10: Stub file added with notes copied from video recording lessons.. Version CH10: Stub file added with notes copied from video recording lessons. of ch10.asciidoc left in tree.
Failed to merge in the changes.
Patch failed at 0001 CH10: Stub file added with notes copied from video recording lessons.
The copy of the patch that failed is found in:
   /Users/emmajane/Git/1234000002182/.git/rebase-apply/patch

When you have resolved this problem, run "git rebase --continue".
If you prefer to skip this patch, run "git rebase --skip" instead.
To check out the original branch and stop rebasing, run "git rebase --abort".
```

##### 关键消息

When you have resolved this problem, run "git rebase --continue".

##### 此信息告诉我需要按以下步骤操作

1. 解决合并冲突 `vim [file_name]`
2. 当合并冲突已经被解决，运行命令 `git rebase --continue`
3. 查看当前状态 `git status`
   - 根据消息 `git reset HEAD [file_name]`
   - 查看状态 `git status`
   - 添加存储 `git add [file_name]`
   - 添加提交 `git commit -m [message]`

#### Q：单个文件合并并冲突造成的变基冲突

```bash
Applying: CH10: Stub file added with notes copied from video recording lessons.
Applying: TOC: Adding Chapter 10 to the book build.
Using index info to reconstruct a base tree...
M   book.asciidoc
Falling back to patching base and 3-way merge...
Auto-merging book.asciidoc
CONFLICT (content): Merge conflict in book.asciidoc
Recorded preimage for 'book.asciidoc'
Failed to merge in the changes.
Patch failed at 0002 TOC: Adding Chapter 10 to the book build.
The copy of the patch that failed is found in:
   /Users/emmajane/Git/1234000002182/.git/rebase-apply/patch

When you have resolved this problem, run "git rebase --continue".
If you prefer to skip this patch, run "git rebase --skip" instead.
To check out the original branch and stop rebasing, run "git rebase --abort".
```

##### 解决思路

- 查看 git 状态消息 `git status`
- 通过 vscode 解决冲突
- 查看 git 状态消息 `git status`

#### Q：定位丢失的工作

##### 临时修改

```bash
# 查看 log 与 relog 的区别
# 查看压缩过的项目历史
git log --oneline
# 查看本地操作记录
git relog
# 签出特定提交，这时候会处于分离状态
git checkout [commit]
# 遵循 git 提示
git checkout -b [restoring_old_commit]
# 修改完相关工作后， 合并回分支
git checkout [working_branch]
git merge [restoring_old_commit]
# 删除临时分支
git branch --delete [restoring_old_commit]
# 如果已经发布，需要删除远程分支
git push --delete [restoring_old_commit]
```

##### 复制提交 cherry-pick

```bash
# 查看图形化日志
git log --online --graph
# 复制另一个分支的提交 在提交信息的末尾追加一行(cherry picked from commit ...)，方便以后查到这个提交是如何产生的。
git cherry-pick -x [commit]
# 复制一段提交，不包含 start_commit
git cherry-pick [start_commit]..[end_commit]
# 复制一段提交，包含 start_commit
git cherry-pick [start_commit]^..[end_commit]
```

#### Q：误删除文件

```bash
# 通过 HEAD 的快捷方式
git reset HEAD [file_name]
# 通过 checkout 恢复被删除文件
git checout -- [file_name]

# 合并指令
git reset --hard HEAD  -- [file_name]

# 批量操作
git reset --hard HEAD
```

#### Q：撤销分支合并

理想情况下，合并分支后，立马意识到这是个错误合并。Git 在执行合并时候会保存一个指向最新提交的指针 `ORIG_HEADs`，这时候直接通过 reset 取消合并即可

```bash
git reset --merge ORIG_HEAD
```

若没有意识到这是个错误合并，已经继续提交了，那么可以开始头脑风暴了

![unmerge](/posts//git-for-teams/unmerge.png)

```bash
# 稳健的创建一个分支
git checkout -b [pre_branch]
# 截取希望保存的 commit
git cherry-pick commit_to_restore
# 回到错误分支
git checkout  [error_branch]
# 回退
git reset [last_correct_commit]
# 再次合并
git merge [good_commits]
```

### 关于一点点小技巧

```bash
# stash 进行保存, 该命令只会保存已知的文件进度
git stash save
# 为加入未跟踪文件，可添加 --include-untracked
git stash save --include-untracked
# 亦可以丢弃它们
git stash save
git clean -D
# 查看保存的 stash
git stash list
# 查看 stash 中的内容
git show stash@{0}


# 可以通过添加内容来区分 stash
git stash save --include-untracked "msg"

# 可以继续工作
git stash list
git stash apply stash@{0}

# 删除 stash
git stash drop stash@{0}

# 应用后删除 stash
git stash pop stash@{0}
```

### 关于小结

本文是关于《Git 团队协作》的阅读笔记，该书已经过于久远，很多指令也已经更新，例如 `git checkout [branch]` 已经可以使用 `git switch [branch]` 来替代了，阅读之后还是能比较清晰的

### 关于常用指令合集

| 命令                                                                  | 用途                                                          |
| --------------------------------------------------------------------- | ------------------------------------------------------------- |
| git clone [url]                                                       | 下载远程仓库                                                  |
| git init                                                              | 初始化仓库                                                    |
| git status                                                            | 获取 git 状态                                                 |
| git add --all OR git add .                                            | 将所有修改过的文件和新文件添加至仓库的暂存区                  |
| git commit -m '[message]'                                             | 将所有暂存的文件提交至仓库                                    |
| git log                                                               | 查看项目历史                                                  |
| git log --oneline                                                     | 查看压缩过的项目历史                                          |
| git branch --list                                                     | 列出所有本地分支                                              |
| git branch --all                                                      | 列出本地和远程分支                                            |
| git branch --remotes                                                  | 列出所有远程分支                                              |
| git checkout --track [branch_name]                                    | 创建远程分支的副本,在本地使用                                 |
| git checkout [branch_name]                                            | 切换到另一个本地分支                                          |
| git checkout -b [branch_name] [branch_name_parent]                    | 从指定分支创建一个新分支                                      |
| git add [file_name]                                                   | 仅暂存并准备提交指定文件                                      |
| git add --patch [file_name]                                           | 仅暂存并准备提交部分文件                                      |
| git add HEAD [file_name]                                              | 从暂存区移除提出的文件修改                                    |
| git commit --amend                                                    | 使用当前暂存的修改更新之前的提交,并提供一个新的提交消息       |
| git show commit                                                       | 输出某个提交的详细信息                                        |
| git tag tag commit                                                    | 为某个提交对象打上标签                                        |
| git tag                                                               | 列出所有标签                                                  |
| git show tag                                                          | 输出所有带标签提交的详细信息                                  |
| git remote add [remote_name] [url]                                    | 创建一个指向远程仓库的引用                                    |
| git push                                                              | 将当前分支上的修改上传至远程仓库                              |
| git remote --verbose                                                  | 列出所有可用远程连接中 fetch 和 push 命令使用的 URL           |
| git push --set-upstream [remote_name] [branch_local] [branch_remote]  | 将本地分支的副本推送至远程服务器                              |
| git merge [branch]                                                    | 将当前存储在另一分支的提交并入当前分支                        |
| git push --delete [remote_name] [branch_remote]                       | 在远程服务器中移除指定名称的分支                              |
| git checkout -b [branch_name]                                         | 创建一个名为 branch 的分支                                    |
| git add [file_name]                                                   | 暂存文件,准备提交至仓库                                       |
| git commit                                                            | 将暂存的变更保存至仓库                                        |
| git checkout [branch]                                                 | 切换到指定分支                                                |
| git merge [branch]                                                    | 将 branch 中的提交并入当前分支                                |
| git branch --delete                                                   | 移除本地分支                                                  |
| git branch -D                                                         | 移除不包含并入其他分支的提交的本地分支                        |
| git clone [URL]                                                       | 下载一份远程仓库的副本                                        |
| git log                                                               | 查看项目历史记录                                              |
| git reflog                                                            | 查看分支的详细历史记录                                        |
| git checkout [commit]                                                 | 切换到另一个本地分支                                          |
| git cherry-pick [commit]                                              | 将提交从一个分支复制到另一个分支                              |
| git reset --merge ORIG_HEAD                                           | 移除当前分支中所有在最近一次合并中引入的提交                  |
| git checkout HEAD [file_name]                                         | 还原已变更但尚未提交的文件                                    |
| git reset HEAD [file_name]                                            | 从暂存区移除提出的文件修改                                    |
| git reset --hard HEAD                                                 | 将所有已变更的文件还原到之前保存的状态                        |
| git reset [commit]                                                    | 取消暂存在这个提交之前的所有提交中的变更                      |
| git rebase --interactive [commit]                                     | 编辑,或压缩提交后的所有提交                                   |
| git rebase --continue                                                 | 在解决合并冲突后,继续变基过程                                 |
| git revert [commit]                                                   | 取消应用指定提交中的变更,创建一个共享友好的历史记录还原       |
| git log --oneline --graph                                             | 显示分支的图形化历史记录                                      |
| git revert --mainline 1 [commit]                                      | 反转一个合并提交                                              |
| git branch --contains [commit]                                        | 列出所有包含指定提交对象的分支                                |
| git revert --no-commit [last_commit_to_keep..newest_commit_to_reject] | 使用一个提交反转一组提交,而不是为每个撤销的提交都创建一个对象 |
| git filter-branch                                                     | 从仓库中永久移除文件                                          |
| git reflog expire                                                     | 忽略详细历史记录,仅使用存储的提交消息                         |
| git gc --prune=now                                                    | 运行垃圾回收器并确保所有未提交的变更从本地内存中移除          |
