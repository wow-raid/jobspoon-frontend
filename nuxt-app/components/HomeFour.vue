<template>
  <section class="home-four" data-aos="fade-up">
    <!-- 1. 인트로 -->
    <div class="intro-section">
      <h2>면접, 왜 이렇게 어려울까요?</h2>
      <p>
        나도 모르게 반복하는 말버릇,<br />
        예상 질문이 없어 막막함, 긴장되는 태도까지.<br />
        <strong class="blue-text">JobStick</strong>이 당신의 면접 고민을
        해결해드립니다.<br /><br />
        (아래 사진과 같이 실제 모의 면접처럼 서비스를 제공합니다.)
      </p>
    </div>

    <!-- 2. 좌우 구성 -->
    <div class="grid-wrapper">
      <!-- 왼쪽: 이미지 -->
      <div class="image-box">
        <img :src="mainImage" alt="면접 상황 이미지" />
      </div>

      <!-- 오른쪽: 해결안 -->
      <div class="solution-box">
        <h2>면접, 혼자 준비하기 막막하셨죠?<br />JobStick이 함께합니다</h2>
        <ul>
          <li>
            혼자 연습하다 보면 내가 어떤 실수를 반복하는지조차 알기 어렵습니다.
            JobStick은 AI가 면접자의 말버릇과 태도를 분석해 실질적인 피드백을
            제공합니다.
          </li>
          <li>
            기업마다 질문이 다른데, 무작정 준비할 순 없죠. JobStick은 실제
            기업에서 자주 묻는 질문과 평가 기준을 기반으로 맞춤형 질문을
            제공합니다.
          </li>
          <li>
            면접이 막막하게 느껴질 때, JobStick은 모의 면접부터 실시간 분석,
            요약까지 전 과정을 도와주는 면접 파트너가 되어드립니다.
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";

// 이미지 import
import mainImage from "@/assets/images/fixed/sc123.png";

onMounted(() => {
  AOS.init({ once: true, duration: 1000 });
});
</script>

<style scoped>
.home-four {
  padding: 60px 20px;
  max-width: 1200px;
  margin: 0 auto;
}

/* ✅ 파란색 텍스트 */
.blue-text {
  color: #1976d2;
}

.intro-section {
  text-align: left;
  margin-bottom: 40px;
}
.intro-section h1 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 16px;
}
.intro-section p {
  font-size: 18px;
  line-height: 1.6;
  color: #444;
}

.grid-wrapper {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  flex-wrap: wrap;
}

.image-box {
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.image-box img {
  flex: 0 0 700px;
  width: 100%;
  max-width: 700px;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.solution-box {
  flex: 1;
  min-width: 300px;
  background: linear-gradient(135deg, #e3f2fd, #ffffff);
  padding: 30px 28px;
  margin-top: -180px;
  border-radius: 16px;
  border-left: 8px solid #1976d2;
  box-shadow: 0 8px 20px rgba(25, 118, 210, 0.1);
  transition: transform 0.3s ease;
}

.solution-box:hover {
  transform: translateY(-4px);
}

.solution-box h2 {
  font-size: 26px;
  font-weight: 700;
  color: #0d47a1;
  margin-bottom: 20px;
  line-height: 1.4;
}

.solution-box ul {
  padding-left: 0;
  list-style: none;
}

.solution-box li {
  font-size: 16px;
  margin-bottom: 18px;
  color: #333;
  position: relative;
  padding-left: 24px;
  line-height: 1.7;
}

.solution-box li::before {
  content: "💡";
  position: absolute;
  left: 0;
  top: 2px;
}
/* ✅ 모바일 대응 추가 */
@media (max-width: 420px) {
  .image-box img {
    max-width: 90vw;
  }
}

@media (min-width: 421px) and (max-width: 576px) {
  .image-box img {
    max-width: 360px;
  }
}

@media (min-width: 577px) and (max-width: 768px) {
  .image-box img {
    max-width: 410px;
  }
  .image-box {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .image-box img {
    width: auto;
    max-width: 410px; /* ✅ 고정된 최대 가로 너비 제한 */
    height: auto;
    border-radius: 12px;
  }

  .solution-box {
    margin-top: 0;
    padding: 24px 20px;
    width: 100%;
  }

  .home-four {
    padding: 40px 16px;
  }
}
</style>
