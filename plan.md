# 格式化/配置 方案说明计划

2. 是否可以使用 ESLint 作为代码格式化的插件/工具？

- 回答：可以。ESLint 可通过 `--fix` 自动修复大量问题并可作为主要格式化工具；也可配合 `eslint-plugin-prettier` 将 Prettier 作为 ESLint 规则运行，或用 `eslint-config-prettier` 避免规则冲突。

实现方案 A（使用 ESLint 作为主格式器，移除 Prettier）：

npx eslint --init

````bash
pnpm add -D eslint
# 格式化/配置 方案说明计划（使用 antfu ESLint 配置）

决策：采用 `antfu` 的 ESLint 配置作为主要代码风格/格式化基线，配合 `remark` 处理 Markdown，使用 `pnpm` 管理依赖。此方案移除 Prettier 作为默认格式器（可按需保留作 MD 或特定场景）。

目标：
- 使用 `eslint --fix` 作为 JS/TS/ASTRO 等代码的自动修复手段；
- 使用 `remark` 或 `markdownlint` 作为 Markdown 的格式化/检查工具；
- 通过 `.editorconfig` 统一基础编辑器行为（缩进、EOL、编码等）；
- 在 CI / 本地钩子中使用 `pnpm` 脚本执行统一格式化流程。

逐步实施计划（按顺序执行）：

1) 初始化与安装（本地）

```bash
# 安装 ESLint 与 antfu 配置及必要插件
pnpm add -D eslint eslint-config-antfu @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-astro eslint-config-prettier

# 安装用于 Markdown 的工具
pnpm add -D remark-cli remark-preset-lint-consistent
````

说明：上面包含 `eslint-config-prettier` 以防后续需要与 Prettier 共存，`eslint-plugin-astro` 用于 Astro 文件支持。

2. 生成/更新 ESLint 配置

- 在仓库根创建或替换为 `.eslintrc.cjs`，内容示例：

```cjs
module.exports = {
  root: true,
  extends: [
    'antfu',
    'plugin:astro/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
    },
  ],
  rules: {
    // 根据项目需要覆盖或禁用部分规则
  },
}
```

注：如果项目不使用 TypeScript，可去掉相关条目。

3. 添加 `.editorconfig`

在项目根添加 `.editorconfig`：

```ini
root = true

[*.{js,ts,jsx,tsx,astro,css,html,md}]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2
```

4. 更新 `package.json` 脚本（使用 pnpm）

- 推荐脚本：

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --ext .js,.ts,.astro --fix",
    "format:md": "remark . -o",
    "format": "pnpm run lint:fix && pnpm run format:md"
  }
}
```

5. 调整 CI 与本地钩子（可选）

- 如果仓库使用 `husky` + `lint-staged`，将 `prettier` 相关条目替换为 `eslint --fix` 与 `remark`，例如：

```json
{
  "lint-staged": {
    "**/*.{js,ts,astro}": ["pnpm run lint:fix"],
    "**/*.md": ["pnpm run format:md"]
  }
}
```

6. 验证流程

- 在本地运行：

```bash
pnpm run lint:fix
pnpm run format:md
```

- 检查 CI 通过并在拉取请求中观察自动修复效果。

补充说明与回退策略：

- 若发现 ESLint 对某些格式（如复杂 HTML/Markdown 换行）支持不足，可临时保留 Prettier 仅用于 Markdown 或特定文件：

```bash
pnpm add -D prettier prettier-plugin-astro prettier-plugin-tailwindcss
```

- 若需要将 Prettier 与 ESLint 集成，安装 `eslint-plugin-prettier` 并在 `.eslintrc.cjs` 中启用 `plugin:prettier/recommended`。

我已经在任务清单中创建步骤并将“采用 antfu ESLint 配置并初始化 ESLint”设为进行中。下一步我可以：

- 直接在仓库中添加 `.eslintrc.cjs`、`.editorconfig` 并更新 `package.json`（会生成补丁）；或
- 先生成供你审阅的补丁。你希望我现在直接应用这些更改吗？
