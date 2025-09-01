<template>
  <div >
    <img :src="Logo" alt="Logo" style="width: 180px; height: 70px; object-fit: contain;" @click="goHome">
  </div>


  <div class="w-full flex items-center justify-center min-h-screen bg-white">

    <!-- 왼쪽 로그인 영역 -->
    <div class="w-1/2">
      <!-- 소개 텍스트 -->
      <div class="p-10">
        SingIn

      <!-- 로그인 버튼들 -->
      <!--
      <v-btn
        :style="guestBtnStyle"
        class="guest-login-btn"
        @click="handleGuestLogin"
      >
        게스트 로그인
      </v-btn>
      -->
      <v-btn
          class="w-full h-12 mb-2 bg-yellow-400 bg-no-repeat bg-center bg-contain"
          :style="{ backgroundImage: `url(${kakaoBtn})` }"
          @click="() => goToPrivacyAgreementPage('KAKAO')"
      ></v-btn>


        <!--
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
        -->

      <!-- 관리자 로그인 -->
      <v-btn
          :style="adminBtnStyle"
          class="admin-login-btn"
          @click="goToAdminLogin"
      ></v-btn>
    </div>
    </div>


    <!-- 오른쪽 이미지 영역 -->
    <div class="w-1/2 flex items-center justify-center min-h-screen bg-white">
      <div class="image-content">이미지</div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue'
import { useRouter } from "vue-router"
import { useGuestAuthenticationStore } from "../../../guest/stores/guestAuthenticationStore"
import { useHead } from '@vueuse/head'
import '../../../assets/tailwind.css'
import loginBg from '@/assets/images/fixed/login_bg61.jpg'
import logo1 from '@/assets/images/fixed/logo1.png'
import Logo from '@/assets/images/fixed/Logo.png'
import kakaoBtn from '@/assets/images/fixed/btn_login_kakao.png'
import googleBtn from '@/assets/images/fixed/btn_login_google.png'
import naverBtn from '@/assets/images/fixed/btn_login_naver.png'
import githubIcon from '@/assets/images/fixed/icon-github.svg'
import {kakaoAuthenticationAction as kakaoAuthentication} from "@/kakao/stores/kakaoAuthenticationActions";
import {useNavigate} from "react-router-dom";

// SEO meta 생략 (그대로 사용)

const router = useRouter()
const guestAuthentication = useGuestAuthenticationStore()

// hover 상태 (필요하면)
const hoverGuest = ref(false)
const hoverKakao = ref(false)
const hoverGoogle = ref(false)
const hoverNaver = ref(false)
const hoverAdmin = ref(false)

function goHome() {
  console.log("go home")
  window.location.href = '/'
}


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
  await kakaoAuthentication.requestKakaoLoginToSpring(router);
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
