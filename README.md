
![logo](public/logo.png)

# z-index.me

z-index.me is an opinionated and extremely minimal blogging template built with Astro and Tailwind CSS. Design is heavily inspired by [jrmyphlmn.com](https://jrmyphlmn.com/).

To use this template, check out the GitHub repository:

https://github.com/ZindexYG/z-index.me

Key features
- Blog post authoring using Markdown and MDX (`@astrojs/mdx`)
- Lightweight styling with Tailwind CSS
- RSS and sitemap generation (`@astrojs/rss`, `@astrojs/sitemap`)
- OpenGraph image support and SEO-friendly defaults
- Dark mode and accessible transitions

Quick start
1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Lint and fix code:

```bash
npm run lint
npm run lint:fix
```

Notes about formatting and linting
- ESLint is configured via `eslint.config.cjs` and `@antfu/eslint-config` (flat config).
- There is a `format:md` script that runs `remark . -o`; install `remark-cli` if you use it or remove/update the script.

Where to edit
- Site metadata: `src/consts.ts`
- Posts: `src/content/posts/` (Markdown / MDX)
- Layouts/components: `src/layouts`, `src/components`
- Global styles: `src/styles/global.css`

Static assets
- Files placed under `public/` are served at the site root. Example: `public/static/blog-placeholder.svg` → `/static/blog-placeholder.svg`.

## License

MIT
