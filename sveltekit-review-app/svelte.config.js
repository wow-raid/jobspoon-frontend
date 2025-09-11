// svelte.config.js
import adapter from '@sveltejs/adapter-static';

const config = {
  compilerOptions: {
    compatibility: { componentApi: 4 }   // ⬅️ 이 줄 추가
  },
  kit: {
    adapter: adapter({
      pages: 'build-static',
      assets: 'build-static',
      precompress: true
    }),
    prerender: {
      entries: ['/', '/ai-interview', '/ai-interview/guide', '/ai-interview/faq', '/sitemap.xml', '/robots.txt']
    }
  }
};
export default config;
