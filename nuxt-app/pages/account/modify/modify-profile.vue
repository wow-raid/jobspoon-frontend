<template>
  <v-container>
    <h1 class="text-h5 mb-4 font-weight-bold">🎯 추가 정보 입력</h1>

    <v-form @submit.prevent="submitForm">
      <v-text-field v-model="nickname" label="닉네임" required />
      <v-select v-model="gender" label="성별" :items="['male', 'female']" required />
      <v-text-field v-model="birthyear" label="출생년도 (예: 1995)" type="number" required />
      <v-select v-model="ageRange" label="연령대" :items="['10대', '20대', '30대', '40대 이상']" required />
      <v-btn type="submit" color="primary" class="mt-4">저장 후 계속하기</v-btn>
    </v-form>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useGoogleAuthenticationStore } from "@/googleAuthentication/stores/googleAuthenticationStore";

const router = useRouter();
const googleAuthenticationStore = useGoogleAuthenticationStore();

const accessToken = ref('');
const email = ref('');
const userId = ref('');

onMounted(() => {
  accessToken.value = localStorage.getItem("accessToken") || '';
  email.value = localStorage.getItem("email") || '';
  userId.value = localStorage.getItem("userId") || '';

  console.log("✅ accessToken/email/userId 확인:");
  console.log("accessToken:", accessToken.value);
  console.log("email:", email.value);
  console.log("userId:", userId.value);
});

const nickname = ref('');
const gender = ref('');
const birthyear = ref('');
const ageRange = ref('');

const submitForm = async () => {
  if (!accessToken.value || !email.value || !userId.value) {
    alert("로그인 정보가 누락되어 저장할 수 없습니다.");
    return;
  }

  try {
    const response = await axios.post("http://localhost:8000/google-oauth/request-user-token", {
      access_token: accessToken.value,
      user_id: userId.value,
      email: email.value,
      nickname: nickname.value,
      gender: gender.value,
      birthyear: birthyear.value,
      age_range: ageRange.value,
    });

    const userToken = response.data.userToken;

    // ✅ 여기서만 로그인 상태 처리
    localStorage.setItem("userToken", userToken);
    googleAuthenticationStore.userToken = userToken;
    googleAuthenticationStore.isAuthenticated = true;

    router.push("/account/mypage");
  } catch (error) {
    console.error("❌ 유저 정보 등록 실패:", error);
    alert("추가 정보 등록 중 오류가 발생했습니다.");
  }
};
</script>
