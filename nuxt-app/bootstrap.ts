import { createApp, h } from 'vue'
// *SPA‑전용* 클라이언트 엔트리만 import
import App from './.output/client/index.mjs'
import { createRouter, createWebHistory } from "vue-router";
// Vite‐dev 에서도 '#nuxt/routes' alias 로 잡아 줍니다
import routes from "#nuxt/routes";
import { createPinia } from "pinia";
import { createVuetify } from "vuetify/lib/framework.mjs";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// 기존에 만드신 웹폰트 로더 플러그인
import webfontloaderPlugin from "./plugins/webfontloader.client";

// Vuetify 스타일/아이콘
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

let app: VueApp<Element> | null = null;
let router: ReturnType<typeof createRouter> | null = null;

export async function mountNuxtApp(el: string | Element) {
  if (app) return;

  // 1) WebFont load
  await webfontloaderPlugin();

  // 2) Pinia
  const pinia = createPinia();

  // 3) Router
  router = createRouter({
    history: createWebHistory(window.location.pathname),
    routes
  });

  // 4) Vuetify
  const vuetify = createVuetify({ components, directives });

  // 5) 실제 Nuxt SPA 엔트리
  app = createApp({ render: () => h(App) });
  app.use(pinia);
  app.use(router);
  app.use(vuetify);
  app.mount(el);
}

export function unmountNuxtApp() {
  if (!app) return;
  app.unmount();
  app = null;
  router = null;
}
