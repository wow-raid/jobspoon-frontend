// vite.config.ts
import { sveltekit } from '@sveltejs/kit/vite'
import federation from '@originjs/vite-plugin-federation'
import { defineConfig } from 'vite'

export default defineConfig({
	plugins: [
		sveltekit(),
		federation({
			name: 'svelteReviewApp',
			filename: 'remoteEntry.js',
			exposes: {
				'./App': './src/lib/ReviewWidget.svelte',
				// './boot': './src/mf/boot.ts', // (선택)
			},
			// ✅ 최소형: 배열 혹은 버전 문자열로만
			shared: [
				'svelte',
				// 'three' // Remote에서 실제로 쓰면 추가
			],
			// 또는
			// shared: {
			//   svelte: '^4.0.0',
			//   // three: '^0.177.0'
			// }
		})
	],
	resolve: {
		// (권장) 혹시 모듈 중복을 더 강하게 막고 싶으면 dedupe
		dedupe: ['svelte']
	},
	build: { target: 'esnext', modulePreload: false },
	server: { port: 5173, cors: true }
})
