// ~/plugins/webfontloader.client.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin(async () => {
    // 이 함수 자체도 클라이언트에서만 실행됨
    const WebFont = await import('webfontloader')
    WebFont.load({
        google: {
            families: ['Roboto:100,300,400,500,700,900'],
        },
    })
})
