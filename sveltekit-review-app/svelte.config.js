import adapter from '@sveltejs/adapter-static';

const config = {
	kit: {
		adapter: adapter({
			pages: 'build-static',   // 산출물 폴더명
			assets: 'build-static',
			precompress: true
		}),
		prerender: {
			entries: [
				'/',                    // 필요시
				'/ai-interview',
				'/ai-interview/guide',
				'/ai-interview/faq',
				'/sitemap.xml',
				'/robots.txt'
			]
		}
	}
};
export default config;
