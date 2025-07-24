import { createApp, h } from 'vue'
import App from './app.vue'                    // 최상위 app.vue 이용
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify/lib/framework.mjs'

let app: ReturnType<typeof createApp> | null = null

export function mount(el: Element) {
  if (app) return
  const vuetify = createVuetify({
    components: { /* 필요시 labsComponents 등도 */ },
    directives: { /* … */ },
  })
  app = createApp({ render: () => h(App) })
  app.use(vuetify)
  app.mount(el)
}

export function unmount() {
  if (!app) return
  app.unmount()
  app = null
}