<template>
  <div class="fixed top-0 left-0 p-4 z-50">
    <img :src="Logo" alt="Logo" style="width: 180px; height: 70px; object-fit: contain;" @click="goHome">
  </div>


  <div class="w-full overflow-hidden flex items-center justify-center min-h-screen bg-white">

    <!-- 왼쪽 로그인 영역 -->
    <div class="w-1/2 h-full flex items-center justify-center ml-12">
      <!-- 컨테이너 전체 -->
      <div class="w-2/3 pt-10 mt-10 pl-5 flex flex-col items-start">

        <!-- 상단 텍스트 -->
        <div class="text-[28px] font-bold mb-2">
          Sign In
        </div>
        <div class="text-gray-500 text-sm mb-1">
          If you don’t have an account register
        </div>
        <div class="text-gray-500 text-sm mb-6">
          You can Register here!
        </div>

        <!-- 이메일/비밀번호 입력 폼 -->
        <form class="flex flex-col mt-7 gap-6 w-full">
          <!-- 이메일 -->
          <div class="flex flex-col w-full max-w-[350px]">
            <label class="text-gray-400 text-[12px]" for="email">
              Email
            </label>
            <input
                id="email"
                type="email"
                placeholder="📧 Enter your email address"
                class="w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2 placeholder-gray-400"
            />
          </div>

          <!-- 비밀번호 -->
          <div class="flex flex-col mt-10 w-full max-w-[350px]">
            <label class="text-gray-400 text-[12px]" for="password">
              Password
            </label>
            <input
                id="password"
                type="password"
                placeholder="🔒 Enter your password"
                class="w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2 placeholder-gray-400"
            />
          </div>
          <div class="flex items-center max-w-[350px]">
            <input
                id="remember"
                type="checkbox"
                class="mt-4 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label for="remember" class="text-gray-500 text-[12px] mt-4 select-none">
              Remember me
            </label>
          </div>

          <!-- 로그인 버튼 -->
          <button
              type="submit"
              class="w-full max-w-[350px] mt-6 py-3 text-white font-semibold rounded-xl transition-colors"
              style="background-color: #2563eb;"
              @click="triggerSocialLogin"
          >
            Log In
          </button>
        </form>








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
        <div class="w-full pr-16 flex justify-center my-6 text-sm font-medium" style="color: #9CA3AF !important;">
          or continue with
        </div>





        <!-- Kakao Login Button -->
        <button
            class="w-full max-w-[350px] h-[50px] bg-yellow-400 rounded-[1.4vh] flex items-center justify-center hover:bg-yellow-500 transition-colors"
            @click="() => goToPrivacyAgreementPage('KAKAO')"
        >
          <img :src="kakaoBtn" alt="Kakao Login" class="h-3/4 object-contain" />
        </button>





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
<!--      <v-btn-->
<!--          :style="adminBtnStyle"-->
<!--          class="admin-login-btn"-->
<!--          @click="goToAdminLogin"-->
<!--      ></v-btn>-->
    </div>
    </div>


    <!-- 오른쪽 이미지 영역 -->
    <div class="w-[64%] mr-5 flex items-center justify-center bg-[#181824] rounded-xl overflow-hidden"
         style="height: calc(100vh - 4rem);">
      <img :src="LoginImage" class="w-full h-full object-contain" />
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
import LoginImage from '@/assets/images/fixed/LoginImage.png'
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

function triggerSocialLogin() {
  alert("준비중입니다 소셜 로그인을 이용해주세요");
  console.log("확인 눌렀음");
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
