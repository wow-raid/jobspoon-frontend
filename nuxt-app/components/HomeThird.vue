<template>
  <div class="home-third">
    <div class="home-third-body">
      <div class="content-container" data-aos="fade-left" data-aos-offset="400">
        <v-card class="content-image" id="first-image"></v-card>
        <div class="text-container">
          <p class="number-icon"></p>
          <div class="text-title-container">
            <p class="text-title">실제 면접 질문 자료 보유 </p>
            <p class="text-subtitle">특정 기업들에 대한 맞춤 면접 제공</p>
          </div>
          <div class="text-content-container">
            <p class="text-content">
              <span class="AIV-span">JOBSTICK</span>은 실제 개발자들이 모여 제작한 프로그램이며, 특정 기업들에 대한 실제 면접 질문 데이터를 기반으로 AI INTERVIEW서비스를 제공합니다.
            </p>
          </div>
        </div>
      </div>

      <div
        class="content-container"
        data-aos="fade-right"
        data-aos-offset="400"
      >
        <div class="text-container">
          <p class="number-icon"></p>
          <div class="text-title-container">
            <p class="text-title">실전 같은 모의면접</p>
            <p class="text-subtitle">AI기반 맞춤 면접 질문 제공</p>
          </div>
          <div class="text-content-container">
            <span class="AIV-span">JOBSTICK</span>은 질문이 공통적이고 사용자들에게 표준화된 질문을 제공하는 다른 면접 사이트와 달리 AI를 기반으로 업계별,
            직무별, 경력별 등의 사용자 능력에 맞게 맞춤형 질문과 기술 연계 질문을 제공해드립니다.
          </div>
        </div>
        <v-card class="content-image" id="second-image"></v-card>
      </div>

      <div class="content-container" data-aos="fade-left" data-aos-offset="400">
        <v-card class="content-image" id="third-image"></v-card>
        <div class="text-container">
          <p class="number-icon"></p>
          <div class="text-title-container">
            <p class="text-title">전문적 피드백</p>
            <p class="text-subtitle">피드백을 통한 문제점 확인</p>
          </div>
          <div class="text-content-container">
            <p class="text-content">
          <span class="AIV-span">JOBSTICK</span>은 정확한 AI분석을 통해 모의 면접에서 이루어지는 실수나 더 좋은 답변의 예시를 보여주며, 사용자들에게 실제 면접에서 더 효과적인 답변이 나오도록 피드백을 제공해드립니다.
            </p>
          </div>
        </div>
      </div>

      <div
        class="content-container"
        data-aos="fade-right"
        data-aos-offset="400"
      >
        <div class="text-container">
          <p class="number-icon"></p>
          <div class="text-title-container">
            <p class="text-title">영상 분석 확인 가능</p>
            <p class="text-subtitle">면접 피드백 제공</p>
          </div>
          <div class="text-content-container">
            <p class="text-content">
            <span class="AIV-span">JOBSTICK</span>은 다른 면접 사이트와 다르게 모의 면접이 이루어지는 순간을 영상으로 담아 제공해드립니다.
               사용자들이 직접 자신들의 면접 모습을 보며, 불필요한 행동이나 발화 습관의 분석이 가능하게 만들고 효과적으로 면접 준비 시간을 절약하게 만들어드립니다. 
            </p>
          </div>
        </div>
        <v-card class="content-image" id="fourth-image"></v-card>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeThird",
});
</script>

<style scoped>
.home-third {
  width: 100%;
  min-height: 100vh;
  background-size: cover;
  background-attachment: fixed;
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 0; /* 항상 home-second 아래 */
  padding-top: 100px; /* 여백을 줘서 겹침 방지 */
}

.home-third-body {
  width: 70%;
  height: 100%;
  display: flex;
  display: flex;
  flex-direction: column;
  /* gap: 1%; */
}

.content-container {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  margin-bottom: 60px;
}

.content-image {
  width: 50%;
  height: 300px;
  max-height: 400px;
  border-radius: 25px;
  overflow: hidden;
}

#first-image {
  background-image: url("@/assets/images/fixed/S.png");
  background-size: 105% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

#second-image {
  background-image: url("@/assets/images/fixed/sc123.png");
  background-size: 105% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

#third-image {
  background-image: url("@/assets/images/fixed/feedback.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

#fourth-image {
  background-image: url("@/assets/images/fixed/videointerview.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.text-container {
  width: 50%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  word-break: keep-all;
  gap: 10px;
}

.number-icon {
  font-size: 4vh;
  font-weight: bold;
  color: #000000d7;
  background-color: #ffffff;
  width: 5vh;
  height: 5vh;
  border-radius: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
}

.text-title {
  font-size: 5vh;
  font-weight: bold;
  color: #000000;
}

.text-subtitle {
  font-size: 2.3vh;
  font-weight: bold;
  color: #000000;
}

.text-content {
  font-size: 2.2vh;
  color: #000000;
}

.AIV-span {
  color: rgb(30, 56, 255);
}

/*모바일 전용*/
@media screen and (max-width: 600px) {
  .home-third-body {
    width: 90%;
  }

  .content-container {
    flex-direction: column;
    height: auto;
    gap: 20px;
    margin-bottom: 40px;
  }

  .content-container > .content-image {
    order: 0;
  }

  .content-container > .text-container {
    order: 1;
  }

  .content-image {
    width: 100%;
    height: 200px;
    background-size: cover !important;
  }

  .text-container {
    width: 100%;
    gap: 15px;
    text-align: center;
    align-items: center;
  }

  .number-icon {
    font-size: 3.5vh;
    width: 4.5vh;
    height: 4.5vh;
  }

  .text-title {
    font-size: 3.5vh;
  }

  .text-subtitle {
    font-size: 2vh;
  }

  .text-content {
    font-size: 2vh;
  }
}
</style>
