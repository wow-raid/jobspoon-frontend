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
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import axios from "axios";

const route = useRoute();
const router = useRouter();

const accessToken = ref('');
const email = ref('');
const userId = ref('');

onMounted(() => {
  // 쿼리에서 가져오고, 없으면 localStorage에서 가져옴
  accessToken.value = (route.query.accessToken as string) || localStorage.getItem("accessToken") || '';
  email.value = (route.query.email as string) || localStorage.getItem("email") || '';
  userId.value = (route.query.userId as string) || localStorage.getItem("userId") || '';

  // 처음 접속 시 localStorage에 저장
  if (route.query.accessToken && route.query.email && route.query.userId) {
    localStorage.setItem("accessToken", accessToken.value);
    localStorage.setItem("email", email.value);
    localStorage.setItem("userId", userId.value);
  }

  console.log("✅ accessToken/email/userId 확인:", {
    accessToken: accessToken.value,
    email: email.value,
    userId: userId.value
  });
});

const nickname = ref("");
const gender = ref("");
const birthyear = ref("");
const ageRange = ref("");

const submitForm = async () => {
  if (!accessToken.value || !email.value || !userId.value) {
    alert("로그인 정보가 누락되어 저장할 수 없습니다.");
    return;
  }

  try {
    const response = await axios.post("/google-oauth/request-user-token", {
      access_token: accessToken.value,
      user_id: userId.value,
      email: email.value,
      nickname: nickname.value,
      gender: gender.value,
      birthyear: birthyear.value,
      age_range: ageRange.value,
    });

    const userToken = response.data.userToken;
    localStorage.setItem("userToken", userToken);

    router.push("/account/mypage");
  } catch (error) {
    console.error("❌ 유저 정보 등록 실패:", error);
    alert("추가 정보 등록 중 오류가 발생했습니다.");
  }
};
</script>
