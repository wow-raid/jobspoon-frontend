<template>
  <v-container v-if="!start" align="center">
    <div :style="interviewContainerStyle">
      <v-icon>mdi-account-tie</v-icon><br />
      <div v-html="startMessage"></div>

      <div :style="mt16Style">
        <video
          ref="previewVideo"
          autoplay
          playsinline
          muted
          :style="previewVideoStyle"
        />
        <div :style="buttonGroupStyle">
          <v-btn color="info" @click="checkMediaReady">카메라/마이크 상태 확인</v-btn>
          <v-btn color="success" @click="startRecording">🎥 녹화 시작</v-btn>
          <v-btn color="error" @click="stopRecording">🛑 녹화 종료</v-btn>
          <v-btn color="warning" @click="playRecording" :disabled="!recordedBlob">▶ 영상 재생</v-btn>
        </div>
      </div>
      <v-btn color="primary" :style="mt4Style" @click="handleStartInterview" :disabled="!mediaChecked">
        면접 시작
      </v-btn>
    </div>
  </v-container>

  <v-container v-else fluid :style="pa0Style">
    <div :style="videoWrapStyle">
      <v-row :style="videoRowStyle" no-gutters>
        <v-col cols="6" :style="colRightStyle">
          <div :style="videoBoxStyle">
            <img :src="hhImage" alt="면접관" :style="interviewerImageStyle" />
          </div>
        </v-col>
        <v-col :style="colSpacerStyle"></v-col>
        <v-col cols="6" :style="colLeftStyle">
          <div :style="videoBoxStyle">
            <video
              ref="userVideo"
              v-show="start"
              autoplay
              playsinline
              muted
              :style="userVideoStyle"
            ></video>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-col :style="colSpacerStyle"></v-col>
    <v-col cols="12" :style="centeredColStyle">
      <div
        v-if="visible"
        :style="[interviewContainerStyle, centeredTextBoxStyle, { marginTop: 0, width: '75%' }]"
      >
        <v-icon>mdi-account-tie</v-icon><br />
        <div v-html="startMessage"></div>
      </div>
      <div
        v-else
        :style="[interviewContainerStyle, centeredTextBoxStyle, { marginTop: 0, width: '75%' }]"
      >
        <v-icon>mdi-account-tie</v-icon><br />
        <h2 v-html="formattedAIMessage"></h2>
        <br />
        <div :style="[timerStyle, remainingTime <= 10 ? redTextStyle : {}]">
          남은 시간: {{ Math.floor(remainingTime / 60) }}:{{ (remainingTime % 60).toString().padStart(2, "0") }}
        </div>
      </div>
    </v-col>

    <div v-if="isLoading && !finished" :style="aiMessageStyle">
      <br />
      <p><strong>다음 질문을 준비 중입니다.</strong></p>
      <v-icon>mdi-account-tie</v-icon>
      <div :style="loadingMessageStyle">
        <div :style="dotStyle"></div>
        <div :style="dotStyle"></div>
        <div :style="dotStyle"></div>
      </div>
    </div>

    <v-container v-if="start && !visible" :style="inputAreaStyle">
      <div :style="buttonGroupStyle">
        <button :style="sendButtonStyle" @click="startSTT" :disabled="recognizing">
          {{ recognizing ? "녹음 중..." : "말하기" }}
        </button>
        <button @click="replayQuestion" :style="plainButtonStyle">🗣 AI 질문 듣기</button>
      </div>
      <v-btn color="primary" @click="onAnswerComplete" :disabled="isGenerating">
        <template v-if="isGenerating && finished.value">
          결과 생성 중...
        </template>
        <template v-else-if="isGenerating"> 질문 생성 중... </template>
        <template v-else> 답변 완료 </template>
      </v-btn>
      <div :style="sttLogStyle">
        <template v-if="recognizing">
          <p>🎙️ 입력 중입니다...</p>
        </template>
        <template v-else-if="isGenerating">
          <p style="color: gray">
            {{
              finished.value
                ? "📝 결과를 생성하고 있어요..."
                : "🤖 다음 질문을 생성하고 있어요..."
            }}
          </p>
          <p v-if="sttLog !== ''"><strong>STT 결과:</strong> {{ sttLog }}</p>
        </template>
        <template v-else-if="sttLog !== ''">
          <p><strong>STT 결과:</strong> {{ sttLog }}</p>
        </template>
      </div>
      <v-text-field
        v-model="sttLog"
        label="개발 중: 답변 직접 입력"
        hide-details
        dense
        solo
        style="max-width: 300px"
      />
    </v-container>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useAiInterviewStore } from "../stores/aiInterviewStore";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import "@mdi/font/css/materialdesignicons.css";
import hhImage from "@/assets/images/fixed/al3.png";
import { useHead } from '@vueuse/head'

useHead({
  title: "AI 모의 면접 시작 | 잡스틱(JobStick)",
  meta: [
    { name: "description", content: "AI 기반 모의 면접을 진행하고, 원하는 기업, 직무에 대한 기술 면접을 대비해보세요." },
    { name: "keywords", content: "AI 면접, 모의 면접, 기술 면접, AI 기반 모의 면접, 카메라 테스트, 면접 준비, 온라인 면접, 비대면 면접, 인공지능 면접, JobStick, job-stick, 잡스틱, 개발자 플랫폼, 개발자 취업" },
    { property: "og:title", content: "AI 모의 면접 준비 - 잡스틱(JobStick)" },
    { property: "og:description", content: "잡스틱(JobStick)에서 AI 기반의 실전 면습 연습을 통해 기술 면접의 실전 감각을 길러보세요." },
    { property: "og:image", content: "" },
    { name: "robots", content: "index, follow" },
  ],
});

// ==== 스타일 상수 (생략없이 전체) ====
const interviewContainerStyle = {
  marginTop: "32px",
  border: "1px solid #333",
  padding: "16px",
  borderRadius: "10px",
  width: "70%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  background: "#fff"
};
const mt16Style = { marginTop: "16px" };
const mt4Style = { marginTop: "16px" };
const previewVideoStyle = {
  width: "250px",
  height: "188px",
  background: "#000",
  borderRadius: "8px"
};
const buttonGroupStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "12px",
  marginTop: "12px"
};
const sendButtonStyle = {
  padding: "10px 12px",
  backgroundColor: "black",
  color: "white",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "16px",
  height: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "100px",
  boxSizing: "border-box"
};
const plainButtonStyle = {
  padding: "10px 12px",
  backgroundColor: "#f1f1f1",
  color: "#222",
  border: "none",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "16px",
  height: "40px",
  minWidth: "100px",
  boxSizing: "border-box"
};
const videoWrapStyle = {
  width: "75%",
  margin: "0 auto",
  paddingTop: "16px"
};
const videoRowStyle = {
  marginTop: "24px",
  marginBottom: "24px"
};
const colRightStyle = {
  display: "flex",
  justifyContent: "flex-end",
  padding: 0
};
const colLeftStyle = {
  display: "flex",
  justifyContent: "flex-start",
  padding: 0
};
const colSpacerStyle = {
  maxWidth: "16px",
  padding: 0
};
const videoBoxStyle = {
  width: "100%",
  aspectRatio: "4 / 3",
  border: "2px solid #ccc",
  borderRadius: "12px",
  overflow: "hidden",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#000"
};
const interviewerImageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};
const userVideoStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover"
};
const centeredColStyle = {
  maxWidth: "100%",
  display: "flex",
  justifyContent: "center",
  padding: 0,
  marginTop: "16px"
};
const centeredTextBoxStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center"
};
const timerStyle = {
  fontWeight: "bold",
  margin: "16px 0",
  fontSize: "20px"
};
const redTextStyle = {
  color: "red"
};
const aiMessageStyle = {
  margin: "20px 0",
  textAlign: "center"
};
const loadingMessageStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  justifyContent: "center"
};
const dotStyle = {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
  backgroundColor: "#6366f1",
  margin: "0 2px",
  animation: "dot-blink 1.4s infinite both"
};
const inputAreaStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "20px",
  width: "50%",
  marginBottom: 0
};
const sttLogStyle = {
  marginTop: "8px",
  textAlign: "center"
};
const pa0Style = { padding: 0 };

// ==== 미디어 쿼리 및 애니메이션 직접 동적 삽입 ====
if (typeof window !== "undefined") {
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    @media (max-width: 768px) {
      .button-group, [style*="display: flex"][style*="gap: 12px"] {
        flex-direction: column !important;
        align-items: stretch !important;
      }
      .button-group > *, [style*="display: flex"][style*="gap: 12px"] > * {
        width: 100% !important;
      }
      .input-area, [style*="width: 50%"] {
        width: 100% !important;
      }
    }
    @keyframes dot-blink {
      0%, 80%, 100% { opacity: 0; }
      40% { opacity: 1; }
    }
  `;
  document.head.appendChild(styleTag);
}

// ======= script 로직 (전부) =======
const router = useRouter();
const aiInterviewStore = useAiInterviewStore();

const start = ref(false);
const visible = ref(true);
const isLoading = ref(false);
const finished = ref(false);
const recognizing = ref(false);
const sttLog = ref("");
const currentAIMessage = ref("");
const currentQuestionId = ref(1);
const currentInterviewId = ref(null);
const remainingTime = ref(90);
const timer = ref(null);
const maxQuestionId = ref(10);
const startMessage = ref("");
const userVideo = ref(null);
const mediaChecked = ref(false);
const previewVideo = ref(null);
const mediaStream = ref(null);
const isGenerating = ref(false);

const mapCompanyName = (original) => {
  const mapping = {
    당근마켓: "danggeun",
    Toss: "toss",
    "SK-encore": "sk_encore",
    "KT M mobile": "kt_mobile",
  };
  return mapping[original] || original.toLowerCase().replace(/[\s-]+/g, "_");
};

const checkMediaReady = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    mediaChecked.value = true;
    alert("마이크와 카메라가 정상적으로 작동합니다.");
    mediaStream.value = stream;
    if (previewVideo.value) previewVideo.value.srcObject = stream;
  } catch (err) {
    alert("마이크 또는 카메라에 접근할 수 없습니다. 브라우저 권한을 확인하세요.");
    mediaChecked.value = false;
  }
};

const recordedVideo = ref(null);
const recordedBlob = ref(null);
let recordingStream = null;
let recorder = null;
let chunks = [];
const startRecording = async () => {
  try {
    recordingStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (previewVideo.value) previewVideo.value.srcObject = recordingStream;

    chunks = [];
    recorder = new MediaRecorder(recordingStream, { mimeType: "video/webm" });

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      recordedBlob.value = new Blob(chunks, { type: "video/webm" });
      const videoURL = URL.createObjectURL(recordedBlob.value);
      localStorage.setItem("interviewRecordingUrl", videoURL);
      if (previewVideo.value) {
        previewVideo.value.srcObject = null;
        previewVideo.value.src = videoURL;
        previewVideo.value.controls = true;
        previewVideo.value.play();
      }
    };
    recorder.start();
    alert("녹화를 시작합니다다");
  } catch (err) {
    console.error("🎥 녹화 시작 실패:", err);
    alert("녹화 시작 중 오류가 발생했습니다.");
  }
};
const stopRecording = () => {
  if (recorder && recorder.state === "recording") {
    recorder.stop();
    if (recordingStream) {
      recordingStream.getTracks().forEach((track) => track.stop());
    }
    alert("녹화 종료됨");
  }
};

let recognition;
const synth = process.client ? window.speechSynthesis : null;
let currentUtteance = null;

onMounted(async () => {
  try {
    const videoOnlyStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    if (previewVideo.value) {
      previewVideo.value.srcObject = videoOnlyStream;
    }
  } catch (err) {
    console.error("previewVideo 카메라 연결 실패:", err);
  }
  if (process.client) {
    speakStartMessage();

    await nextTick();

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("이 브라우저는 음성 인식을 지원하지 않습니다.");
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.onstart = () => (recognizing.value = true);
    recognition.onend = () => (recognizing.value = false);
    recognition.onerror = () => (recognizing.value = false);
    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      sttLog.value += finalTranscript;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
  }
});

const showWarning = ref(true);

const speakStartMessage = () => {
  startMessage.value = `
    <strong style="display: flex; flex-direction: column; align-items: center;">
      <span style="margin-bottom: 8px;">AI 모의 면접이 곧 시작됩니다.</span>
      <span style="margin-bottom: 8px;">면접 질문이 화면에 표시되며, 자동으로 음성으로 읽어드립니다.</span>
      <span style="margin-bottom: 8px;"><mark style="background: #ffecb3;">말하기 버튼</mark>을 눌러 답변을 시작해 주세요.</span>
      <span style="margin-bottom: 8px;">마이크와 카메라가 정상적으로 작동 중인지 확인해 주세요.</span>
      ${
        showWarning.value
          ? '<span style="color: red; font-weight: bold;">※ 카메라/마이크 상태 확인을 체크해야 면접 시작이 가능합니다.</span>'
          : ""
      }
    </strong>
  `;
};

const formattedAIMessage = computed(() => {
  return currentAIMessage.value.replace(/([.?])/g, "$1<br>");
});

const replayQuestion = () => {
  if (synth?.speaking) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(currentAIMessage.value);
  utterance.lang = "ko-KR";
  utterance.rate = 0.85;
  utterance.pitch = 1.0;
  setTimeout(() => synth?.speak(utterance), 100);
};

const handleBeforeUnload = (event) => {
  if (start.value && !finished.value) {
    event.preventDefault();
    event.returnValue = "면접이 진행 중입니다. 페이지를 나가시겠습니까?";
  }
};

const speakCurrentMessage = () => {
  clearInterval(timer.value);
  remainingTime.value = 90;
  currentUtteance = new SpeechSynthesisUtterance(currentAIMessage.value);
  currentUtteance.lang = "ko-KR";
  currentUtteance.rate = 0.85;
  currentUtteance.pitch = 1.0;
  currentUtteance.onend = () => startTimer();
  synth?.speak(currentUtteance);
};

const showStartMessage = () => {
  visible.value = false;
  speakCurrentMessage();
};

const startTimer = () => {
  clearInterval(timer.value);
  timer.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      clearInterval(timer.value);
      onAnswerComplete();
    }
  }, 1000);
};

const startSTT = () => {
  if (recognition && !recognizing.value) {
    sttLog.value = "";
    recognition.start();
  }
};
const startRecordingAuto = async () => {
  try {
    recordingStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    if (userVideo.value) {
      userVideo.value.srcObject = recordingStream;
    }
    chunks = [];
    recorder = new MediaRecorder(recordingStream, { mimeType: "video/webm" });
    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.push(event.data);
    };
    recorder.onstop = () => {
      recordedBlob.value = new Blob(chunks, { type: "video/webm" });
      const videoURL = URL.createObjectURL(recordedBlob.value);
      localStorage.setItem("interviewRecordingUrl", videoURL);
    };
    recorder.start();
    console.log("녹화 시작");
  } catch (err) {
    console.error("녹화 실패");
  }
};
const stopRecordingAuto = () => {
  if (recorder && recorder.state === "recording") {
    recorder.stop();
    if (recordingStream) {
      recordingStream.getTracks().forEach((track) => track.stop());
    }
    console.log("녹화 종료");
  }
};
const handleStartInterview = async () => {
  const info = JSON.parse(localStorage.getItem("interviewInfo") || "{}");
  const processedCompanyName = mapCompanyName(info.company);

  if (!info.tech || !info.exp) {
    alert("면접 정보를 찾을 수 없습니다. 처음으로 돌아갑니다.");
    router.push("/ai-interview");
    return;
  }
  start.value = true;
  await startRecordingAuto();

  showWarning.value = false;
  speakStartMessage();

  const res = await aiInterviewStore.requestCreateInterviewToDjango({
    userToken: localStorage.getItem("userToken"),
    jobCategory: info.tech,
    experienceLevel: info.exp,
    academicBackground: info.academic,
    projectExperience: info.project,
    interviewTechStack: info.skills,
    companyName: processedCompanyName,
  });
  currentInterviewId.value = Number(res.interviewId);
  currentQuestionId.value = 1;
  currentAIMessage.value = res.question;
  const utterance = new SpeechSynthesisUtterance(
    "AI 모의 면접이 곧 시작됩니다. 면접 질문이 화면에 표시되며, 자동으로 음성으로 읽어드립니다."
  );
  utterance.lang = "ko-KR";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.onend = () => showStartMessage();
  synth?.cancel();
  synth?.speak(utterance);
};

const onAnswerComplete = async () => {
  isGenerating.value = true;

  clearInterval(timer.value);
  if (recognition && recognizing.value) recognition.stop();

  if (!sttLog.value.trim()) {
    alert("음성 인식 결과가 없습니다.");
    isGenerating.value = false;
    return;
  }
  if (currentQuestionId.value >= maxQuestionId.value) {
    alert("모든 면접이 완료되었습니다");
    finished.value = true;
    isGenerating.value = true;
    return;
  }

  const info = JSON.parse(localStorage.getItem("interviewInfo") || "{}");
  const processedCompanyName = mapCompanyName(info.company);
  const payload = {
    userToken: localStorage.getItem("userToken"),
    interviewId: currentInterviewId.value,
    questionId: currentQuestionId.value,
    answerText: sttLog.value,
    jobCategory: info.tech,
    experienceLevel: info.exp,
    academicBackground: info.academic,
    projectExperience: info.project,
    interviewTechStack: info.skills,
    companyName: processedCompanyName,
  };
  await aiInterviewStore.requestCreateAnswerToDjango(payload);

  let nextQuestion = null;
  let nextQuestionId = null;
  if (currentQuestionId.value === 1) {
    const followUp = await aiInterviewStore.requestFollowUpQuestionToDjango(
      payload
    );
    nextQuestion = followUp?.questions?.[0];
    nextQuestionId = followUp?.questionIds?.[0];
  } else if (currentQuestionId.value === 2) {
    const projectMain =
      await aiInterviewStore.requestProjectCreateInterviewToDjango(payload);
    nextQuestion = projectMain?.question?.[0];
    nextQuestionId = projectMain?.questionId;
  } else if (currentQuestionId.value === 3 || currentQuestionId.value === 4) {
    const projectFollowUp =
      await aiInterviewStore.requestProjectFollowUpQuestionToDjango(payload);
    nextQuestion = projectFollowUp?.questions?.[0];
    nextQuestionId = projectFollowUp?.questionIds?.[0];
  } else if (currentQuestionId.value === 5) {
    const techFollowUp =
      await aiInterviewStore.requestTechFollowUpQuestionToDjango(payload);
    nextQuestion = techFollowUp?.questions?.[0];
    nextQuestionId = techFollowUp?.questionIds?.[0];
  } else {
    finished.value = true;
    await nextTick();
    isGenerating.value = true;
    await nextTick();
    alert("모든 면접 질문이 완료되었습니다.");
    clearInterval(timer.value);
    stopRecordingAuto();
    await aiInterviewStore.requestEndInterviewToDjango(payload);
    await aiInterviewStore.requestGetScoreResultListToDjango(payload);
    router.push("/ai-interview/result");
    return;
  }

  if (!nextQuestion || !nextQuestionId) {
    alert("다음 질문을 불러오지 못했습니다.");
    isGenerating.value = false;
    return;
  }

  currentQuestionId.value = nextQuestionId;
  currentAIMessage.value = nextQuestion;
  sttLog.value = "";
  speakCurrentMessage();

  isGenerating.value = false;
};

onBeforeUnmount(() => {
  if (synth?.speaking) synth.cancel();
  localStorage.removeItem("interviewInfo");
  clearInterval(timer.value);
  window.removeEventListener("beforeunload", handleBeforeUnload);
});

onBeforeRouteLeave((to, from, next) => {
  if (start.value && !finished.value) {
    const answer = window.confirm(
      "면접이 진행 중입니다. 페이지를 나가시겠습니까?"
    );
    answer ? next() : next(false);
  } else {
    next();
  }
});
const playRecording = () => {
  if (recordedBlob.value) {
    const videoURL = URL.createObjectURL(recordedBlob.value);
    if (previewVideo.value) {
      previewVideo.value.srcObject = null;
      previewVideo.value.src = videoURL;
      previewVideo.value.controls = true;
      previewVideo.value.play();
    }
  }
};
</script>
