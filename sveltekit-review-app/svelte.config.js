// svelte.config.js
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Svelte5 + Svelte4 컴포넌트 호환 사용 중이면 유지
  compilerOptions: {
    compatibility: { componentApi: 4 }
  },
  kit: {
    adapter: adapter({
      pages: 'build-static',
      assets: 'build-static',
      fallback: undefined,   // SPA fallback 끔 (정적 페이지 우선)
      precompress: true
    }),
    paths: { base: '' },
    prerender: {
      crawl: true,
      entries: ['*', '/sitemap.xml', '/robots.txt'],
      handleHttpError: ({ status, path, referrers }) => {
        // 프리렌더 중 404 링크는 스킵(원하는 경우만 엄격화)
        if (status === 404) return;
        throw new Error(`Prerender ${status} on ${path} from ${referrers?.join(',')}`);
      }
    }
    // ❌ trailingSlash: 'never'  ← 이 줄을 제거해야 함
  }
};

export default config;
