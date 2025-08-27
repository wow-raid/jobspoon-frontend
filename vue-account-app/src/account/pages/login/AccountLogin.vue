<template>
  <v-container :style="containerStyle">
    <div class="login-wrapper" :style="loginWrapperStyle">
      <div>
        <div class="login_logo" :style="logoStyle"></div>

        <!-- [변경] 인라인 color 제거 -->
        <div class="introduction">
          <p>기업 분석과 AI 모의면접 | 취업 준비는 <b>JOBSTICK</b>에서</p>
        </div>

        <v-divider class="mt-5 mb-7" :thickness="3"></v-divider>

        <!-- 로그인 버튼들 -->
        <v-btn
          :style="guestBtnStyle"
          class="guest-login-btn"
          @click="handleGuestLogin"
        >
          게스트 로그인
        </v-btn>
        <v-btn
          :style="kakaoBtnStyle"
          class="kakao-login-btn"
          @click="() => goToPrivacyAgreementPage('KAKAO')"
        ></v-btn>
        <v-btn
          :style="googleBtnStyle"
          class="google-login-btn"
          @click="() => goToPrivacyAgreementPage('GOOGLE')"
        ></v-btn>
        <v-btn
          :style="naverBtnStyle"
          class="naver-login-btn"
          @click="() => goToPrivacyAgreementPage('NAVER')"
        ></v-btn>

        <!-- 관리자 로그인 -->
        <v-btn
          :style="adminBtnStyle"
          class="admin-login-btn"
          @click="goToAdminLogin"
          block
        ></v-btn>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from "vue-router"
import { useGuestAuthenticationStore } from "../../../guest/stores/guestAuthenticationStore"
import { useHead } from '@vueuse/head'

import loginBg from '@/assets/images/fixed/login_bg61.jpg'
import logo1 from '@/assets/images/fixed/logo1.png'
import kakaoBtn from '@/assets/images/fixed/btn_login_kakao.png'
import googleBtn from '@/assets/images/fixed/btn_login_google.png'
import naverBtn from '@/assets/images/fixed/btn_login_naver.png'
import githubIcon from '@/assets/images/fixed/icon-github.svg'
import {kakaoAuthenticationAction as kakaoAuthentication} from "@/kakao/stores/kakaoAuthenticationActions";

// SEO meta 생략 (그대로 사용)

const router = useRouter()
const guestAuthentication = useGuestAuthenticationStore()

// hover 상태 (필요하면)
const hoverGuest = ref(false)
const hoverKakao = ref(false)
const hoverGoogle = ref(false)
const hoverNaver = ref(false)
const hoverAdmin = ref(false)

const containerStyle = computed(() => ({
  maxWidth: '100vw',
  minHeight: '89vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  // background: `url('${loginBg}') no-repeat center center`,
  backgroundSize: '900px auto',

  // [변경] 전역 글자색: host 변수(--text) 우선, 없으면 Vuetify on-background 사용
  color: 'var(--text, rgb(var(--v-theme-on-background)))',
}))

const logoStyle = computed(() => ({
  height: '20vh',
  marginBottom: '-2vh',
  backgroundImage: `url('${logo1}')`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}))

const loginWrapperStyle = computed(() => ({
  position: 'relative',
  zIndex: 1,
  top: '70px',
  width: '50vh',
  height: '70vh',
  backgroundColor: '#877e7e00',
  borderRadius: '9vh',
  padding: '0vh 10vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  textAlign: 'center',
}))

const btnCommon = {
  width: '100%',
  height: '50px',
  margin: '1.3vh auto',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  borderRadius: '1.4vh',
}

const guestBtnStyle = computed(() => ({
  ...btnCommon,
  backgroundColor: '#00d0ff',
  color: 'white',
}))

const kakaoBtnStyle = computed(() => ({
  ...btnCommon,
  backgroundImage: `url('${kakaoBtn}')`,
  backgroundColor: '#ffea00',
  marginBottom: '1vh',
}))

const googleBtnStyle = computed(() => ({
  ...btnCommon,
  backgroundImage: `url('${googleBtn}')`,
  backgroundColor: '#fff',
  marginBottom: '1vh',
}))

const naverBtnStyle = computed(() => ({
  ...btnCommon,
  backgroundImage: `url('${naverBtn}')`,
  backgroundColor: '#03c75a',
}))

const adminBtnStyle = computed(() => ({
  width: '70px',
  height: '50px',
  backgroundImage: `url('${githubIcon}')`,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  padding: 0,
  margin: '10px auto',
  display: 'block',
  minWidth: 0,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
}))

const goToPrivacyAgreementPage = async (loginType) => {
  sessionStorage.setItem("tempLoginType", loginType)
  await kakaoAuthentication.requestKakaoLoginToDjango(router);
  // router.push("/account/privacy")
}

const handleGuestLogin = async () => {
  try {
    localStorage.setItem("loginType", "GUEST")
    const userToken = await guestAuthentication.requestGuestLoginToDjango()
    localStorage.setItem("userToken", userToken)
    router.push("/")
  } catch (error) {
    console.error("게스트 로그인 실패:", error)
    alert("게스트 로그인에 실패했습니다.")
  }
}

const goToAdminLogin = () => {
  router.push("/account/admin-code")
}
</script>

<style scoped>
/* [추가] 안전망: 소개 문단도 다크/라이트 따라가게 */
.introduction {
  color: var(--text, rgb(var(--v-theme-on-background)));
}
</style>
