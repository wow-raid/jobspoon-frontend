<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Order Confirmation</v-card-title>
          <v-card-text>
            <!-- 상품 목록 -->
            <v-table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id">
                  <td>{{ item.title }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>{{ item.price * item.quantity }}</td>
                </tr>
              </tbody>
            </v-table>

            <v-divider class="my-4"></v-divider>

            <!-- 결제 UI -->
            <div id="payment-method"></div>
            <!-- 이용약관 UI -->
            <div id="agreement"></div>

            <!-- 결제 로딩 상태 -->
            <v-progress-circular
              v-if="isProcessing"
              indeterminate
              color="primary"
              size="64"
              width="6"
              class="d-flex justify-center my-4"
            ></v-progress-circular>

            <!-- 결제 실패 메시지 -->
            <v-alert v-if="errorMessage" type="error">
              {{ errorMessage }}
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 결제하기 버튼 -->
    <v-row justify="end">
      <v-col cols="auto">
        <v-btn :disabled="isProcessing" @click="requestPayment" style="margin-top: 30px">
          결제하기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useAccountStore } from "~/account/stores/accountStore";
import { createAxiosInstances } from "@/utility/axiosInstance";

const { djangoAxiosInstance } = createAxiosInstances();
const router = useRouter();
const route = useRoute();

const paymentWidget = ref(null);
const paymentMethodWidget = ref(null);
const clientKey = ref(useRuntimeConfig().public.TOSS_CLIENT_KEY);

const items = ref([]);
const totalAmount = ref(0);
const amount = ref(0);
const inputEnabled = ref(false);
const isProcessing = ref(false);
const errorMessage = ref(null);

const userToken = ref("");
const accountStore = useAccountStore();

// ✅ Toss용 safe한 orderId
const safeOrderId = `jobstick-${nanoid(12)}`;

// ✅ 컴포넌트 로딩 시 실행
onMounted(async () => {
  userToken.value = localStorage.getItem("userToken");

  const planId = localStorage.getItem("selectedPlanId");
  const planPrice = localStorage.getItem("selectedPlanPrice");

  if (!planId || !planPrice) {
    router.push("/membership/plans");
    return;
  }

  items.value = [
    {
      id: Number(planId),
      title: "선택한 멤버십 요금제",
      price: Number(planPrice),
      quantity: 1,
    },
  ];

  totalAmount.value = items.value[0].price;
  amount.value = totalAmount.value;

  // Toss 결제 UI 준비
  paymentWidget.value = await loadPaymentWidget(clientKey.value, ANONYMOUS);
  paymentMethodWidget.value = paymentWidget.value.renderPaymentMethods(
    "#payment-method",
    { value: amount.value },
    { variantKey: "DEFAULT" }
  );
  paymentWidget.value.renderAgreement("#agreement", { variantKey: "AGREEMENT" });

  paymentMethodWidget.value.on("ready", () => {
    inputEnabled.value = true;
  });
});

// ✅ 결제 요청
const requestPayment = async () => {
  isProcessing.value = true;
  errorMessage.value = null;

  try {
    const customerEmail = await accountStore.requestEmail(userToken.value);

    // ✅ 주문 생성 (Django API) — 여긴 숫자 ID로 처리 가능
    const response = await djangoAxiosInstance.post("/orders/create", {
      userToken: userToken.value,
      items: [{ id: Number(localStorage.getItem("selectedPlanId")) }],
      total: Number(localStorage.getItem("selectedPlanPrice")),
    });

    const orderInfoId = response.data.orderId;
    localStorage.setItem("oid", orderInfoId); // 백엔드 주문 ID 보존

    // ✅ Toss 결제 요청 - Toss에만 safeOrderId 사용
    if (paymentWidget.value) {
      await paymentWidget.value.requestPayment({
        orderId: safeOrderId,  // Toss용 안전한 ID
        orderName: generateOrderName(items.value),
        customerName: "test",
        customerEmail,
        customerMobilePhone: "01012341234",
        successUrl: `${window.location.origin}/payments/success`,
        failUrl: `${window.location.origin}/payments/fail`,
      });
    }
  } catch (error) {
    console.error("Payment failed:", error);
    errorMessage.value = "결제 실패! 다시 시도해 주세요.";
  } finally {
    isProcessing.value = false;
  }
};

// ✅ 주문명 생성
const generateOrderName = (items) => {
  const orderNames = items.map(item => `${item.title} ${item.quantity}개`);
  return orderNames.join(', ').slice(0, 50) + "...";
};
</script>

<style scoped>
/* 필요한 스타일은 여기에 */
</style>
