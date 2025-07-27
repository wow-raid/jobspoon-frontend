<template>
  <v-container class="py-16 white-background" fluid data-aos="fade-up">
    <v-row justify="center" class="mb-10">
      <!-- 왼쪽 -->
      <v-col cols="12" md="6" class="text-center" data-aos="fade-right">
        <h1 class="text-h4 font-weight-bold shiny-red mb-2 animate-fade-in">
          EVENT!
        </h1>
        <p class="event-subtitle mb-4 blue-text">(게스트 로그인 하는 방법)</p>

        <v-img
          src="@/assets/images/fixed/14.png"
          alt="JobStick 오픈 이벤트"
          max-height="360"
          contain
          class="mb-4"
        />
        <p class="text-subtitle-1 font-weight-bold">
          JOBSTICK 오픈 기념으로 모든 이용자들에게<br />
          <span class="blue-text"
            >회원가입 없이도 AI INTERVIEW 기능을 사용할 수 있는</span
          ><br />
          <span class="red-text">게스트 로그인</span>을 일정 기간
          오픈해드립니다!
        </p>
      </v-col>

      <!-- 오른쪽 -->
      <v-col
        cols="12"
        md="6"
        data-aos="fade-left"
        class="d-flex flex-column justify-end align-center"
        style="min-height: 100%; height: 100%"
      >
        <div style="width: 100%; max-width: 560px; margin-top: 60px">
          <h2 class="text-h5 font-weight-bold mb-4 text-center">
            자주 묻는 질문 (FAQ)
          </h2>
          <v-expansion-panels multiple elevation="1">
            <v-expansion-panel v-for="(item, index) in faqList" :key="index">
              <v-expansion-panel-title>
                <strong>{{ item.question }}</strong>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                {{ item.answer }}
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- 버튼 -->
          <div class="d-flex justify-center mt-8">
            <v-btn class="shiny-button" size="x-large" @click="goToInterview">
              ✨ AI INTERVIEW 시작하기 ✨
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- 블로그 버튼 -->
    <v-row justify="center" class="mt-12">
      <v-col cols="auto">
        <v-btn class="shiny-button" size="large" @click="goToBlog">
          📒 JobStick 블로그 보러 가기
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "vue-router";

const router = useRouter();
const goToInterview = () => {
  router.push("/ai-interview/llm-test");
};

const faqList = [
  {
    question: "🎯 잡스틱(JobStick) 모의 면접은 어떻게 작동하나요?",
    answer:
      "✅ 사용자가 직무와 기술 스택을 선택하면, AI가 해당 조건에 맞춘 질문을 생성하고, 음성/텍스트 기반 답변을 분석해 피드백을 제공합니다.",
  },
  {
    question: "🎯 실제 면접처럼 질문이 주어지나요?",
    answer:
      "✅ 네, 실제 면접관이 묻는 방식으로 질문이 주어지며, 타이밍과 난이도도 현실감 있게 구성되어 있습니다.",
  },
  {
    question: "🎯 잡스틱(JobStick) 모의 면접의 결과는 저장되나요?",
    answer:
      "✅ 네, 결과는 사용자 계정에 자동 저장되며, 면접 후 피드백 리포트와 함께 이력을 확인할 수 있습니다.",
  },
  {
    question: "🎯 피드백은 어떻게 생성되나요?",
    answer:
      "✅ 답변의 키워드, 표현력, 구조 등을 AI가 분석하여 항목별 피드백을 제공합니다.",
  },
  {
    question: "🎯 AI 모의 면접 사이트는 어떤 것이 있나요?",
    answer:
      "✅ JobStick은 개발자 직무에 특화된 국내 최초의 AI 모의 면접 플랫폼으로, 직무와 기술 스택에 따라 맞춤 질문과 피드백을 제공합니다.",
  },
];

// 블로그 경로로 이동
const goToBlog = () => {
  router.push("/blog/jobstick-blog");
};

onMounted(() => {
  AOS.init({ once: true, duration: 1000 });
});
</script>

<style scoped>
.white-background {
  background-color: #ffffff;
}

.animate-fade-in {
  animation: fadeIn 1s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.shiny-red {
  color: #e53935;
  animation: shineRed 1.8s infinite alternate;
}
@keyframes shineRed {
  0% {
    text-shadow: 0 0 2px #e53935;
  }
  100% {
    text-shadow: 0 0 10px #e53935;
  }
}

.event-subtitle {
  font-size: 16px;
  margin-top: -8px;
}

.blue-text {
  color: #1976d2;
  font-weight: bold;
}

.red-text {
  color: #e53935;
  font-weight: bold;
}

.shiny-button {
  background: linear-gradient(90deg, #42a5f5, #1e88e5);
  color: white;
  font-weight: bold;
  animation: shine 4s linear infinite;
  box-shadow: 0 4px 12px rgba(66, 165, 245, 0.5);
  transition: transform 0.3s ease;
  background-size: 200% auto;
  border-radius: 30px;
}
.shiny-button:hover {
  transform: scale(1.05);
}

@keyframes shine {
  0% {
    background-position: 0% center;
  }
  100% {
    background-position: 200% center;
  }
}
</style>
