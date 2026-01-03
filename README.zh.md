![logo](public/logo.png)

# z-index.me

**z-index.me** 是一个有明确设计倾向且极简的博客模板，使用 [Astro](https://astro.build/) 和 [Tailwind CSS](https://tailwindcss.com/) 构建，设计风格深受 [jrmyphlmn.com](https://jrmyphlmn.com/) 的启发。

要使用此模板，请查看仓库：

https://github.com/ZindexYG/z-index.me

主要特性
- 使用 Markdown 与 MDX 撰写文章（`@astrojs/mdx`）
- 轻量级的 Tailwind CSS 样式
- 通过 Astro 插件生成 RSS 与站点地图（`@astrojs/rss`、`@astrojs/sitemap`）
- 支持 OpenGraph 图片与 SEO 默认设置
- 夜间模式与无障碍过渡

快速开始
1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 构建生产包：

```bash
npm run build
```

4. 修复并检查代码风格：

```bash
npm run lint
npm run lint:fix
```

说明
- ESLint 使用 `eslint.config.cjs` 和 `@antfu/eslint-config`（flat config）。
- 仓库包含 `format:md` 脚本（`remark . -o`）；如需使用请安装 `remark-cli`，或移除/更新相应脚本。

在哪里编辑
- 站点元数据：`src/consts.ts`
- 文章：`src/content/posts/`（Markdown / MDX）
- 布局/组件：`src/layouts`、`src/components`
- 全局样式：`src/styles/global.css`

静态资源
- 放在 `public/` 下的文件会被作为根路径静态资源提供，例如 `public/static/blog-placeholder.svg` → `/static/blog-placeholder.svg`。

## 许可证

MIT
