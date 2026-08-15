import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://bytetitan-star.github.io',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      // Match the dark code-block chrome in global.css.
      // Dual light/dark themes previously painted github-light text onto a near-black pre.
      theme: 'github-dark',
      wrap: false
    }
  }
});
