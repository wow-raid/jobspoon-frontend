<template>
  <v-container class="container">
    <div class="id-card-container">
      <v-card class="id-card mx-auto">
        <!-- <div class="company-name" >JOBSTICK</div> -->
        <v-avatar size="120px" class="mt-8 avatar-margin">
          <v-img :src="imageSrc"></v-img>
        </v-avatar>

        <v-card-text>
          <h2
            class="text-h5 mb-2"
            style="margin-top: 24px; margin-bottom: 16px; font-weight: 700"
          >
            {{ nickname }}
          </h2>

          <v-divider class="my-3"></v-divider>
          <v-row class="myinfo">
            <v-col cols="12">
              <v-icon>{{
                gender === "male" ? "mdi-gender-male" : "mdi-gender-female"
              }}</v-icon>
              <span class="ml-1">{{
                gender === "male" ? "남성" : "여성"
              }}</span>
              &nbsp;&nbsp;&nbsp;
              <v-icon>mdi-calendar</v-icon>
              <span class="ml-1">{{ birthyear }}</span>
              &nbsp;&nbsp;&nbsp;
              <v-icon>mdi-email</v-icon>
              <span class="subtitle-1">{{ email }}</span>
            </v-col>
          </v-row>

          <v-row justify="center">
            <v-col cols="6">
              <v-btn
                class="btn-update"
                @click="router.push('/account/modify/modify-profile')"
              >
                프로필 수정
              </v-btn>
            </v-col>

            <v-col cols="6">
              <button
                class="delete_button"
                type="button"
                @click="$router.push({ name: 'AccountWithdrawPage' })"
              >
                <span class="delete_button_text">탈퇴하기</span>
                <span class="delete_button_icon"
                  ><svg
                    class="svg"
                    height="512"
                    viewBox="0 0 512 512"
                    width="512"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title></title>
                    <path
                      d="M112,112l20,320c.95,18.49,14.4,32,32,32H348c17.67,0,30.87-13.51,32-32l20-320"
                      style="
                        fill: none;
                        stroke: #fff;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 32px;
                      "
                    ></path>
                    <line
                      style="
                        stroke: #fff;
                        stroke-linecap: round;
                        stroke-miterlimit: 10;
                        stroke-width: 32px;
                      "
                      x1="80"
                      x2="432"
                      y1="112"
                      y2="112"
                    ></line>
                    <path
                      d="M192,112V72h0a23.93,23.93,0,0,1,24-24h80a23.93,23.93,0,0,1,24,24h0v40"
                      style="
                        fill: none;
                        stroke: #fff;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 32px;
                      "
                    ></path>
                    <line
                      style="
                        fill: none;
                        stroke: #fff;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 32px;
                      "
                      x1="256"
                      x2="256"
                      y1="176"
                      y2="400"
                    ></line>
                    <line
                      style="
                        fill: none;
                        stroke: #fff;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 32px;
                      "
                      x1="184"
                      x2="192"
                      y1="176"
                      y2="400"
                    ></line>
                    <line
                      style="
                        fill: none;
                        stroke: #fff;
                        stroke-linecap: round;
                        stroke-linejoin: round;
                        stroke-width: 32px;
                      "
                      x1="328"
                      x2="320"
                      y1="176"
                      y2="400"
                    ></line></svg
                ></span>
              </button>
            </v-col>
             <!-- ✅ 홈으로 가기 버튼 추가 -->
  <v-col cols="12" class="mt-4">
    <v-btn
      color="primary"
      block
      @click="router.push('/')"
    >
      🏠 홈으로 가기
    </v-btn>
  </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </div>

    <!-- 탈퇴 버튼을 카드 외부로 위치 -->
    <v-row justify="center" class="mt-4"> </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAccountStore } from "../../stores/accountStore"; // Pinia store 사용
import profileImg from "@/assets/images/fixed/profile_img.png";
import { useRouter } from "vue-router";

// ✅ SEO 메타 정보 
definePageMeta({
  title: "내 정보 | 잡스틱(JobStick)",
  description: "내 계정 정보를 확인하고 수정할 수 있는 페이지입니다.",
  keywords: ['내 정보', '계정', '프로필', 'JobStick', '개발자 플랫폼', '개발자 취업', '모의 면접', 'AI 면접'],
  ogTitle: "내 정보 - 잡스틱(JobStcik)",
  ogDescription: "잡스틱(JobStick)에서 내 계정 정보를 안전하게 확인하고 관리하세요.",
  ogImage: '' // 실제 이미지 경로
});

const imageSrc = profileImg;
const email = ref("");
const nickname = ref("");
const gender = ref("");
const birthyear = ref(0);
const menuOpen = ref(false);

const accountStore = useAccountStore();
const router = useRouter();

onMounted(async () => {
  const storedUserToken = localStorage.getItem("userToken");
  if (!storedUserToken) {
    console.warn("userToken이 없습니다.");
    //return;
  }

  try {
    // 서버에 userToken을 보내 사용자 정보 요청
    const userInfo = await accountStore.requestProfileToDjango({
      email: "",
      nickname: "",
      gender: "",
      birthyear: 0,
    });

    // 응답으로부터 store에 저장된 값들을 화면에 반영
    email.value = userInfo.data.email;
    nickname.value = userInfo.data.nickname;
    gender.value = userInfo.data.gender;
    birthyear.value = userInfo.data.birthyear;
  } catch (error) {
    console.error("사용자 정보 로딩 실패:", error);
  }
});

function onClickAccountWithdraw() {
  router.push({ name: "AccountWithdrawPage" });
}

function showMenu() {
  menuOpen.value = true;
}

function hideMenu() {
  menuOpen.value = false;
}
</script>

<style scoped>
/* 전체 컨테이너 설정 */
.container {
  min-height: 100vh;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

/* id-card-container 설정 */
.id-card-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 60px;
}

/* id-card 스타일 */
.id-card {
  position: relative;
  width: 436px;
  height: auto;
  overflow: hidden;
  text-align: center;
  padding: 20px;
  color: black;
  background-color: white;
  border: 2px solid white;
  border-radius: 32px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
}

/* 최상단 AIN 문구 */
.company-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.myinfo {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #d7dbec;
  border: 1px solid D7DBEC;
  border-radius: 12px;
  margin-bottom: 40px;
}

/* 프로필 수정 버튼 */
.btn-update {
  display: flex;
  justify-content: center !important;
  align-items: center !important;
  background: white;
  border: 1px solid lightgray;
  border-radius: 12px;
  color: black;
  margin-left: 20%;
}

/* 회원 삭제 버튼 */
.delete_button {
  position: relative;
  border-radius: 12px;
  width: 120px;
  height: 36px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border: 1px solid #cc0000;
  background-color: #e50000;
  overflow: hidden;
}

.delete_button,
.delete_button_icon,
.delete_button_text {
  transition: all 0.3s;
}

.delete_button .delete_button_text {
  transform: translateX(25px);
  color: #fff;
  font-weight: 600;
}

.delete_button .delete_button_icon {
  position: absolute;
  transform: translateX(95px);
  height: 100%;
  width: 20px;
  background-color: #cc0000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete_button .svg {
  width: 20px;
}

.delete_button:hover {
  background: #cc0000;
}

.delete_button:hover .delete_button_text {
  color: transparent;
}

.delete_button:hover .delete_button_icon {
  width: 120px;
  transform: translateX(0);
}

.delete_button:active .delete_button_icon {
  background-color: #b20000;
}

.delete_button:active {
  border: 1px solid #b20000;
}
.go-home-button {
  background: linear-gradient(135deg, #4a90e2, #007aff);
  color: white;
  font-weight: bold;
  font-size: 1.1rem;
  border-radius: 16px;
  padding: 12px 20px;
  transition: all 0.3s ease;
  box-shadow: 0 6px 12px rgba(0, 122, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.go-home-button:hover {
  background: linear-gradient(135deg, #0051a3, #003b80);
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 122, 255, 0.5);
}
@keyframes glow {
  from {
    box-shadow: 0 0 8px rgba(0, 122, 255, 0.4);
  }
  to {
    box-shadow: 0 0 20px rgba(0, 122, 255, 0.8);
  }
}

</style>
