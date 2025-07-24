// main-container/vite.config.ts
import { createHash } from 'node:crypto'

// 1) globalThis.crypto 객체 참조 (Node18+ 환경에서 기본으로 존재)
const cg = (globalThis as any).crypto

// 2) hash 메서드가 없으면 createHash를 이용해 흉내 내서 추가
if (cg && typeof cg.hash !== 'function') {
  cg.hash = (algorithm: string, data: string | Uint8Array | ArrayBuffer) => {
    const alg = algorithm.replace(/-/g, '').toLowerCase()
    const h = createHash(alg)

    // data를 Uint8Array로 변환
    const buf: Uint8Array =
      typeof data === 'string'
        ? Buffer.from(data)
        : data instanceof ArrayBuffer
        ? new Uint8Array(data)
        : data

    h.update(buf)
    return h.digest('hex')
  }
}

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { federation } from '@module-federation/vite'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "main_container",
      remotes: {
        "nuxtApp": "nuxtApp@http://localhost:3000/remoteEntry.js",
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.2.0' },
        '@mui/material': { singleton: true, requiredVersion: '^7.0.1' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.30.0' },
      },
    }),
  ],
})
