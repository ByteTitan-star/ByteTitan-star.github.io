import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { remarkI18nSplit } from './src/utils/remark-i18n-split.mjs';

export default defineConfig({
  site: 'https://bytetitan-star.github.io',
  integrations: [mdx()],
  markdown: {
    remarkPlugins: [remarkI18nSplit],
    shikiConfig: {
      // Match the dark code-block chrome in global.css.
      // Dual light/dark themes previously painted github-light text onto a near-black pre.
      theme: 'github-dark',
      wrap: false
    }
  }
});
