const antfu = require('@antfu/eslint-config').default

module.exports = antfu(
  {
    // 启用 Astro 支持
    astro: true,
    // 启用 TypeScript 支持
    typescript: true,
    // 暂停 Markdown lint，避免 @eslint/markdown 8 在 ESLint 10 下的运行时错误
    markdown: false,
  },
  {
    // 针对所有文件的自定义规则
    files: ['**/*.{js,cjs,mjs,ts,tsx,astro}'],
    rules: {
      // 在这里覆写规则
    },
  },
  {
    // 忽略文件
    ignores: ['node_modules/**', 'dist/**'],
  },
)
