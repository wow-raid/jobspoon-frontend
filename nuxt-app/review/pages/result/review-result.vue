<template>
  <v-container>
    <v-alert type="success">리뷰 결과</v-alert>
    <pre>{{ review }}</pre>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';


// ✅ SEO 메타 정보
definePageMeta({
  title: '리뷰 결과 | 잡스틱(JobStick)',
  description: '잡스틱(JobStick) 리뷰 결과를 안내해드립니다.',
  keywords: [
    '리뷰', 
    '리뷰 결과', 
    '결과 안내', 
    'JobStick', 
    '잡스틱', 
    'job-stick',
    '잡스틱 리뷰',
    '잡스틱 리뷰 결과',
    '잡스틱 리뷰 결과 안내',
    '개발자 플랫폼',
    '개발자 취업',
    '모의 면접',
    'AI 면접',
    '잡스틱 면접',
    '잡스틱 모의 면접',
    'AI 모의 면접',
    '잡스틱 AI'
  ],
  ogTitle: '잡스틱(JobStick) 리뷰 결과',
  ogDescription: '잡스틱(JobStick) 리뷰 결과 안내 페이지입니다. 리뷰 작성 후 결과를 확인해보세요.',
  ogImage: '', // 실제 이미지 경로
  robots: 'noindex, nofollow'
});

const review = ref();

onMounted(async () => {
  const res = await fetch(`http://localhost:8000/api/review/result`);
  review.value = await res.json();
});
</script>