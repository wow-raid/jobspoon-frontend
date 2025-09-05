import adapter from '@sveltejs/adapter-node';

const config = {
	kit: {
		adapter: adapter(),
		// MF만 쓰고 정적 프리렌더 안 할 거면 빈 엔트리로 두는 게 안전
		prerender: { entries: [] }
	}
};
export default config;
