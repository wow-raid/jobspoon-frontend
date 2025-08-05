<template>
  <main>
    <v-container :style="reportContainerStyle">
      <h1 :style="reportTitleStyle">AI 모의면접 결과</h1>
      <v-divider :style="mb4Style" thickness="2" color="white" />
      <v-col cols="12">
        <v-card :style="cardStyle">
          <v-row align="stretch" justify="center" :style="resultSummaryRowStyle" no-gutters>
            <v-col
              cols="12"
              md="5"
              :style="summaryColStyle"
            >
              <p :style="subtitleStyle">실무자 면접 결과</p>
              <h1 :style="gradeStyle">{{ grade }}</h1>
            </v-col>
            <v-divider vertical :style="thickDividerStyle" class="mx-4 d-none d-md-block" />
            <v-col cols="12" md="5" :style="summaryChartColStyle">
              <HexagonChart :scoreList="scoreList" />
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-row
        v-for="(item, index) in inputList"
        :key="index"
        :style="questionBoxStyle"
        class="my-6"
      >
        <v-col cols="12">
          <h3 :style="questionTitleStyle">{{ index + 1 }}.{{ item.question }}</h3>
          <div :style="answerSectionStyle">
            <h4 :style="sectionTitleStyle">📄 당신의 답변</h4>
            <p :style="answerTextStyle">{{ item.answer }}</p>
          </div>
          <div :style="evaluationSectionStyle">
            <h4 :style="sectionTitleStyle">AI 평가 결과</h4>
            <p><strong>의도파악:</strong> {{ item.intent }}</p>
            <p><strong>피드백:</strong></p>
            <p :style="feedbackTextStyle">{{ item.feedback }}</p>
          </div>
        </v-col>
      </v-row>
      <div v-if="downloadUrl" :style="downloadRowStyle" :class="{ 'no-print': true }">
        <a
          :href="downloadUrl"
          download="interview-recording.webm"
          :style="downloadLinkStyle"
        >
          🎥 녹화 영상 다운로드
        </a>
        <v-btn color="primary" @click="handlePrint" class="no-print">
          🖨️ 인쇄하기
        </v-btn>
      </div>
    </v-container>
  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useAiInterviewStore } from "../../stores/aiInterviewStore";
import HexagonChart from "../result/HexagonChart.vue";
import { useHead } from '@vueuse/head'

// ✅ SEO 메타 정보
useHead({
  title: "AI 면접 결과 보기 | 잡스틱(JobStick)",
  meta: [
    { name: "description", content: "AI 기반 모의 면접 결과를 확인하고, 나의 강점과 개선점을 분석해보세요." },
    { name: "keywords", content: "AI 면접, 면접 결과, 자기 분석, 모의 면접, AI 분석, JotStick, job-stick, 잡스틱, 개발자 취업, 개발자 플랫폼" },
    { property: "og:title", content: "AI 면접 결과 - 잡스틱(JobStick)" },
    { property: "og:description", content: "AI가 분석한 나의 면접 결과를 지금 확인해보세요." },
    { property: "og:image", content: "" },
    { name: "robots", content: "index, follow" },
  ],
});

// =============================
// 👇 [스타일 객체/상수 정의 영역] 👇
// =============================
const reportContainerStyle = {
  maxWidth: "850px",
  margin: "auto",
  padding: "40px 30px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
  borderRadius: "16px",
};
const reportTitleStyle = {
  fontSize: "32px",
  fontWeight: "bold",
  textAlign: "center",
  color: "#333",
};
const mb4Style = { marginBottom: "16px" };
const cardStyle = {
  padding: "24px",
  borderRadius: "20px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
};
const resultSummaryRowStyle = { flexWrap: "wrap" };
const summaryColStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};
const subtitleStyle = { fontSize: "16px", marginBottom: "10px", color: "#555" };
const gradeStyle = { fontSize: "40px", fontWeight: "bold", color: "#18204A", margin: 0 };
const summaryChartColStyle = { display: "flex", justifyContent: "center", alignItems: "center" };
const thickDividerStyle = {
  backgroundColor: "#000000",
  width: "5px",
  minWidth: "5px",
  maxWidth: "5px",
  borderRadius: "2px",
};
const questionBoxStyle = {
  backgroundColor: "#f0f5ff",
  borderRadius: "12px",
  marginBottom: "24px",
  padding: "24px",
  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};
const questionTitleStyle = { fontSize: "20px", fontWeight: "bold", marginBottom: "16px" };
const answerSectionStyle = {
  marginTop: "12px",
  padding: "16px",
  borderRadius: "8px",
  backgroundColor: "#fff",
  border: "1px solid #cbd7f1",
};
const evaluationSectionStyle = {
  marginTop: "12px",
  padding: "16px",
  borderRadius: "8px",
  backgroundColor: "#fff",
  border: "1px solid #cbd7f1",
};
const sectionTitleStyle = {
  marginBottom: "10px",
  fontWeight: 600,
  color: "#2c3e50",
};
const answerTextStyle = {
  fontSize: "15px",
  lineHeight: 1.7,
  whiteSpace: "pre-line",
  color: "#444",
  paddingLeft: "10px",
};
const feedbackTextStyle = {
  fontSize: "15px",
  lineHeight: 1.7,
  whiteSpace: "pre-line",
  color: "#444",
  paddingLeft: "10px",
};
const downloadRowStyle = { textAlign: "center", marginTop: "16px" };
const downloadLinkStyle = { color: "blue", textDecoration: "underline", marginRight: "20px" };

// =============================
// 👆 [스타일 객체/상수 정의 끝] 👆
// =============================

// 🟠 [미디어쿼리/프린트/숨김 등 특수 스타일 동적 삽입]
const STYLE_TAG_ID = "ai-report-inline-style";
function injectDynamicStyle() {
  if (document.getElementById(STYLE_TAG_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = `
    /* thick-divider - md 이상에서만 보이게 */
    @media (min-width: 960px) {
      .mb-md-0 { margin-bottom: 0 !important; }
      .d-md-block { display: block !important; }
    }
    .thick-divider {
      background-color: #000000 !important;
      width: 5px !important;
      min-width: 5px !important;
      max-width: 5px !important;
      border-radius: 2px !important;
    }
    @media print {
      .no-print { display: none !important; }
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        margin: 0 !important;
        background: white !important;
      }
      .report-container, .report-containeer {
        box-shadow: none !important;
        padding: 0 !important;
      }
      a {
        color: black !important;
        text-decoration: none !important;
      }
    }
  `;
  document.head.appendChild(style);
}
function removeDynamicStyle() {
  const style = document.getElementById(STYLE_TAG_ID);
  if (style) style.remove();
}

// =============================
// [컴포넌트 논리 영역]
// =============================
const aiInterviewStore = useAiInterviewStore();
const router = useRouter();
const inputList = ref([]);
const downloadUrl = ref(null);
const grade = ref("");
const scoreList = ref([]);
const calculateGrade = (scores) => {
  const total = scores.reduce((sum, item) => sum + item.score, 0);
  if (total >= 54) return "A";
  if (total >= 45) return "B";
  if (total >= 30) return "C";
  if (total >= 15) return "D";
  return "F";
};
const userToken = ref("");
onMounted(async () => {
  injectDynamicStyle();
  userToken.value = localStorage.getItem("userToken");
  await getScoreResultList(userToken.value);
  const saveUrl = localStorage.getItem("interviewRecordingUrl");
  if (saveUrl) downloadUrl.value = saveUrl;
});
onBeforeUnmount(() => {
  removeDynamicStyle();
  if (downloadUrl.value) {
    URL.revokeObjectURL(downloadUrl.value);
  }
  localStorage.removeItem("interviewRecordingUrl");
});
const getScoreResultList = async (userToken) => {
  try {
    const res = await aiInterviewStore.requestGetInterviewResultToDjango({
      userToken: userToken,
    });
    inputList.value = res.interviewResultList;
    const hexagon = res.hexagonScore || {};
    scoreList.value = [
      { type: "생산성", score: hexagon.productivity || 0 },
      { type: "의사소통", score: hexagon.communication || 0 },
      { type: "개발역량", score: hexagon.technical_skills || 0 },
      { type: "문서작성", score: hexagon.documentation_skills || 0 },
      { type: "유연성", score: hexagon.flexibility || 0 },
      { type: "의사결정력", score: hexagon.problem_solving || 0 },
    ];
    grade.value = calculateGrade(scoreList.value);
  } catch (err) {
    console.error("❌ 면접 결과 불러오기 실패:", err);
  }
};
const handlePrint = () => {
  window.print();
};
</script>
