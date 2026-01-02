---
title: 关于规范化的二三事情
date: 2022-05-05 16:35:40
tags:
  - eslint && prettier
  - confing
  - git
cover: /images/accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/images/project-base-rule.png)

> 灶台大了，酱料也要备多一点才行呀

<!-- more -->

### 关于目录

- 关于几个常见文件
- 关于 eslint、prettier 配置
- 关于 Git hooks
- 关于总结

### 关于几个常见文件

一般项目内容易看到

```shell
| poject/
| --.vscode/                  // vscode 的配置
| --.husky/                   // 存放 git commit 规则
| --.eslintrc.json            // eslint 规则
| --.eslintignore.json        // 可忽略 eslint 的规则或文件
| --.editorconfig             // 存放编码规则，一般用于告诉编辑器当前的编码规则
| --.prettierrc.json          // prettier 规则
| --.prettierignore.json      // 可忽略 prettier 的文件
```

### 关于 eslint、prettier 配置

#### ESLint 快速配置

```shell
# 安装
yarn add eslint --dev
# 默认配置
yarn create @eslint/config
```

#### prettier 快速配置

```shell
# 安装
yarn add --dev --exact prettier
# 默认配置
echo {}> .prettierrc.json
echo # Ignore > .prettierignore
```

TIP: .prettierrrc.json 个人配置

```JSON
{
  "printWidth": 80,
  "jsxSingleQuote": true,
  "tabWidth": 2,
  "semi": false,
  "singleQuote": true,
  "trailingComma": "all",
  "jsxBracketSameLine": true,
  "bracketSpacing": true,
  "proseWrap": "preserve",
  "arrowParens": "avoid",
  "htmlWhitespaceSensitivity": "css",
  "quoteProps": "as-needed"
}
```

#### 善用 prettier 的 git hooks

这是为了保证每次提交之前运行 Prettier：

1. 安装 husky 和 ​​lint-staged：

```shell
yarn add --dev husky lint-staged
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

2. 将以下内容添加到您的 package.json:

```JSON
{
  "lint-staged": {
    "**/*": "prettier --write --ignore-unknown"
  }
}
```

#### 视情况使用.vscode 配置

TIP： 各自判断是否需要强制

```JSON
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

### 关于 commit rule

几个插件

| 插件                            | 说明                               |
| ------------------------------- | ---------------------------------- |
| commitizen                      | 定义提交规则和传达规则的标准方式   |
| @commitlint/cli                 | 检查提交消息是否符合传统的提交格式 |
| @commitlint/config-conventional | 配置提交常规                       |
| @commitlint/cz-commitlint       | 提供交互提交信息                   |

```shell
# 项目内下载
yarn add -D commitizen @commitlint/cli @commitlint/config-conventional @commitlint/cz-commitlint

# 配置文件生成
echo "module.exports = { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
```

使用交互式提交，需要在 package.json 中新增如下配置

```JSON
{
  "config": {
    "commitizen": {
      "path": "@commitlint/cz-commitlint"
    }
  }
}
```

由于是项目内使用，为配合其他同事的使用，需要配合 package.json 中 scripts 或者使用 `yarn git-cz` 来使用

```JSON
{
  "scripts": {
    "commit": "git-cz"
  }
}
```

`自定义提交交互信息`

```JavaScript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  prompt: {
    questions: {
      type: {
        description: '选择要提交的更改类型',
        enum: {
          feat: {
            description: '新功能',
            title: 'Features',
            emoji: '✨',
          },
          fix: {
            description: 'bug 修复',
            title: 'Bug Fixes',
            emoji: '🐛',
          },
          docs: {
            description: '仅文档更改',
            title: 'Documentation',
            emoji: '📚',
          },
          style: {
            description: '不影响代码逻辑的更改（空格、格式、缺少分号等）',
            title: 'Styles',
            emoji: '💎',
          },
          refactor: {
            description: '重构，既不修复 Bug 也不添加功能的代码更改',
            title: 'Code Refactoring',
            emoji: '📦',
          },
          perf: {
            description: '性能优化',
            title: 'Performance Improvements',
            emoji: '🚀',
          },
          test: {
            description: '新增测试或更正现有测试',
            title: 'Tests',
            emoji: '🚨',
          },
          build: {
            description:
              '影响构建系统或外部依赖项的更改（示例范围：yarn、npm）',
            title: 'Builds',
            emoji: '🛠',
          },
          ci: {
            description:
              '对 CI 配置文件和脚本的更改(example scopes: Travis, Circle, BrowserStack, SauceLabs)',
            title: 'Continuous Integrations',
            emoji: '⚙️',
          },
          chore: {
            description: '其他不修改 src 或测试文件的更改',
            title: 'Chores',
            emoji: '♻️',
          },
          revert: {
            description: '撤銷、復原一次 git commit',
            title: 'Reverts',
            emoji: '🗑',
          },
        },
      },
      scope: {
        description: '请说明更改具体范围（例如组件或文件名）',
      },
      subject: {
        description: '请简短描述的该变化',
      },
      body: {
        description: '请提供更改的详细说明',
      },
      isBreaking: {
        description: '是否有重大更改？',
      },
      breakingBody: {
        description: '重大更改提交需要特殊说明。请输入提交本身的详细描述',
      },
      breaking: {
        description: '描述重大更改',
      },
      isIssueAffected: {
        description: '此更改是否会影响未解决的问题？',
      },
      issuesBody: {
        description:
          '如果问题已关闭，则提交需要一个主体。请输入提交本身的较长描述',
      },
      issues: {
        description: '添加问题引用（例如，“修复 #123”、“修改 #123”。',
      },
    },
  },
}
```

#### 结合 git hook 即可强制要求了

在 .husky/ 下新增 `commit-msg(可自定义名字)` 文件

```shell
npx husky add .husky/commit-msg "npx --no-install commitlint --edit "" "
```

### 关于总结

项目愈发庞大，就愈发需要一些规范，来规范团队之间的协作

当然对于个人一开始多少会有阵痛，但阵痛过后，彼此协作更加顺畅，岂不也是美哉

---

参考文章

- [eslint - getting-started](https://eslint.org/docs/user-guide/getting-started)
- [prettier - install](https://prettier.io/docs/en/install.html)
- [prettier - precommit](https://prettier.io/docs/en/precommit.html)
- [commitlint](https://commitlint.js.org/#/)
- [commitizen]()
- [Git cz 規範你的 commit 訊息](https://medium.com/@peter3036200/git-cz-%E8%A6%8F%E7%AF%84%E4%BD%A0%E7%9A%84-commit-%E8%A8%8A%E6%81%AF-9bd8f91b3267)
