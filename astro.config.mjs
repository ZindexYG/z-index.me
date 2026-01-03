import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import pagefind from "astro-pagefind";

import { defineConfig } from 'astro/config'

import { SITE_URL } from './src/consts'



// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [mdx(), sitemap(), pagefind()],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'catppuccin-latte',
        dark: 'catppuccin-mocha',
      },
    },
  },
})
