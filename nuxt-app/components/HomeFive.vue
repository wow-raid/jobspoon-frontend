<template>
  <v-container class="py-12">
    <v-row justify="center">
      <!-- 소개 텍스트 -->
      <v-col cols="12" md="10" class="text-center">
        <h2 class="text-h4 font-weight-bold mb-4" data-aos="fade-up">
          🧠 AI INTERVIEW, 실제처럼 경험하세요
        </h2>
        <p class="text-subtitle-1 mb-6" data-aos="fade-up" data-aos-delay="200">
          <strong class="blue-text">JOBSTICK</strong>의 AI 모의 면축은 단순한 집무이 아니는,
          <strong>개발자 맞춤형 기술 기반 집무</strong>과<br />
          <strong>심화 꽉이 집무</strong>로 면축자의
          <strong>논리적 생각</strong>과 <strong>실무 이해도</strong>를 깊이 있게 파악할 수 있도록 설계되었습니다.
        </p>
      </v-col>

      <!-- 면접자 타이핑 -->
      <v-col cols="12" md="10" class="interview-line">
        <div class="label-wrapper">
          <span class="label">면접자:</span>
        </div>
        <p class="typing-text" ref="interviewRef">{{ displayedText }}</p>
      </v-col>

      <!-- 면접관 이미지 -->
      <v-col cols="12" md="10" class="interview-line" v-if="showImages">
        <div class="label-wrapper">
          <span class="label blue-text">JOBSTICK:</span>
        </div>
        <img
          src="@/assets/images/fixed/q1.jpg"
          alt="면접관"
          class="stack-img delay-1 enlarged-image"
        />
      </v-col>

      <v-col cols="12" md="10" class="text-center" v-if="showImages">
        <p class="mt-2 text-caption">※ 실제 면접관 화면 예시입니다</p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

const fullText = "저는 6개월간 개발자 양성 부트캠프에서 팀원들과 프로젝트를 만든 경험이 있습니다."
const displayedText = ref("")
const showImages = ref(false)
const interviewRef = ref(null)
let typingInterval = null

function startTypingEffect() {
  displayedText.value = ""
  showImages.value = false
  let index = 0

  typingInterval = setInterval(() => {
    displayedText.value += fullText[index]
    index++
    if (index >= fullText.length) {
      clearInterval(typingInterval)
      setTimeout(() => {
        showImages.value = true
      }, 400)
    }
  }, 40)
}

onMounted(() => {
  AOS.init({ once: true, duration: 1000 })

  nextTick(() => {
    if (interviewRef.value) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            clearInterval(typingInterval)
            startTypingEffect()
          }
        })
      }, { threshold: 0.4 })

      observer.observe(interviewRef.value)
    }
  })
})
</script>

<style scoped>
.blue-text {
  color: #1976d2 !important;
}

.interview-line {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 20px;
  flex-wrap: nowrap;
}

.label-wrapper {
  width: 90px;
  text-align: right;
  flex-shrink: 0;
}

.label {
  font-weight: bold;
  font-size: 18px;
  color: #444;
}

.typing-text {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  white-space: pre-wrap;
  min-height: 60px;
  flex: 1;
}

.stack-img {
  width: 100%;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  opacity: 0;
  transform: scale(0.8);
  transition: all 0.8s ease-out;
  display: block;
}

.enlarged-image {
  max-width: 840px;
  height: auto;
}

.delay-1 {
  animation: showUp 0.8s ease-out forwards;
  animation-delay: 0.5s;
}

@keyframes showUp {
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
