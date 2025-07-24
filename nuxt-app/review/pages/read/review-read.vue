<template>
  <v-container>
    <v-card>
      <v-card-title>{{ review?.title }}</v-card-title>
      <v-card-subtitle>{{
        review?.email || formDate(review?.createDate)
      }}</v-card-subtitle>
      <v-card-text>
        <div class="review-content" v-html="reviewContent"></div>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="goBack">목록으로</v-btn>
        <v-btn color="secondary" @click="goUpdate">수정</v-btn>
        <v-btn color="red" @click="deleteReview">삭제</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
///
<reference types="nuxt" />
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useReviewStore } from "~/review/stores/reviewStore";
import { getSignedUrlFromS3, deleteFileFromS3 } from "~/utility/awsS3Instance";

// ✅ SEO 메타 정보
definePageMeta({
  title: "리뷰 확인 | 잡스틱(JobStick)",
  description: "잡스틱(JobStick) 리뷰 리스트에서 리뷰를 확인해보세요.",
  keywords: [
    "리뷰",
    "리뷰 보기",
    "리뷰 확인",
    "JobStick",
    "잡스틱",
    "job-stick",
    "잡스틱 리뷰",
    "잡스틱 리뷰 보기",
    "잡스틱 리뷰 확인",
    "개발자 플랫폼",
    "개발자 취업",
    "모의 면접",
    "AI 면접",
    "AI 모의 면접"
  ],
  ogTitle: "잡스틱(JobStick) 리뷰 확인",
  ogDescription: "잡스틱(JobStick) 리뷰 확인 페이지입니다. 리뷰 내용을 확인해보세요.",
  ogImage: "", // 실제 이미지 경로
  robots: "index, follow", // 검색 엔진 노출 허용
});

const route = useRoute();
const router = useRouter();
const reviewStore = useReviewStore();
const review = ref<any>(null);
const reviewContent = ref("");

const fetchReviewDetail = async () => {
  const reviewId = route.params.reviewId as string;
  if (!reviewId) return;

  try {
    const data = await reviewStore.requestReadReviewToDjango(reviewId);
    if (data) {
      review.value = data;

      if (data.content) {
        const url = await getSignedUrlFromS3(data.content);
        const response = await fetch(url, { cache: "no-store" });
        reviewContent.value = await response.text();

        reviewStore.reviewContent = reviewContent.value;
      }
    }
  } catch (error) {
    console.error("리뷰를 불러오는데 실패했습니다.");
  }
};

const goBack = () => {
  router.push("/review/list");
};

const goUpdate = () => {
  const reviewId = review.value?.id || route.params.reviewId;
  if (reviewId) {
    reviewStore.selectedReview = review.value; // ✅ store에 저장
    router.push(`/review/update/${reviewId}`);
  }
};

const deleteReview = async () => {
  const reviewId = route.params.reviewId as string;
  if (!reviewId) return;

  if (!confirm("정말 삭제하겠습니까?")) return;

  try {
    await reviewStore.requestDeleteReviewToDjango(reviewId);

    if (review.value?.content) {
      await deleteFileFromS3(review.value.content);
    }
    alert("리뷰가 삭제되었습니다.");
    router.push("/review/list");
  } catch (error) {
    console.error("리뷰를 삭제하는데 실패했습니다.");
    alert("리뷰 삭제에 실패했습니다.");
  }
};
// 날짜 포맷
const formDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
};

onMounted(fetchReviewDetail);
</script>

<style scoped>
.review-content {
  max-width: 100%;
  overflow-wrap: break-word;
}

.review-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px auto;
}
</style>
