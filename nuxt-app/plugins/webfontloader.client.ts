// nuxt-app/plugins/webfontloader.client.ts
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  // 클라이언트에서만 webfontloader를 동적으로 가져와 실행
  if (process.client) {
    import('webfontloader').then((WebFont) => {
      WebFont.load({
        google: {
          families: ['Roboto:100,300,400,500,700,900'],
        },
      })
    })
  }
})
