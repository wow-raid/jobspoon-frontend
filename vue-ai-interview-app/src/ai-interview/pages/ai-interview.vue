<template>
  <v-container v-if="!start" :style="interviewStartContainerStyle" fluid>
    <div :style="interviewStartWrapperStyle">
      <!-- 헤더 섹션 추가 -->


      <!-- 메인 카드 섹션 -->
      <v-card :style="cameraSectionStyle">
        <v-card-text :style="cameraCardTextStyle">
          <div :style="interviewStepsStyle">
            <div :style="stepItemStyle">
              <div :style="stepNumberStyle">1</div>
              <div :style="stepContentStyle">
                <h3 :style="stepTitleStyle">카메라/마이크 확인</h3>
                <p :style="stepDescStyle">장치가 정상적으로 작동하는지 확인하세요</p>
              </div>
            </div>
            <div :style="stepItemStyle">
              <div :style="stepNumberStyle">2</div>
              <div :style="stepContentStyle">
                <h3 :style="stepTitleStyle">테스트 녹화</h3>
                <p :style="stepDescStyle">짧은 영상을 녹화하고 재생해보세요</p>
              </div>
            </div>
            <div :style="stepItemStyle">
              <div :style="stepNumberStyle">3</div>
              <div :style="stepContentStyle">
                <h3 :style="stepTitleStyle">면접 시작</h3>
                <p :style="stepDescStyle">모든 준비가 완료되면 면접을 시작하세요</p>
              </div>
            </div>
          </div>

          <div :style="mainContentStyle">
            <!-- 카메라 미리보기 섹션 -->
            <div :style="cameraPreviewSectionStyle">
              <div :style="cameraContainerStyle">
                <video
                  ref="previewVideo"
                  autoplay
                  playsinline
                  muted
                  :style="previewVideoStyle"
                />
                <div :style="videoOverlayStyle" v-if="!mediaChecked">
                  <v-icon size="48" color="white">mdi-video-off</v-icon>
                  <p :style="overlayTextStyle">카메라 연결이 필요합니다</p>
                </div>
                <div :style="cameraStatusBadgeStyle" v-if="mediaChecked">
                  <v-icon size="16" color="white">mdi-check-circle</v-icon>
                  <span>준비 완료</span>
                </div>
              </div>
            </div>

            <!-- 안내 메시지 섹션 -->
            <div :style="infoSectionStyle">

              <div :style="tipsSectionStyle">
                <h3 :style="tipsTitleStyle">
                  <v-icon color="amber darken-2">mdi-lightbulb</v-icon>
                  면접 팁
                </h3>
                <ul :style="tipsListStyle">
                  <li :style="tipsItemStyle">밝은 조명 아래에서 면접을 진행하세요</li>
                  <li :style="tipsItemStyle">배경 소음이 적은 조용한 환경을 준비하세요</li>
                  <li :style="tipsItemStyle">카메라를 눈높이에 맞추고 정면을 응시하세요</li>
                  <li :style="tipsItemStyle">면접 전 심호흡으로 긴장을 풀어보세요</li>
                </ul>
              </div>
            </div>
          </div>
          
          <!-- 컨트롤 버튼 섹션 -->
          <div :style="controlSectionStyle">
            <div :style="cameraControlsStyle">
              <v-btn 
                color="primary" 
                :style="cameraControlBtnStyle" 
                elevation="2" 
                rounded 
                @click="checkMediaReady"
              >
                <v-icon left>mdi-camera-check</v-icon>
                카메라/마이크 확인
              </v-btn>
              
              <v-btn 
                color="success" 
                :style="cameraControlBtnStyle" 
                elevation="2" 
                rounded 
                @click="startRecording"
              >
                <v-icon left>mdi-video</v-icon>
                녹화 시작
              </v-btn>
              
              <v-btn 
                color="error" 
                :style="cameraControlBtnStyle" 
                elevation="2" 
                rounded 
                @click="stopRecording"
              >
                <v-icon left>mdi-stop-circle</v-icon>
                녹화 종료
              </v-btn>
              
              <v-btn 
                color="info" 
                :style="cameraControlBtnStyle" 
                elevation="2" 
                rounded 
                @click="playRecording" 
                :disabled="!recordedBlob"
              >
                <v-icon left>mdi-play</v-icon>
                영상 재생
              </v-btn>
            </div>
          </div>

          <!-- 면접 시작 버튼 섹션 -->
          <div :style="startInterviewSectionStyle">
            <v-btn
              color="warning"
              :style="startInterviewBtnStyle"
              elevation="3"
              rounded
              x-large
              @click="handleStartInterview"
              :disabled="!mediaChecked"
            >
              <v-icon left size="24">mdi-account-tie</v-icon>
              면접 시작하기
            </v-btn>
            <p :style="startDisclaimerStyle" v-if="!mediaChecked">카메라/마이크 확인 후 면접을 시작할 수 있습니다</p>
          </div>
        </v-card-text>
      </v-card>
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
  border: "1px solid rgba(0, 0, 0, 0.08)",
  padding: "16px",
  borderRadius: "16px",
  width: "70%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  background: "#fff",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)"
};
const mt16Style = { marginTop: "16px" };
const mt4Style = { marginTop: "16px" };

// 새로운 스타일 객체 추가
const mainContentStyle = {
  display: "flex",
  flexDirection: "row",
  gap: "24px",
  marginTop: "24px",
  marginBottom: "24px",
  width: "100%",
  height: "100%",
  flexWrap: "wrap"
};

const cameraPreviewSectionStyle = {
  flex: "1",
  minWidth: "300px",
  minHeight: "300px"
};

const infoSectionStyle = {
  flex: "1",
  minWidth: "300px",
  display: "flex",
  flexDirection: "column",
  gap: "16px"
};

const controlSectionStyle = {
  marginTop: "16px",
  borderTop: "1px solid rgba(0, 0, 0, 0.05)",
  paddingTop: "16px"
};

const startInterviewSectionStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "24px",
  gap: "12px"
};

const startDisclaimerStyle = {
  fontSize: "14px",
  color: "#f44336",
  margin: "8px 0 0 0"
};

const cameraStatusBadgeStyle = {
  position: "absolute",
  top: "12px",
  right: "12px",
  backgroundColor: "rgba(76, 175, 80, 0.8)",
  color: "white",
  padding: "4px 8px",
  borderRadius: "16px",
  fontSize: "12px",
  display: "flex",
  alignItems: "center",
  gap: "4px",
  backdropFilter: "blur(2px)"
};

// const tipsSectionStyle = {
//   backgroundColor: "#fff8e1",
//   borderRadius: "12px",
//   padding: "16px",
//   border: "1px solid rgba(255, 193, 7, 0.2)"
// };

const cameraSectionTextStyle = {
  marginLeft: "24px",
};

const buttonGroupStyle = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "12px",
  marginTop: "12px"
};

const cameraCardStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexWrap: "wrap"
}
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
    @keyframes dot-blink {
      0%, 80%, 100% { opacity: 0; }
      40% { opacity: 1; }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
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
  `;
  document.head.appendChild(styleTag);
}

// 스타일 객체 정의
const interviewStartContainerStyle = {
  padding: "16px 12px",
  maxWidth: "900px",
  margin: "0 auto",
  // background: "linear-gradient(to bottom, #f9fafc, #f0f4f8)"
};

const interviewStartWrapperStyle = {
  marginBottom: "20px",
  display: "flex",
  flexDirection: "column",
  animation: "fadeIn 0.8s ease-out",
  alignItems: "center",
  justifyContent: "center"
};

const interviewHeaderStyle = {
  textAlign: "center",
  marginBottom: "16px",
  padding: "16px 0",
  position: "relative"
};

const interviewLogoStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  marginBottom: "8px"
};

const interviewLogoTextStyle = {
  fontSize: "32px",
  fontWeight: "800",
  margin: "0",
  background: "linear-gradient(90deg, #3f51b5, #2196f3, #00bcd4)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "-0.5px",
  textShadow: "0 2px 10px rgba(33, 150, 243, 0.1)"
};

const interviewSubtitleStyle = {
  fontSize: "18px",
  color: "#555",
  marginTop: "8px",
  fontWeight: "500",
  maxWidth: "600px",
  margin: "8px auto 0"
};

// 카메라 섹션 스타일
const cameraSectionStyle = {
  minWidth: "1100px",
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06)",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  background: "#fff",
  padding: "25px",
  marginBottom: "16px",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)"
};

const cameraCardTextStyle = {
  padding: "16px"
};

const cameraContainerStyle = {
  position: "relative",
  width: "100%",
  height: "100%",
  paddingBottom: "45%", // 16:9 비율에서 더 작게 조정
  background: "linear-gradient(to right, #000, #111)",
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
  border: "1px solid rgba(255, 255, 255, 0.1)"
};

const previewVideoStyle = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  objectFit: "cover"
};

const videoOverlayStyle = {
  position: "absolute",
  top: "0",
  left: "0",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(0, 0, 0, 0.7)",
  color: "white",
  backdropFilter: "blur(4px)"
};

const overlayTextStyle = {
  marginTop: "12px",
  fontSize: "18px",
  fontWeight: "500",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"
};

const cameraControlsStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  justifyContent: "center",
  marginTop: "12px"
};

const cameraControlBtnStyle = {
  flexGrow: "1",
  minWidth: "110px",
  padding: "8px 0",
  borderRadius: "8px",
  fontWeight: "500",
  fontSize: "13px",
  letterSpacing: "0.2px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.08)",
  transition: "all 0.3s ease",
  textTransform: "none"
};

// 면접 정보 섹션 스타일
const interviewInfoSectionStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "24px"
};

const interviewCardStyle = {
  borderRadius: "20px",
  overflow: "hidden",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.7)",
  background: "#fff"
};

const startMessageStyle = {
  backgroundColor: "#e3f2fd",
  padding: "10px",
  borderRadius: "8px",
  borderLeft: "3px solid #2196f3",
  marginBottom: "12px",
  fontSize: "13px",
  lineHeight: "1.5",
  color: "#0d47a1",
  boxShadow: "0 1px 4px rgba(33, 150, 243, 0.12)"
};

const interviewStepsStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "16px",
  flexWrap: "wrap",
  gap: "8px"
};

const stepItemStyle = {
  flex: "1",
  minWidth: "140px",
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  padding: "10px",
  borderRadius: "10px",
  backgroundColor: "rgba(63, 81, 181, 0.05)",
  transition: "all 0.3s ease",
  border: "1px solid rgba(63, 81, 181, 0.1)",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.03)",
  backdropFilter: "blur(10px)",
  WebkitBackdropFilter: "blur(10px)"
};

const stepNumberStyle = {
  width: "28px",
  height: "28px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #3f51b5, #2196f3, #03a9f4)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
  fontSize: "14px",
  boxShadow: "0 2px 4px rgba(33, 150, 243, 0.3)"
};

const stepContentStyle = {
  flex: "1"
};

const stepTitleStyle = {
  marginTop: "0",
  marginBottom: "4px",
  fontSize: "14px",
  color: "#333",
  fontWeight: "600"
};

const stepDescStyle = {
  margin: "0",
  color: "#555",
  fontSize: "12px",
  lineHeight: "1.4"
};

const interviewActionsStyle = {
  padding: "12px 16px 16px",
  borderTop: "1px solid rgba(0, 0, 0, 0.05)"
};

const startInterviewBtnStyle = {
  textTransform: "none",
  fontSize: "15px",
  letterSpacing: "0.3px",
  transition: "all 0.3s ease",
  fontWeight: "600",
  boxShadow: "0 4px 8px rgba(255, 152, 0, 0.25)",
  padding: "8px 24px",
  minWidth: "180px"
};

const tipsSectionStyle = {
  backgroundColor: "#fff8e1",
  borderRadius: "12px",
  padding: "12px",
  boxShadow: "0 2px 8px rgba(255, 193, 7, 0.12)",
  border: "1px solid rgba(255, 193, 7, 0.2)"
};

const tipsTitleStyle = {
  display: "flex",
  alignItems: "center",
  gap: "6px",
  marginTop: "0",
  marginBottom: "10px",
  color: "#f57c00",
  fontSize: "14px",
  fontWeight: "600"
};

const tipsListStyle = {
  margin: "0",
  paddingLeft: "18px"
};

const tipsItemStyle = {
  marginBottom: "6px",
  color: "#5d4037",
  fontSize: "12px",
  lineHeight: "1.4",
  paddingLeft: "2px"
};

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
const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
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
  if (typeof window !== "undefined") {
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
    <div style="display: flex; flex-direction: column; align-items: center; text-align: center;">
      <div style="margin-bottom: 10px; font-size: 14px; font-weight: 600; color: #1565c0;">
        <span style="display: block; margin-bottom: 4px; font-size: 15px;">AI 모의 면접 준비</span>
        아래 순서대로 진행해주세요
      </div>
      
      <div style="margin-bottom: 8px; padding: 6px 10px; background: #e3f2fd; border-radius: 6px; width: 100%;">
        <p style="margin: 0; font-weight: 500; font-size: 12px;">1. <mark style="background: #bbdefb; padding: 1px 4px; border-radius: 3px;">카메라/마이크 확인</mark> 버튼 클릭</p>
      </div>
      
      <div style="margin-bottom: 8px; padding: 6px 10px; background: #e8f5e9; border-radius: 6px; width: 100%;">
        <p style="margin: 0; font-weight: 500; font-size: 12px;">2. <mark style="background: #c8e6c9; padding: 1px 4px; border-radius: 3px;">녹화 테스트</mark> 진행</p>
      </div>
      
      <div style="margin-bottom: 10px; padding: 6px 10px; background: #fff8e1; border-radius: 6px; width: 100%;">
        <p style="margin: 0; font-weight: 500; font-size: 12px;">3. <mark style="background: #ffecb3; padding: 1px 4px; border-radius: 3px;">면접 시작</mark> 버튼 클릭</p>
      </div>
      
      ${showWarning.value ? 
        '<div style="margin-top: 6px; padding: 6px 8px; background: #ffebee; border-left: 3px solid #f44336; border-radius: 4px; text-align: left;">' +
        '<p style="margin: 0; color: #c62828; font-weight: 600; display: flex; align-items: center; font-size: 12px;">' +
        '<span style="margin-right: 4px; font-size: 14px;">⚠️</span>' +
        '카메라/마이크 확인 필요</p>' +
        '</div>' : 
        '<div style="margin-top: 6px; padding: 6px 8px; background: #e8f5e9; border-left: 3px solid #4caf50; border-radius: 4px; text-align: left;">' +
        '<p style="margin: 0; color: #2e7d32; font-weight: 600; display: flex; align-items: center; font-size: 12px;">' +
        '<span style="margin-right: 4px; font-size: 14px;">✅</span>' +
        '준비 완료 - 면접 시작 가능</p>' +
        '</div>'
      }
    </div>
  `;
};

const formattedAIMessage = computed(() => {
  return currentAIMessage.value.replace(/([.?])/g, "$1<br>");
});

const replayQuestion = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
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
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const synth = window.speechSynthesis;
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
  console.log(JSON.stringify(info, null, 2));




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
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
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
if (
    typeof window !== "undefined" &&
    window.speechSynthesis &&
    window.speechSynthesis.speaking
  ) {
    window.speechSynthesis.cancel();
  }  
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
