import sitemap from '@astrojs/sitemap'
import pagefind from "astro-pagefind";

import { defineConfig } from 'astro/config'

import { SITE_URL } from './src/consts'

import remarkFigureCaption from '@microflash/remark-figure-caption';
import remarkDirective from 'remark-directive';
import remarkCalloutDirectives from "./src/components/mdrenders/remark-callout-directives-customized.mjs"
import remarkNeoDB from "./src/components/mdrenders/remark-neodb-card.mjs"
import { remarkModifiedTime } from './src/components/mdrenders/remark-modified-time.mjs';

import astroExpressiveCode from 'astro-expressive-code'

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [
    astroExpressiveCode({
      // Replace the default themes with a custom set of bundled themes:
      // "dracula" (a dark theme) and "solarized-light"
      themes: ['andromeeda', 'dracula'],
      wrap: true,
      styleOverrides: {
        // 2. 设置代码块最大宽度为 80ch (约 80 个字符宽度)
        // 如果你希望它在窄屏下自适应，但在宽屏下限制宽度，可以使用这个设置
        codeMaxWidth: '80ch',
        // 也可以设置字体大小以确保 80ch 的视觉效果
        codeFontSize: '0.875rem',
      },
    }),
    sitemap(),
    pagefind()
  ],
  markdown: {
    // shikiConfig: {
    //   themes: {
    //     light: 'catppuccin-latte',
    //     dark: 'catppuccin-mocha',
    //   },
    // },
    remarkPlugins: [
      remarkFigureCaption,
      remarkNeoDB,
      remarkDirective,
      remarkCalloutDirectives,
      remarkModifiedTime
    ],
  },
})
