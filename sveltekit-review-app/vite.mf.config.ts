// vite.mf.config.ts
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import federation from '@originjs/vite-plugin-federation';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [
        svelte(),
        federation({
            name: 'svelteKitReviewApp',
            filename: 'remoteEntry.js',
            exposes: { './App': './src/lib/index.ts' },
            shared: ['svelte']
        })
    ],
    resolve: {
        dedupe: ['svelte'],
        alias: { $lib: fileURLToPath(new URL('./src/lib', import.meta.url)) }
    },
    server: {
        port: 5174,
        strictPort: true,     // ← 포트 점유 시 실패(자동 변경 방지)
        host: true,           // ← 외부 접근 허용(호스트 프로세스에서 접근 가능)
        cors: true,
        headers: { 'Access-Control-Allow-Origin': '*' }
    },
    build: {
        target: 'esnext',
        modulePreload: false,
        outDir: 'dist/mf'
    }
});
