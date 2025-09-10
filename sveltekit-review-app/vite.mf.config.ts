// vite.mf.config.ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { federation } from '@module-federation/vite';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        // ✅ federation 먼저
        federation({
            name: 'svelteKitReviewApp',
            filename: 'remoteEntry.js',
            exposes: {
                './mount': './src/mf/boot.ts',
                './ReviewWidget': './src/lib/ReviewWidget.svelte',
            },
            // 교차 번들러 공유 이슈 피하기: 비우거나 최소화
            shared: {}
        }),
        svelte(),
    ],
    resolve: {
        dedupe: ['svelte'],
        alias: { $lib: fileURLToPath(new URL('./src/lib', import.meta.url)) }
    },
    server: {
        port: 5174,
        strictPort: true,
        host: true,
        cors: true,
        headers: { 'Access-Control-Allow-Origin': '*' }
    },
    build: {
        target: 'esnext',
        modulePreload: false,
        outDir: 'dist/mf'
    },
    optimizeDeps: {
        // svelte를 미리 번들하지 않게 (드물게 필요한 경우)
        exclude: ['svelte']
    }
});
