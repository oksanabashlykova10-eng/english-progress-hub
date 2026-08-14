import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const githubPagesAssets = (base) => ({
  name: 'github-pages-public-assets',
  enforce: 'pre',
  transform(code, id) {
    if (!/\.[jt]sx?$/.test(id) || !id.includes('/src/')) return null;
    const prefixed = `${base}assets/`;
    return {
      code: code
        .replaceAll("'/assets/", `'${prefixed}`)
        .replaceAll('"/assets/', `"${prefixed}`)
        .replaceAll('`/assets/', `\`${prefixed}`),
      map: null,
    };
  },
});

const base = '/english-progress-hub/';

export default defineConfig({
  plugins: [githubPagesAssets(base), react()],
  base,
});
