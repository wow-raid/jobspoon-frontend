<template>
  <v-container class="text-center mt-10">
    <v-alert type="error" border="left" elevation="2">
      ❌ 결제에 실패했습니다.<br />
      다시 시도해 주세요.
    </v-alert>

    <v-btn color="primary" class="mt-6" @click="goToPlans">
      요금제 다시 보기
    </v-btn>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const goToPlans = () => router.push("/membership/plans");
</script>
