# Repository Guidelines

## Project Structure & Module Organization

This is an Astro blog using Tailwind CSS. `src/pages/` owns routes for posts, search, RSS, robots, and library pages. `src/layouts/` contains page shells, while `src/components/` holds reusable Astro UI and Markdown renderers under `src/components/mdrenders/`. `src/content/posts/` stores Markdown/MDX posts validated by `src/content/config.ts`; post frontmatter should include `title` and `pubDate`, with `description`, `image`, and `tags` optional. `src/styles/` contains global and callout CSS. `src/data/douban/` stores library JSON data. `public/` contains static assets, with post covers in `public/posts/` and library images in `public/library/`. There is no test directory yet; add focused tests near the feature or under a future `tests/`.

## Build, Test, and Development Commands

- `pnpm install --frozen-lockfile`: install dependencies exactly from `pnpm-lock.yaml`.
- `pnpm run dev`: start the Astro development server.
- `pnpm run build`: run `astro check` and build production output into `dist/`.
- `pnpm run preview`: serve the built site locally.
- `pnpm run lint`: run ESLint across the repository.
- `pnpm run lint:fix`: apply safe ESLint fixes.
- `pnpm run format:md`: format Markdown through remark; confirm the CLI is available first.

## Coding Style & Naming Conventions

Use UTF-8, LF line endings, final newlines, trimmed trailing whitespace, and 2-space indentation as defined in `.editorconfig`. The project uses ESM and TypeScript where appropriate. Follow `@antfu/eslint-config` with Astro, TypeScript, and Markdown support. Prefer `PascalCase.astro` for components, Astro route naming in `src/pages/`, and lowercase kebab-case for post slugs and asset filenames.

## Testing Guidelines

No dedicated test framework is configured. For code changes, run `pnpm run lint` and `pnpm run build` before opening a PR; `build` is the main type and content validation path. For Markdown-only edits, run `pnpm exec eslint path/to/file.md` or `pnpm run lint` if scope is unclear. Add new validation commands to `package.json` and this guide.

## Commit & Pull Request Guidelines

Recent commits use short imperative messages, often with `feat:` or `fix:` prefixes, plus occasional `Update ...` content/data commits. Prefer `feat: add search filter`, `fix: correct rss URL`, or `Update recent.json with movie entries`. PRs should include what changed, why, linked issues when available, validation commands run, and screenshots for visible UI changes. Keep content, data, and media updates separate from behavior changes when practical.

## Security & Configuration Tips

Do not commit secrets. Deployment expects `DEPLOY_TOKEN` in GitHub Actions. Keep `SITE_URL` and public asset paths stable because RSS, sitemap, and OpenGraph metadata use them.
