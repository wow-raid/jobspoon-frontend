import { defineNuxtModule } from "@nuxt/kit";
import { resolve } from "path";

export default defineNuxtModule({
  meta: {
    name: "review",
    configKey: "review",
  },

  setup(moduleOptions, nuxt) {
    const themeDir = resolve(__dirname, "..");

    nuxt.hook("pages:extend", (pages) => {
      pages.push(
        {
          name: "ReviewRegisterPage",
          path: "/review/register",
          file: resolve(themeDir, "review/pages/register/review-register.vue"),
        },
        {
          name: "reviewReadPage",
          path: "/review/read/:reviewId",
          file: resolve(themeDir, "review/pages/read/review-read.vue"),
        },
        {
          name: "ReviewCreatedPage",
          path: "/review/created",
          file: resolve(themeDir, "review/pages/created/review-created.vue"),
        },
        {
          name: "ReviewListPage",
          path: "/review/list",
          file: resolve(themeDir, "review/pages/list/review-list.vue"),
        },
        {
          name: "ReviewUpdatePage",
          path: "/review/update/:reviewId",
          file: resolve(themeDir, "review/pages/update/review-update.vue"),
        },
        {
          name: "ReviewResultPage",
          path: "/review/result/:reviewId",
          file: resolve(themeDir, "review/pages/result/review-result.vue"),
        }
      );
    });

    nuxt.hook("imports:dirs", (dirs) => {
      dirs.push(resolve(__dirname, "store"));
    });
  },
});
