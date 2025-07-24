<template>
  <section class="home-five" data-aos="fade-up">
    <!-- 서비스 소개 -->
    <div class="hero" data-aos="fade-up" data-aos-delay="100">
      <h2>국내 최초, 개발자를 위한 AI 모의 면접 플랫폼</h2>
      <p>
        <strong class="blue-text">JobStick</strong>은 진짜 면접처럼 연습하고, <br />
        기업 맞춤 정보를 통해 자신 있게 면접을 준비할 수 있도록 돕습니다.
      </p>
    </div>

    <!-- 기능 설명 -->
    <div class="features" data-aos="fade-up" data-aos-delay="300">
      <h2><strong class="blue-text">JobStick</strong>은 이렇게 다릅니다</h2>
      <p>
        단순한 질문 생성기가 아닙니다. <br />
        각 기업이 요구하는 조건, 자주 묻는 질문, 실제 면접에서 사용된 질문을 수집하고 분석하여<br />
        사용자에게 맞춤형으로 제공하는 국내 최초 개발자 특화 면접 준비 사이트입니다.
      </p>
    </div>

    <!-- 기업 로고 슬라이드 -->
    <div class="companies-logo-container" data-aos="fade-up" data-aos-delay="500">
      <h3>현재 <strong class="blue-text">JobStick</strong>이 지원하는 기업</h3>
      <div class="logo-slider">
        <div class="logo-track">
          <img src="/assets/images/fixed/d1.png" alt="당근" />
          <img src="/assets/images/fixed/t2.png" alt="토스" />
          <img src="/assets/images/fixed/e1.png" alt="엔코아" />
          <img src="/assets/images/fixed/3.png" alt="kt" />
          <!-- 무한 반복용 -->
          <img src="/assets/images/fixed/d1.png" alt="당근" />
          <img src="/assets/images/fixed/t2.png" alt="토스" />
          <img src="/assets/images/fixed/e1.png" alt="엔코아" />
          <img src="/assets/images/fixed/3.png" alt="kt" />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import AOS from 'aos'
import 'aos/dist/aos.css'

onMounted(() => {
  AOS.init({ once: true, duration: 1000 })
})
</script>

<style scoped>
.home-five {
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 20px;
  text-align: center;
}

.hero h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
}

.hero p {
  font-size: 18px;
  color: #444;
  line-height: 1.6;
}

.features {
  margin-top: 60px;
}
.features h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 16px;
}
.features p {
  font-size: 16px;
  color: #555;
  line-height: 1.8;
}

.companies-logo-container {
  margin-top: 60px;
  text-align: center;
}

.logo-slider {
  overflow: hidden;
  width: 100%;
  margin-top: 20px;
}

.logo-track {
  display: flex;
  gap: 40px;
  animation: scrollLeft 20s linear infinite;
}

.logo-track img {
  width: 120px;
  height: auto;
  object-fit: contain;
  filter: grayscale(0.3);
  transition: transform 0.3s ease;
}

.logo-track img:hover {
  transform: scale(1.05);
  filter: grayscale(0);
}

@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* 파란색 텍스트 스타일 */
.blue-text {
  color: #1976d2;
}
</style>
