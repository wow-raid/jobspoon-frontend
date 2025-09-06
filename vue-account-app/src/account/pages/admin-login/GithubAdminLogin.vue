<!-- src/account/pages/admin-login/GithubAdminLogin.vue -->
<template>
  <div class="grey lighten-5" style="font-family: 'Noto Sans KR', sans-serif">
    <v-container class="white">
      <v-row justify="center">
        <v-col cols="auto" style="padding-bottom: 90px">
          <v-card width="460">
            <v-card-text class="text-center px-12 py-16">
              <div class="text-h4 font-weight-black mb-10">
                GitHub Oauth 로그인
              </div>

              <div class="d-flex">
                <v-img :src="githubIconSrc" width="120" class="mx-auto mb-6" />
              </div>

              <v-btn
                  block
                  x-large
                  rounded
                  color="gray lighten-1"
                  class="mt-6"
                  @click="goToAdminCodeInput"
              >
                로그인
              </v-btn>

              <!-- 필요하면 GitHub로 바로 이동 버튼도 사용 -->
              <!--
              <v-btn
                block
                x-large
                rounded
                color="black"
                class="mt-3"
                @click="goToGithubLogin"
              >
                GitHub로 계속
              </v-btn>
              -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRouter } from "vue-router";
// 별칭(@)이 없다면 아래를 ../../../assets/... 으로 바꿔주세요.
// import githubIconSrc from "@/assets/images/fixed/icon-github.svg";
import githubIconSrc from "../../../assets/images/fixed/icon-github.svg";
import { useGithubAuthenticationStore } from "../../../github/stores/githubAuthenticationStore";

const router = useRouter();
const githubAuthentication = useGithubAuthenticationStore();

// 버튼: 코드 입력 화면으로 이동
const goToAdminCodeInput = () => {
  router.push("/account/admin-code");
};

// (선택) GitHub 로그인 요청
const goToGithubLogin = async () => {
  try {
    await githubAuthentication.requestGithubLoginToDjango();
  } catch (e) {
    console.error("[GithubAdminLogin] GitHub 로그인 요청 실패:", e);
  }
};

/** 메타 유틸 */
function setMeta(
    name: string,
    content: string,
    attr: "name" | "property" = "name"
) {
  let el = document.head.querySelector<HTMLMetaElement>(
      `meta[${attr}="${name}"]`
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

onMounted(() => {
  // ✅ 토큰 검증 로직 제거 → 바로 메타 설정만 실행
  document.title = "관리자 GitHub 로그인 | 잡스틱(JobStick)";
  setMeta(
      "description",
      "잡스틱(JobStick) 관리자 전용 GitHub 계정으로 로그인하여 관리 기능을 이용하세요."
  );
  setMeta(
      "keywords",
      "관리자 로그인, GitHub 로그인, JobStick 관리자, Admin GitHub Login, JobStick, job-stick, 잡스틱, 개발자 플랫폼, 개발자 취업, 모의 면접, AI 면접"
  );
  setMeta("og:title", "잡스틱(JobStick) 관리자 GitHub 로그인", "property");
  setMeta(
      "og:description",
      "잡스틱(JobStick)의 관리자용 페이지입니다. GitHub 계정으로 안전하게 로그인하세요.",
      "property"
  );
  setMeta("og:image", "/assets/images/fixed/icon-github.svg", "property");
  setMeta("robots", "noindex, nofollow");
});
</script>

<style scoped>
/* 필요 시 추가 스타일 */
</style>
