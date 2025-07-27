<template>
  <v-container>
    <v-alert type="success" v-if="!error">
      결제가 성공적으로 완료되었습니다.
    </v-alert>
    <v-alert type="error" v-if="error">
      결제 처리 중 오류가 발생했습니다: {{ error }}
    </v-alert>
  </v-container>
</template>

<script setup>
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { createAxiosInstances } from '@/utility/axiosInstance';

const { djangoAxiosInstance } = createAxiosInstances();
const route = useRoute();

onMounted(async () => {
  const paymentKey = route.query.paymentKey;
  const orderId = route.query.orderId;
  const amount = route.query.amount;

  // ✅ localStorage는 클라이언트에서만 존재하므로 반드시 onMounted 안에서
  const orderInfoId = localStorage.getItem("oid");
  const userToken = localStorage.getItem("userToken");

  if (!orderInfoId || !userToken) {
    console.error("필수 정보 누락: orderInfoId 또는 userToken 없음");
    return;
  }

  try {
    const response = await djangoAxiosInstance.post("/payments/process", {
      userToken,
      paymentKey,
      orderId,
      amount,
      orderInfoId,
    });
    console.log("✅ 결제 처리 성공:", response.data);
  } catch (error) {
    console.error("❌ 결제 후처리 실패:", error);
  }
});
</script>
