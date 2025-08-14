// src/router.ts
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// account pages
import AccountLogin from "./account/pages/login/AccountLogin.vue";
import PrivacyAgreement from "./account/pages/login/PrivacyAgreement.vue";
import AccountMy from "./account/pages/my/AccountMy.vue";
import ModifyIndex from "./account/pages/modify/ModifyIndex.vue";
import AccountWithdraw from "./account/pages/withdraw/AccountWithdraw.vue";
import AdminCodeInput from "./account/pages/admin-login/AdminCodeInput.vue";
import GithubAdminLogin from "./account/pages/admin-login/GithubAdminLogin.vue";

// 소셜/게스트 인증 리다이렉션
import KakaoRedirection from "./kakao/redirection/KakaoRedirection.vue";
import GoogleRedirection from "./google/redirection/GoogleRedirection.vue";
import GithubRedirection from "./github/redirection/GithubRedirection.vue";
import GuestRedirection from "./guest/redirection/GuestRedirection.vue";
import NaverRedirection from "./naver/redirection/NaverRedirection.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/account/login", name: "VueAccountLogin", component: AccountLogin },
  { path: "/account/privacy", component: PrivacyAgreement },
  { path: "/account/mypage", component: AccountMy },
  { path: "/account/modify/modify-profile", component: ModifyIndex },
  { path: "/account/withdraw", component: AccountWithdraw },
  { path: "/account/admin-code", component: AdminCodeInput },
  { path: "/account/admin-login", component: GithubAdminLogin },

  // 소셜/게스트 인증 콜백
  { path: "/kakao_oauth/kakao-access-token", component: KakaoRedirection },
  { path: "/google-oauth/redirect-access-token", component: GoogleRedirection },
  { path: "/github-oauth/redirect-access-token", component: GithubRedirection },
  { path: "/guest-oauth/redirect-access-token", component: GuestRedirection },
  { path: "/naver-oauth/redirect-access-token", component: NaverRedirection },

  // fallback: 404 or main
  { path: "/:pathMatch(.*)*", redirect: "/account/login" },
];

const router = createRouter({
  history: createWebHistory("/vue-account/"),
  routes,
});

export default router;
