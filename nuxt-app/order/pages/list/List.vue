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
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 결제하기 버튼을 오른쪽 하단에 배치 -->
    <v-row justify="end">
      <v-col cols="auto">
        <v-btn :disabled="!inputEnabled" @click="requestPayment" class="button" style="margin-top: 30px">
          결제하기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { useRuntimeConfig } from "nuxt/app";
import { nanoid } from "nanoid";
import { useRoute, useRouter } from "vue-router";
import { useAccountStore } from "~/account/stores/accountStore";

// 변수 선언
const config = useRuntimeConfig();
const paymentWidget = ref(null);
const paymentMethodWidget = ref(null);
const clientKey = ref(config.public.TOSS_CLIENT_KEY);
const inputEnabled = ref(false);
const amount = ref(0);
const discountCouponAmount = ref(5);
const items = ref([]);

// 라우터 및 쿼리
const route = useRoute();
const router = useRouter();

const totalAmount = ref(0);
const userToken = ref("");

const accountStore = useAccountStore()

// 결제 UI 준비
onMounted(async () => {
  userToken.value = localStorage.getItem("userToken");

  // ✅ 장바구니 제거 → localStorage에서 요금제 1개 가져오기
  const planId = localStorage.getItem("selectedPlanId");
  const planPrice = localStorage.getItem("selectedPlanPrice");

  if (!planId || !planPrice) {
    router.push("/membership/plans"); // ❗ 요금제 선택 안 되어 있으면 되돌리기
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

  // ✅ Toss 결제 위젯 초기화
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


// 쿠폰 적용 시 결제 금액 업데이트
const updateAmount = () => {
  const coupon = document.getElementById("coupon-box");
  if (coupon.checked) {
    amount.value = totalAmount.value - discountCouponAmount.value;
  } else {
    amount.value = totalAmount.value;
  }
  paymentMethodWidget.value.updateAmount(amount.value);
};

// 결제 요청
const requestPayment = async () => {
  try {
    // const customerName = await accountProfileStore.requestNickname(userToken.value); // 고객 이름
    const customerEmail = await accountStore.requestEmail(userToken.value); // 고객 이메일

    if (paymentWidget.value) {
      await paymentWidget.value.requestPayment({
        orderId: nanoid(),
        orderName: generateOrderName(items.value), // 주문명
        // customerName: customerName, // 고객 이름
        customerName: "test", // 고객 이름
        customerEmail: customerEmail, // 고객 이메일
        customerMobilePhone: "01012341234", // 고객 전화번호
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
    }
  } catch (error) {
    console.error("Payment failed:", error);
  }

const orderData = {
  userToken: localStorage.getItem("userToken"),
  items: [{ id: Number(localStorage.getItem("selectedPlanId")) }],
  total: Number(localStorage.getItem("selectedPlanPrice")),
};

// ✅ 여기에 찍는다!
console.log("📦 주문 생성 요청 데이터:", orderData);

// 요청 보내기
const response = await orderAction.requestCreateOrder(orderData);

};

// 주문 이름 생성 함수
const generateOrderName = (items) => {
  const orderNames = items.map(item => `${item.title} ${item.quantity}개`);
  let orderName = orderNames.join(', ');

  // orderName 길이가 일정 이상일 경우 '...'으로 자르기
  const maxLength = 50; // 예를 들어 50자로 제한
  if (orderName.length > maxLength) {
    orderName = orderName.substring(0, maxLength) + '...';
  }

  return orderName;
};
</script>

<style scoped>
/* 필요한 스타일 추가 */
</style>
