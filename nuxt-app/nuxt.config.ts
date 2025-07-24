import { defineNuxtConfig } from "nuxt/config";
import { federation } from "@module-federation/vite";

export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      // title: 'JOBSTICK',
      titleTemplate: "%s JOBSTICK",
      meta: [
        // 페이지 인코딩 설정
        { charset: "utf-8" },

        // 뷰포트 설정
        {
          name: "viewport",
          content:
            "width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no",
        },

        // 페이지 설명
        {
          name: "description",
          content:
            "JOBSTICK - AI 모의 기술 면접을 통해 취업 경쟁력을 높이세요!",
        },

        // SEO 키워드 설정
        {
          hid: "keywords",
          name: "keywords",
          content:
            "취업 준비, 면접 준비, 개발자 취업 준비, 개발자 이직 준비, 개발자 취업 사이트, IT취업, IT 회사, aiv 모의면접, aiv ai 모의 JOBSTICK, JOBSTICK 기업 분석, JOBSTICK 기업 요약",
        },

        // Open Graph Title : 페이지가 SNS에서 공유될 때 표시될 제목 설정
        {
          property: "og:title",
          content: "JOBSTICK | 기업 핵심 정보 분석 및 AI 모의면접",
        },

        // Open Graph Description : SNS에서 페이지가 공유될 때 표시될 설명을 제공
        {
          property: "og:description",
          content:
            "귀찮았던 기업 분석, 나 혼자 하기 힘든 면접 준비 JOBSTICK이 도와드리겠습니다!",
        },

        // Open Graph Image : 소셜 미디어에서 페이지가 공유될 때 함께 표시될 이미지를 지정
        {
          property: "og:image",
          content: "./public/favicon.png",
        },

        // Open Graph Type : 컨텐츠의 유형을 정의
        {
          property: "og:type",
          content: "website",
        },

        // robots : 검색 엔진 크롤러에게 페이지의 인덱싱과 링크 추적 허용 여부를 지시
        {
          hid: "robots",
          name: "robots",
          content: "index, follow",
        },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" }, // favicon 설정
      ],
    },
  },

  // pages:true,
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  extends: [
    "./ai-interview/nuxt.config.ts",
    "./account/nuxt.config.ts",
    "./kakaoAuthentication/nuxt.config.ts",
    "./naverAuthentication/nuxt.config.ts",
    "./review/nuxt.config.ts",
    "./company-report/nuxt.config.ts",
    "./googleAuthentication/nuxt.config.ts",
    "./cart/nuxt.config.ts",
    "./order/nuxt.config.ts",
    "./payments/nuxt.config.ts",
    "./management/nuxt.config.ts",
    "./githubAuthentication/nuxt.config.ts",
    "./authentication/nuxt.config.ts",
    "./interview-ready/nuxt.config.ts",
    "./guestAuthentication/nuxt.config.ts",
    "./admin/nuxt.config.ts",
    "./membership/nuxt.config.ts",
  ],
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.min.css",
    "@/assets/css/global.css", // ✅ 너가 만든 global.css 추가
  ],

  build: {
    transpile: ["vuetify"], // Vuetify를 빌드 시 트랜스파일링
  },

  vite: {
    plugins: [
      federation({
        name: "nuxtApp",
        filename: "remoteEntry.js",
        exposes: {
          // 호스트에서 import("nuxtApp/bootstrap") 으로 부트스트랩 진입점 사용
          "./bootstrap": "./bootstrap.ts",
        },
        library: {
          type: "var", // var 방식으로 번들링
          name: "nuxtApp", // window.nuxtApp 에 할당
        },
        shared: {
          vue: { singleton: true, requiredVersion: "^3.5.12" },
          "vue-router": { singleton: true, requiredVersion: "latest" },
          vuetify: { singleton: true, requiredVersion: "^3.7.3" },
        },
      }),
    ],
    optimizeDeps: {
      include: ["@tosspayments/payment-widget-sdk"],
    },
    ssr: {
      noExternal: ["vuetify"], // SSR에서도 Vuetify를 외부 패키지로 처리하지 않도록 설정
    },
  },

  modules: [
    "vuetify-nuxt-module",
    "@pinia/nuxt",
    "~/ai-interview/index.ts",
    "~/account/index.ts",
    "~/kakaoAuthentication/index.ts",
    "~/naverAuthentication/index.ts",
    "~/review/index.ts",
    "~/company-report/index.ts",
    "~/googleAuthentication/index.ts",
    "~/cart/index.ts",
    "~/order/index.ts",
    "~/payments/index.ts",
    "~/management/index.ts",
    "~/githubAuthentication/index.ts",
    "~/authentication/index.ts",
    "~/interview-ready/index.ts",
    "~/guestAuthentication/index.ts",
    "~/admin/index.ts",
    "~/membership/index.ts",
  ],
  components: {
    dirs: [
      "~/components", // 기본 컴포넌트 경로
      "~/navigationBar", // 파일 경로가 아닌 디렉터리 경로로 수정
    ],
  },
  imports: {
    dirs: ["./stores"],
  },

  runtimeConfig: {
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME,
    GA_MEASUREMENT_ID: process.env.VUE_APP_GA_MEASUREMENT_ID,
    TOSS_SECRET_KEY: process.env.TOSS_SECRET_KEY,
    AI_BASE_URL: process.env.VUE_APP_AI_BASE_URL,

    public: {
      MAIN_API_URL: process.env.VUE_APP_BASE_URL,
      TOSS_CLIENT_KEY: process.env.TOSS_CLIENT_KEY,
    },
  },

  plugins: ['~/plugins/vgtag.js',
    { src: '~/plugins/webfontloader.client.ts', mode: 'client' }],
});
