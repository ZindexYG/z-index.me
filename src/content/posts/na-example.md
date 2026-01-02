---
title: GitHub Actions 自动化 Node.js 程序
date: 2020-10-25 17:27:37
tags:
  - GitHub Action
  - node
  - docker
cover: /images/accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/images/node-action-example.png)

> 发明了新的料理，不来尝一下嘛

<!-- more -->

### 关于前言

关于前置知识

- 一点点 node
- 一点点 docker
- 一点点 git

关于本文的内容：

- 使用 `Docker` 部署应用
- 使用 `GitHub Action` 持续集成 `Node` 应用到 `Docker Hub` 内

请预先准备一个 node 的 hello world 的程序，node 官网有提供最简单的[例子](https://nodejs.org/zh-cn/about/)

### 关于 node 的 docker 镜像

docker 镜像化现有应用， 需要一个 `dockerfile` 与 `.dockerignore`，以下是例子内的 `dockerfile`

```dockerfile
# 使用父镜像
FROM node:current-slim

# 设置工作目录
WORKDIR /usr/src/app

# 将文件从主机复制到当前位置
COPY package.json .

# 影像文件中运行命令
RUN npm install

# 描述容器运行时监听的端口
EXPOSE 6060

# 在容器中运行的命令
CMD [ "npm", "start" ]

# 将应用程序的其余源代码从您的主机复制到映像文件系统
COPY . ./
```

该 `dockerfile` 复制了 package.json ，运行 npm install ，并启动了端口号 6060 的 node 服务

可以使用以下 docker 指令来生成 `http://localhost:6060` 的服务

```sh
# 生成 docker image
docker build -t na-example .
# 运行 docker image
docker run -dp 6060:6060 --name na-example na-example
```

### 关于 Github Action 自动化的流程

大致期望的流程如下：

1. `git push` 最新代码
2. `GitHub Action` 开始运行
3. `docker build` 最新代码镜像
4. `docker login` 默认登陆 https://hub.docker.com/
5. `docker push` 推送镜像

`GitHub Action` 可以自己项目内 `Action` 项目内选择开源的 `workflow` 生成，选择 docker 的 workflow ，会在项目内生成 `.github/workflows/docker.yml` 文件，本项目是从 docker 的 workflow 衍生的

```yml
name: Docker

on:
  push:
    # Publish `main` as Docker `latest` image.
    branches:
      - main
    # Publish `v1.2.3` tags as releases.
    tags:
      - v*

  # Run tests for any PRs.
  pull_request:
    branches:
      - main

env:
  IMAGE_NAME: na-example
  DOCKER_USERNAME: ${{secrets.DOCKER_USERNAME}}
  DOCKER_PASSWORD: ${{secrets.DOCKER_PASSWORD}}

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2
      - name: Build image
        run: docker build -t $IMAGE_NAME .

      - name: Log into DockHub
        run: docker login -u ${{secrets.DOCKER_USERNAME}} -p ${{secrets.DOCKER_PASSWORD}}

      - name: Push image to DockHub
        run: |
          IMAGE_ID=$DOCKER_USERNAME/$IMAGE_NAME

          # 转换成小写
          IMAGE_ID=$(echo $IMAGE_ID | tr '[A-Z]' '[a-z]')

          # 从版本中删除 github-ref Or github-sha 前缀
          VERSION=$(echo "${{ github.sha }}" | sed -e 's,.*/\(.*\),\1,')

          # 从标签名称中删除 v 前缀
          # [[ "${{ github.ref }}" == "refs/tags/"* ]] && VERSION=$(echo $VERSION | sed -e 's/^v//')

          # Use Docker `latest` tag convention
          [ "${{ github.ref }}" == "main" ] && VERSION=latest

          # 保留前 7 位
          VERSION=${VERSION:0:7}

          # 打印 IMAGE_ID
          echo IMAGE_ID=$IMAGE_ID
          # 打印 VERSION
          echo VERSION=$VERSION

          docker tag $IMAGE_NAME ${IMAGE_ID}:$VERSION

          docker push $IMAGE_ID:$VERSION
```

解析以下这个文件

`line 1-10`：当推送代码至 `main` 分支或 `tag` 中有关键字 `v` 的时候，就会触发工作流

`line 12-15`：工程流内拉取的分支即是 `main`

`line 17-20`：定义工作流内的自定义环境变量

`line 24`：`runs-on` 工作流的运行环境

`line 26-27`：工作流步骤，以及工作流运行环境

`line 28-32`：生成 `docker` 镜像以及登陆 docker.hub

`line 34-60`：运行 shell 脚本，条件定义 `image` 的 `tag`，然后上传至 docker.hub

#### Secrets

使用 `Secrets` 作为 `env` 变量，需要通过 `GitHub` 进行设置，项目内 `Setting -> Secrets` 进行创建即可

`PS：比较优秀的事是，即便是相关字符串，在 GitHub Action 内也是 * 号显示的`

### 关于遇到的问题

#### Q：关于 node 项目使用 127.0.0.1 或 localhost 作为启动 IP 生成 docker image 化后，运行后无法访问

A：由于 127.0.0.1 或 localhost 是指向镜像内的 IP，非对外 IP，如果需要对外访问，可把启动 IP 修改位 0.0.0.0

#### Q：关于 GitHub Action 默认的环境变量

A：可参考 [Context and expression syntax for GitHub Actions](https://docs.github.com/cn/free-pro-team@latest/actions/reference/context-and-expression-syntax-for-github-actions) 与 [environment-variables](https://docs.github.com/cn/free-pro-team@latest/actions/reference/environment-variables)

### 关于小结

本文项目所有代码均从 [na-example](https://github.com/ZindexYG/na-example) 粘贴而来

感谢阅读

---

### 关于参考

- [How to CI and CD a Node.JS Application Using GitHub Actions](https://blog.bitsrc.io/https-medium-com-adhasmana-how-to-do-ci-and-cd-of-node-js-application-using-github-actions-860007bebae6)
- [GitHub Action](https://docs.github.com/cn/free-pro-team@latest/actions)
- [docker docs](https://docs.docker.com/reference/)
