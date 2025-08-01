<template>
  <v-container
    :style="`background: url('${loginBg}') no-repeat center center; background-size: 900px auto; max-width: 100vw; min-height: 89vh;`"
  >
    <div class="login-wrapper">
      <div>
        <div class="login_logo" :style="`background-image: url('${logo1}');`"></div>
        <div class="introduction" style="color: black">
          <p>기업 분석과 AI 모의면접 | 취업 준비는 <b>JOBSTICK</b>에서</p>
        </div>
        <v-divider class="mt-5 mb-7" :thickness="3"></v-divider>

        <v-btn class="guest-login-btn" @click="handleGuestLogin('GUEST')">게스트 로그인</v-btn>
        <v-btn class="kakao-login-btn" @click="goToPrivacyAgreementPage('KAKAO')" :style="`background-image: url('${kakaoBtn}');`"></v-btn>
        <v-btn class="google-login-btn" @click="goToPrivacyAgreementPage('GOOGLE')" :style="`background-image: url('${googleBtn}');`"></v-btn>
        <v-btn class="naver-login-btn" @click="goToPrivacyAgreementPage('NAVER')" :style="`background-image: url('${naverBtn}');`"></v-btn>
        <v-btn class="admin-login-btn" @click="goToAdminLogin" block :style="`background-image: url('${githubIcon}');`"></v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useGuestAuthenticationStore } from "../../../guest/stores/guestAuthenticationStore";
import { useHead } from '@vueuse/head';

import loginBg from '@/assets/images/fixed/login_bg61.jpg';
import logo1 from '@/assets/images/fixed/logo1.png';
import kakaoBtn from '@/assets/images/fixed/btn_login_kakao.png';
import googleBtn from '@/assets/images/fixed/btn_login_google.png';
import naverBtn from '@/assets/images/fixed/btn_login_naver.png';
import githubIcon from '@/assets/images/fixed/icon-github.svg';

// SEO meta
useHead({
  title: "로그인 | 잡스틱(JobStick)",
  meta: [
    { name: "description", content: "잡스틱(JobStick)에 로그인하고 다양한 개인 맞춤형 서비스를 이용해보세요." },
    { name: "keywords", content: "잡스틱(JobStick) 로그인, 계정 로그인, 회원 로그인, 게스트 로그인, JobStick, job-stick, 잡스틱, 개발자 플랫폼, 개발자 취업, 모의 면접, AI 면접" },
    { name: "robots", content: "index, follow" },
    { property: "og:title", content: "로그인 - 잡스틱(JobStick)" },
    { property: "og:description", content: "잡스틱(JobStick)에 로그인하여 추천 컨텐츠 및 맞춤형 기능을 체험해보세요." },
    { property: "og:image", content: "" }
  ]
});

const router = useRouter();
const guestAuthentication = useGuestAuthenticationStore();

const goToPrivacyAgreementPage = (loginType) => {
  sessionStorage.setItem("tempLoginType", loginType);
  router.push("/account/privacy");
};

const handleGuestLogin = async () => {
  try {
    localStorage.setItem("loginType", "GUEST");
    const userToken = await guestAuthentication.requestGuestLoginToDjango();
    localStorage.setItem("userToken", userToken);
    router.push("/");
  } catch (error) {
    console.error("게스트 로그인 실패:", error);
    alert("게스트 로그인에 실패했습니다.");
  }
};

const goToAdminLogin = () => {
  router.push("/account/admin-code");
};

// ⭐ 커스텀 CSS를 ShadowRoot에 직접 주입
const customCss = `
.login-wrapper {
  position: relative;
  z-index: 1;
  top: 70px;
  width: 50vh;
  height: 70vh;
  background-color: #877e7e00;
  border-radius: 9vh;
  padding: 0vh 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.login_logo {
  height: 20vh;
  margin-bottom: -2vh;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.v-btn {
  width: 100%;
  height: 50px;
  margin: 1.3vh auto;
}
.guest-login-btn {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #00d0ff;
  border-radius: 1.4vh;
}
.kakao-login-btn {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #ffea00;
  margin-bottom: 1vh;
  border-radius: 1.4vh;
}
.google-login-btn {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #fff;
  margin-bottom: 1vh;
  border-radius: 1.4vh;
}
.naver-login-btn {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: #03c75a;
  border-radius: 1.4vh;
}
.admin-login-btn {
  width: 70px;
  height: 50px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  background-color: transparent;
  box-shadow: none;
  padding: 0;
  margin: 10px auto;
  display: block;
  min-width: 0;
}
`;

onMounted(() => {
  const root = document.querySelector('#vue-account-app');
  const shadowRoot = root?.shadowRoot;
  if (shadowRoot && !shadowRoot.querySelector('style[data-account-login]')) {
    const style = document.createElement('style');
    style.setAttribute('data-account-login', 'true');
    style.textContent = customCss;
    shadowRoot.appendChild(style);
  }
});
</script>
