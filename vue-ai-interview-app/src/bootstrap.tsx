import { createApp, h } from "vue";
import type { App as VueApp } from "vue";
import App from "./App.vue";
import { loadFonts } from "./plugins/webfontloader";

import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import * as labsComponents from "vuetify/labs/components";
import { createVuetify } from "vuetify/lib/framework.mjs";
import { createPinia } from "pinia";
import router from "./router";

let app: VueApp<Element> | null = null;

export const vueAccountAppMount = (el: string | Element, eventBus: any) => {
    const container = typeof el === "string" ? document.querySelector(el) : el;
    if (!container) return;
    container.innerHTML = "";
    const shadowRoot = container.attachShadow({ mode: "open" });

    // Vuetify/mdi CSS를 ShadowRoot에 동적으로 fetch/주입
    injectVuetifyCssIntoShadow(shadowRoot);

    // Vue mount용 div
    const shadowAppRoot = document.createElement("div");
    shadowAppRoot.classList.add("v-application", "v-theme--light");
    shadowRoot.appendChild(shadowAppRoot);

    loadFonts().then(() => {
        const vuetify = createVuetify({
            components: { ...components, ...labsComponents },
            directives: { ...directives },
            icons: { defaultSet: "mdi", aliases, sets: { mdi } },
            theme: {
                defaultTheme: "light",
                themes: {
                    light: {
                        dark: false,
                        colors: {
                            primary: "#1976D2",
                            error: "#D32F2F",
                            background: "#FFFFFF",
                            surface: "#FFFFFF",
                            "on-primary": "#FFFFFF",
                            "on-surface": "#000000",
                        },
                    },
                },
                variations: {
                    colors: ["primary", "error"],
                    lighten: 5,
                    darken: 5,
                },
            },
        });

        app = createApp({
            render: () => h(App, { eventBus }),
        });

        const pinia = createPinia();
        app.use(vuetify).use(router).use(pinia);
        app.provide("eventBus", eventBus);

        eventBus.on("vue-account-routing-event", (path: string) => {
            if (router.currentRoute.value.fullPath !== path) {
                router.push(path);
            }
        });

        app.mount(shadowAppRoot);
    });
};

// ShadowRoot에 Vuetify/mdi css fetch해서 style로 삽입
async function injectVuetifyCssIntoShadow(shadowRoot: ShadowRoot) {
    const [vuetifyCss, mdiCss] = await Promise.all([
        fetch("https://cdn.jsdelivr.net/npm/vuetify@3.9.0/dist/vuetify.min.css").then(r => r.text()),
        fetch("https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css").then(r => r.text()),
    ]);
    const style = document.createElement("style");
    style.textContent = `
    :host, .v-theme--light {
      --v-theme-primary: #1976D2;
      --v-theme-error: #D32F2F;
      --v-theme-background: #FFFFFF;
      --v-theme-surface: #FFFFFF;
      --v-theme-on-primary: #FFFFFF;
      --v-theme-on-error: #FFFFFF;
      --v-theme-on-surface: #000000;
    }
    ${vuetifyCss}
    ${mdiCss}
  `;
    shadowRoot.appendChild(style);
}

export const vueAccountAppUnmount = () => {
    if (app) {
        app.unmount();
        app = null;
    }
};
