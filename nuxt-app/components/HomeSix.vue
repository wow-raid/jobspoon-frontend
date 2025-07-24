<template>
  <v-container class="py-14" data-aos="fade-up">
    <!-- 상단 제목 -->
    <v-row justify="center">
      <v-col cols="12" md="10" class="text-center">
        <h1 class="text-h4 font-weight-bold animate-fade-in" data-aos="fade-up">
          ✨ 단순한 질문이 아닌, <br />나에게 꽤 맞는 AI 메인 질문
        </h1>
        <p class="text-subtitle-1 mt-4" data-aos="fade-up" data-aos-delay="200">
          기존 모의 메뉴 플랫폼은 면접자의 <strong>경력도 직무도 고려하지 않고</strong><br />
          모두에게 동일한 질문을 덕질됩니다.
        </p>
      </v-col>
    </v-row>

    <!-- 좌우 구조 -->
    <v-row class="mt-12" align="start">
      <!-- 좌측 키워드 버튼 -->
      <v-col cols="12" md="6" class="text-left" data-aos="fade-right" data-aos-delay="400">
        <div class="d-flex flex-wrap justify-start gap-2">
          <v-btn
            v-for="tag in keywordTags"
            :key="tag"
            color="primary"
            variant="outlined"
            class="rounded-pill glow-button"
          >
            {{ tag }}
          </v-btn>
        </div>
        <p class="mt-2 text-caption text-left">
          ※ 사용자가 선택할 수 있는 직무, 경력, 기술 키워드입니다
        </p>
      </v-col>

      <!-- 우측 설명 + 타이핑 -->
      <v-col cols="12" md="5" offset-md="1" class="pl-md-8" data-aos="fade-left" data-aos-delay="600">
        <h2 class="text-h5 font-weight-bold mb-4 typing-line" v-html="typedTitle" ref="titleRef"></h2>
        <p class="text-subtitle-1">
          <span class="text-primary font-weight-bold">JOBSTICK</span>은 면접자가
          <strong>지원하는 직무</strong>, <strong>경력 수준</strong>,<br />
          <strong>기술 스택</strong>을 선택하면 그에 맞는 <strong>맞춤형 질문</strong>을 자동으로 생성합니다.
        </p>
        <p class="text-subtitle-1 mt-4">
          신입 개발자에게는 결력 위의 질문을,<br />
          경력직에게는 프로젝트 중심의 기술 질문을 제시해서<br />
          <strong>실제 면접처럼</strong> 상황별 연습이 가능합니다.
        </p>
        <p class="text-subtitle-1 mt-4 font-weight-bold typing-line" v-html="typedFinal"></p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import AOS from "aos";
import "aos/dist/aos.css";

const keywordTags = [
  "Backend", "Frontend", "App.Web", "Ai", "Embedded", "DevOps",
  "전공자", "비전공자", "신입", "3년차", "5년차", "10년 이상",
  "프로젝트 경험", "푸른스틱", "ASP", "JSP", "JAVA", "Flutter",
  "Python", "AWS", "Vue.js", "웹개발", "Node.js", "PHP",
  "Bootstrap", "HTML5", "GraphQL", "JQuery", "JavaScript"
];

const typedTitle = ref("");
const typedFinal = ref("");
const titleRef = ref(null);

const textTitle = `<span class="text-primary font-weight-bold">JOBSTICK</span>은 맞춤형 질문 생성 시스템!`;
const textFinal = `<span class="strong-red">더 이상 비용한 질문이 아닌, <br />당신의 커리어에 맞춤 AI 질문을 받아보세요.</span><span class="cursor">|</span>`;

function typeText(text, targetRef, delay = 15, nextFn = null) {
  let i = 0;
  const interval = setInterval(() => {
    targetRef.value = text.slice(0, i);
    i++;
    if (i > text.length) {
      clearInterval(interval);
      if (nextFn) nextFn();
    }
  }, delay);
}

function resetTyping() {
  typedTitle.value = "";
  typedFinal.value = "";
  typeText(textTitle, typedTitle, 15, () => {
    setTimeout(() => typeText(textFinal, typedFinal, 12), 300);
  });
}

onMounted(() => {
  AOS.init({ duration: 1000, once: false });
  nextTick(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          resetTyping();
        }
      });
    }, { threshold: 0.3 });

    if (titleRef.value) observer.observe(titleRef.value);
  });
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 1.2s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.glow-button {
  animation: glow 2s infinite ease-in-out;
  border-width: 2px;
}
@keyframes glow {
  0%   { box-shadow: 0 0 5px #42a5f5; border-color: #42a5f5; }
  50%  { box-shadow: 0 0 15px #90caf9; border-color: #90caf9; }
  100% { box-shadow: 0 0 5px #42a5f5; border-color: #42a5f5; }
}

.typing-line {
  min-height: 1.5em;
  white-space: pre-wrap;
}

:deep(.strong-red) {
  color: #ff0000;
}

.cursor {
  font-weight: 600;
  margin-left: 2px;
  animation: blink 1s infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
