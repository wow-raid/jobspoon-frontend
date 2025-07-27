<template>
  <v-container class="py-10">
    <v-row justify="center" align="stretch" class="gap-6">
      <v-col cols="12" class="text-center">
        <h1 class="text-h4 font-weight-bold mb-4">멤버십 요금제</h1>
        <p class="text-subtitle-1 black-text">
          AI 모의 면접 서비스를 요금제에 맞게 선택해보세요.
        </p>
      </v-col>

      <v-col
        v-for="plan in membershipStore.membershipPlans"
        :key="plan.id"
        cols="12"
        sm="6"
        md="4"
        class="d-flex"
      >
        <v-card
          :class="['pricing-card', getGradientClass(plan.id)]"
          class="pa-6 rounded-xl elevation-10 text-white w-100"
          hover
        >
          <v-card-title class="text-h5 font-weight-bold mb-2">
            {{ plan.name }}
          </v-card-title>

          <v-card-subtitle class="text-h6 font-weight-bold mb-4 text-center">
            <span v-if="plan.originalPrice" class="original-price">
              {{ formatPrice(plan.originalPrice) }}원
            </span>
            <span class="discounted-price">{{ formatPrice(plan.price) }}원</span> /
            {{ plan.period }}
          </v-card-subtitle>

          <v-divider class="mb-3" color="white" />

          <v-card-text class="mb-4">
            <ul class="feature-list">
              <li v-for="(feature, index) in plan.features" :key="index">
                ✅ {{ feature }}
              </li>
            </ul>
          </v-card-text>

          <v-spacer />

          <v-card-actions>
            <v-btn
              block
              color="white"
              class="text-primary font-weight-bold"
              variant="flat"
              @click="selectPlan(plan)"
            >
              구독하기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { useMembershipStore } from "@/membership/stores/membershipStore";
import { useRouter } from "vue-router";

const membershipStore = useMembershipStore();
const router = useRouter();

function formatPrice(price) {
  return Number(price).toLocaleString();
}

function selectPlan(plan) {
  localStorage.setItem("selectedPlanId", plan.id);
  localStorage.setItem("selectedPlanPrice", plan.price);
  router.push("/payments/confirm"); // ✅ 결제 시작 페이지로 이동
}

function getGradientClass(id) {
  if (id === 1) return "gradient-lightblue";
  if (id === 2) return "gradient-midblue";
  if (id === 3) return "gradient-darkblue";
  return "";
}
</script>

<style scoped>
.pricing-card {
  min-height: 100%;
  transition: transform 0.3s ease;
  color: white;
}
.pricing-card:hover {
  transform: translateY(-6px);
}

.gradient-lightblue {
  background: linear-gradient(135deg, #b3e5fc, #4fc3f7);
}
.gradient-midblue {
  background: linear-gradient(135deg, #81d4fa, #29b6f6);
}
.gradient-darkblue {
  background: linear-gradient(135deg, #4fc3f7, #0288d1);
}

.original-price {
  text-decoration: line-through;
  color: #000;
  font-weight: 600;
  margin-right: 8px;
  font-size: 16px;
}

.discounted-price {
  color: red;
  font-weight: 900;
  font-size: 24px;
}

.feature-list {
  padding-left: 1rem;
  list-style-type: none;
}
.feature-list li {
  margin-bottom: 8px;
  font-size: 15px;
  color: #fff;
}

.text-subtitle-1.black-text {
  color: #000;
  font-size: 16px;
}
</style>
