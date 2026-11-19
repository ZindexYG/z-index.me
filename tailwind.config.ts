import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', ...defaultTheme.fontFamily.sans],
        mono: ['\'Geist Mono\'', ...defaultTheme.fontFamily.mono],
      },
      colors: {
        bgdefault: '#2c2c2c',
        fontdefault: '#e6e1dc',
      },
    },
  },
  plugins: [],
}

export default config
