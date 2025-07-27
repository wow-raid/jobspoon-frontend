<template>
  <div class="membership-status">
    <h2>내 구독 상태</h2>

    <div v-if="membershipStore.myMembership">
      <p><strong>플랜:</strong> {{ membershipStore.myMembership.plan }}</p>
      <p><strong>시작일:</strong> {{ formatDate(membershipStore.myMembership.start_date) }}</p>
      <p><strong>만료일:</strong> {{ formatDate(membershipStore.myMembership.end_date) }}</p>
      <p><strong>활성 상태:</strong> {{ membershipStore.myMembership.is_active ? '활성화됨' : '비활성화됨' }}</p>
    </div>

    <div v-else>
      <p v-if="membershipStore.errorMessage">{{ membershipStore.errorMessage }}</p>
      <p v-else>구독 정보가 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { useMembershipStore } from '@/membership/stores/membershipStore';

const membershipStore = useMembershipStore();

const userId = Number(localStorage.getItem("userId")); // 또는 Pinia에 저장된 사용자 ID 참조

onMounted(() => {
  if (userId) {
    membershipStore.fetchMyMembership(userId);
  }
});

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("ko-KR");
}
</script>

<style scoped>
.membership-status {
  max-width: 500px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
</style>
