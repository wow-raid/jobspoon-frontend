<template>
<div :style="pageStyle">
  <!-- 히어로 섹션 -->
  <section :style="heroSectionStyle">
    <!-- 왼쪽 이미지 -->
    <div :style="leftImageContainerStyle">
      <img :src="landingImage" alt="AI 면접 플랫폼" :style="leftImageStyle" />
      <img :src="landingImage2" alt="AI 면접 플랫폼" :style="leftImageStyle2" />
    </div>

    <!-- 오른쪽 텍스트 -->
    <div :style="rightContentStyle">
      <h1 :style="mainTitleStyle">
        빠르고<br />
        확실하게<br />
        <span :style="gradientTextStyle">준비하세요</span>
      </h1>
      
      <div :style="descriptionBoxStyle">
        <p :style="descriptionTitleStyle">면접 준비</p>
        <p :style="descriptionSubtitleStyle">어떻게 하고 있나요?</p>
        <p :style="descriptionTextStyle">
          Job-Spoon의 AI 모의면접으로<br />
          편하지만 확실하게 준비 해보세요
        </p>
      </div>

      <div :style="buttonGroupStyle">
        <button :style="primaryButtonStyle" @click="goAiInterview">
          AI 면접 시작하기 →
        </button>
        <button :style="secondaryButtonStyle" @click="scrollToFeatures">
          더 알아보기
        </button>
      </div>
    </div>
  </section>

  <!-- 특징 섹션 -->
  <section :style="featuresSectionStyle">
    <h2 :style="sectionTitleStyle" data-section-title>
      왜 <span :style="highlightTextStyle">Job-Spoon AI 면접</span>인가요?
    </h2>
    <p :style="sectionSubtitleStyle">
      실전 같은 연습으로 면접 합격률을 높이세요
    </p>

    <!-- 특징 카드 그리드 -->
    <div :style="featuresGridStyle">
      <div :style="getFeatureCardStyle(featureVisibility[0], 0)" data-feature="0">
        <div :style="featureIconStyle">🎯</div>
        <h3 :style="featureTitleStyle">맞춤형 질문</h3>
        <p :style="featureDescStyle">
          직무와 경력에 맞춘<br />
          AI 생성 면접 질문
        </p>
      </div>

      <div :style="getFeatureCardStyle(featureVisibility[1], 1)" data-feature="1">
        <div :style="featureIconStyle">🎤</div>
        <h3 :style="featureTitleStyle">실시간 음성 인식</h3>
        <p :style="featureDescStyle">
          자연스러운 대화형<br />
          면접 시뮬레이션
        </p>
      </div>

      <div :style="getFeatureCardStyle(featureVisibility[2], 2)" data-feature="2">
        <div :style="featureIconStyle">📊</div>
        <h3 :style="featureTitleStyle">즉각적인 피드백</h3>
        <p :style="featureDescStyle">
          답변 분석과 함께<br />
          개선점 제시
        </p>
      </div>

      <div :style="getFeatureCardStyle(featureVisibility[3], 3)" data-feature="3">
        <div :style="featureIconStyle">📈</div>
        <h3 :style="featureTitleStyle">성장 추적</h3>
        <p :style="featureDescStyle">
          연습 기록과 점수로<br />
          실력 향상 확인
        </p>
      </div>
    </div>
  </section>

  <!-- 상세 기능 섹션 -->
  <section :style="detailSectionStyle">
    <!-- 기능 1 -->
    <div :style="getDetailRowStyle(false, detailVisibility[0])" data-detail="0">
      <div :style="getDetailContentStyle(false, detailVisibility[0])">
        <div :style="featureBadgeStyle">FEATURE 01</div>
        <h3 :style="detailTitleStyle">
          실전처럼 연습하고<br />
          <span :style="highlightTextStyle">자신감을 키우세요</span>
        </h3>
        <p :style="detailDescStyle">
          실제 면접과 동일한 환경에서 AI와 대화하며<br />
          답변을 연습하고 개선할 수 있습니다.
        </p>
        <ul :style="detailListStyle">
          <li :style="detailListItemStyle">실시간 STT 음성 인식</li>
          <li :style="detailListItemStyle">자연스러운 대화 흐름</li>
          <li :style="detailListItemStyle">무제한 연습 가능</li>
        </ul>
      </div>
      <div :style="getDetailImageBoxStyle(false, detailVisibility[0])">
        <div :style="imagePlaceholderStyle">면접 화면 이미지</div>
      </div>
    </div>

    <!-- 기능 2 -->
    <div :style="getDetailRowStyle(true, detailVisibility[1])" data-detail="1">
      <div :style="getDetailContentStyle(true, detailVisibility[1])">
        <div :style="featureBadgeStyle">FEATURE 02</div>
        <h3 :style="detailTitleStyle">
          AI가 분석하는<br />
          <span :style="highlightTextStyle">상세한 피드백</span>
        </h3>
        <p :style="detailDescStyle">
          답변의 논리성, 명확성, 전문성을 분석하고<br />
          구체적인 개선 방향을 제시합니다.
        </p>
        <ul :style="detailListStyle">
          <li :style="detailListItemStyle">답변 품질 점수화</li>
          <li :style="detailListItemStyle">개선점 상세 분석</li>
          <li :style="detailListItemStyle">모범 답변 예시 제공</li>
        </ul>
      </div>
      <div :style="getDetailImageBoxStyle(true, detailVisibility[1])">
        <div :style="imagePlaceholderStyle">피드백 화면 이미지</div>
      </div>
    </div>

    <!-- 기능 3 -->
    <div :style="getDetailRowStyle(false, detailVisibility[2])" data-detail="2">
      <div :style="getDetailContentStyle(false, detailVisibility[2])">
        <div :style="featureBadgeStyle">FEATURE 03</div>
        <h3 :style="detailTitleStyle">
          나만의 속도로<br />
          <span :style="highlightTextStyle">꾸준히 성장하세요</span>
        </h3>
        <p :style="detailDescStyle">
          시간과 장소에 구애받지 않고<br />
          언제든지 면접 연습을 시작할 수 있습니다.
        </p>
        <ul :style="detailListStyle">
          <li :style="detailListItemStyle">24시간 이용 가능</li>
          <li :style="detailListItemStyle">연습 기록 자동 저장</li>
          <li :style="detailListItemStyle">진행 상황 시각화</li>
        </ul>
      </div>
      <div :style="getDetailImageBoxStyle(false, detailVisibility[2])">
        <div :style="imagePlaceholderStyle">진행 상황 이미지</div>
      </div>
    </div>
  </section>

  <!-- CTA 섹션 -->
  <section :style="ctaSectionStyle">
    <div :style="ctaIconStyle">🚀</div>
    <h2 :style="ctaTitleStyle">
      지금 바로 시작하고<br />
      <span :style="ctaHighlightStyle">면접 합격률</span>을 높이세요
    </h2>
    <p :style="ctaDescStyle">
      무료로 시작하고, 언제든지 연습할 수 있습니다.<br />
      수천 명의 취업 준비생이 이미 Job-Spoon과 함께하고 있습니다.
    </p>
    <button :style="ctaButtonStyle" @click="goAiInterview">
      무료로 시작하기 →
    </button>
  </section>

  <!-- 스크롤 탑 버튼 -->
  <button :style="scrollTopButtonStyle" @click="scrollToTop" aria-label="맨 위로">
    ↑
  </button>
</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import landingImage from '../../assets/images/fixed/imsi8.png'
import landingImage2 from '../../assets/images/fixed/imsi3.png'

const currentUrl = process.env.CURRENT_URL;
const router = useRouter();

// 반응형 상태 관리
const isBackgroundVisible = ref(true);
const featureVisibility = ref([false, false, false, false]);
const detailVisibility = ref([false, false, false]);

// 네비게이션 함수
const goAiInterview = () => {
  window.location.href = `${currentUrl}/vue-ai-interview/ai-interview/select`
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const scrollToFeatures = () => {
  const featuresSection = document.querySelector('[data-section-title]');
  if (featuresSection) {
    featuresSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

// 스크롤 애니메이션 핸들러
const handleScroll = () => {
  // 배경 텍스트 숨김 처리
  const sectionTitle = document.querySelector('[data-section-title]');
  if (sectionTitle) {
    const rect = sectionTitle.getBoundingClientRect();
    isBackgroundVisible.value = rect.top > 200;
  }

  // 특징 카드 애니메이션
  const featureCards = document.querySelectorAll('[data-feature]');
  featureCards.forEach((card, index) => {
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
      featureVisibility.value[index] = true;
    }
  });

  // 상세 기능 애니메이션
  const detailRows = document.querySelectorAll('[data-detail]');
  detailRows.forEach((row, index) => {
    const rect = row.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      detailVisibility.value[index] = true;
    }
  });
};

onMounted(() => {
  handleScroll();
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

// ========== 스타일 정의 ==========

const pageStyle = {
  minHeight: '100vh',
  background: 'linear-gradient(180deg, #ffffff 0%, #f0f9ff 40%, #e0f2fe 100%)',
  position: 'relative',
  overflow: 'hidden',
  padding: '0'
};

const backgroundTextContainerStyle = {
  position: 'fixed',
  top: '65%',
  left: '0',
  width: '100%',
  transform: 'translateY(-50%)',
  pointerEvents: 'none',
  zIndex: 0,
  overflow: 'hidden'
};

const backgroundTextStyle = (isVisible) => ({
  display: 'flex',
  whiteSpace: 'nowrap',
  fontSize: 'clamp(70px, 10vw, 120px)',
  fontWeight: '900',
  color: 'rgba(200, 230, 255, 0.35)',
  letterSpacing: '0.1em',
  opacity: isVisible ? 1 : 0,
  transition: 'opacity 0.3s ease',
  animation: 'scrollLeft 30s linear infinite'
});

const heroSectionStyle = {
  maxWidth: '100%',
  width: '100%',
  minHeight: '100vh',
  margin: '0',
  display: 'flex',
  flexDirection: 'row',
  gap: '0',
  alignItems: 'center',
  background: 'transparent',
  borderRadius: '0',
  padding: '0',
  boxShadow: 'none',
  position: 'relative',
  zIndex: 1
};

const leftImageContainerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingLeft: '0',
  paddingRight: '0',
  height: '100vh',
  flex: '0 0 60%',
  width: '60%',
  position: 'relative'
};

const leftImageStyle = {
  width: 'auto',
  height: '60vh',
  borderRadius: '0',
  boxShadow: 'none',
  transition: 'transform 0.3s ease',
  objectFit: 'contain',
  position: 'relative',
  marginLeft: '-100px',
  zIndex: 1
};
const leftImageStyle2 = {
  width: 'auto',
  height: '35vh',
  borderRadius: '0',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s ease',
  objectFit: 'contain',
  position: 'absolute',
  right: '20px',
  top: '10%',
  zIndex: 2
};

const rightContentStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  padding: '80px 100px 60px 80px',
  justifyContent: 'center',
  alignItems: 'flex-start',
  flex: '1'
};

const heroTagStyle = {
  display: 'inline-block',
  padding: '10px 22px',
  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(139, 92, 246, 0.15))',
  color: '#6366f1',
  borderRadius: '30px',
  fontSize: '14px',
  fontWeight: '700',
  letterSpacing: '0.03em',
  border: '1px solid rgba(99, 102, 241, 0.25)',
  width: 'fit-content',
  marginBottom: '12px'
};

const mainTitleStyle = {
  fontSize: 'clamp(56px, 6.5vw, 80px)',
  fontWeight: '900',
  lineHeight: '1.05',
  margin: '0',
  color: '#0f172a',
  letterSpacing: '-0.05em'
};

const gradientTextStyle = {
  background: 'linear-gradient(135deg, #4F9CF9 0%, #10B981 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block'
};

const descriptionBoxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  marginTop: '0',
  padding: '0'
};

const descriptionTitleStyle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0',
  lineHeight: '1.4'
};

const descriptionSubtitleStyle = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#1e293b',
  margin: '0',
  lineHeight: '1.4'
};

const descriptionTextStyle = {
  fontSize: '17px',
  fontWeight: '400',
  color: '#64748b',
  margin: '0',
  marginTop: '12px',
  lineHeight: '1.7'
};

const buttonGroupStyle = {
  display: 'flex',
  flexDirection: 'row',
  gap: '12px',
  marginTop: '4px'
};

const primaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '16px 30px',
  fontSize: '16px',
  fontWeight: '700',
  color: '#fff',
  background: 'linear-gradient(135deg, #4F9CF9 0%, #10B981 100%)',
  border: 'none',
  borderRadius: '50px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 8px 24px rgba(79, 156, 249, 0.4)',
  whiteSpace: 'nowrap'
};

const secondaryButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '16px 30px',
  fontSize: '16px',
  fontWeight: '700',
  color: '#4F9CF9',
  background: '#ffffff',
  border: '2px solid rgba(79, 156, 249, 0.3)',
  borderRadius: '50px',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(79, 156, 249, 0.15)',
  whiteSpace: 'nowrap'
};

const featuresSectionStyle = {
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto 120px',
  padding: '0 100px',
  position: 'relative',
  zIndex: 1,
  textAlign: 'center'
};

const sectionTitleStyle = {
  fontSize: 'clamp(32px, 5vw, 48px)',
  fontWeight: '900',
  color: '#0f172a',
  marginBottom: '16px',
  letterSpacing: '-0.03em'
};

const sectionSubtitleStyle = {
  fontSize: 'clamp(16px, 2vw, 18px)',
  color: '#64748b',
  marginBottom: '60px',
  fontWeight: '500'
};

const highlightTextStyle = {
  background: 'linear-gradient(135deg, #4F9CF9 0%, #10B981 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  display: 'inline-block'
};

const featuresGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '32px'
};

const getFeatureCardStyle = (isVisible, index) => ({
  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.95) 100%)',
  borderRadius: '20px',
  padding: '40px 28px',
  boxShadow: '0 10px 40px rgba(79, 156, 249, 0.15)',
  border: '2px solid rgba(79, 156, 249, 0.15)',
  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
  transitionDelay: `${index * 0.1}s`,
  cursor: 'pointer',
  textAlign: 'center'
});

const featureIconStyle = {
  fontSize: '64px',
  marginBottom: '20px',
  filter: 'drop-shadow(0 4px 16px rgba(79, 156, 249, 0.3))'
};

const featureTitleStyle = {
  fontSize: 'clamp(20px, 2.5vw, 24px)',
  fontWeight: '800',
  color: '#1e293b',
  marginBottom: '12px',
  letterSpacing: '-0.02em'
};

const featureDescStyle = {
  fontSize: 'clamp(14px, 1.8vw, 16px)',
  color: '#64748b',
  lineHeight: '1.6'
};

const detailSectionStyle = {
  maxWidth: '1200px',
  width: '100%',
  margin: '0 auto 120px',
  position: 'relative',
  zIndex: 1
};

const getDetailRowStyle = (reverse, isVisible) => ({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: reverse ? '100px' : '60px',
  alignItems: 'center',
  marginBottom: '180px',
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateY(0)' : 'translateY(60px)',
  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
});

const getDetailContentStyle = (reverse, isVisible) => ({
  order: reverse ? 2 : 1,
  paddingLeft: reverse ? '40px' : '0',
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateX(0)' : `translateX(${reverse ? '40px' : '-40px'})`,
  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.2s'
});

const getDetailImageBoxStyle = (reverse, isVisible) => ({
  order: reverse ? 1 : 2,
  background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
  borderRadius: '24px',
  padding: '60px 40px',
  minHeight: '400px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
  border: '2px solid rgba(148, 163, 184, 0.2)',
  position: 'relative',
  overflow: 'hidden',
  opacity: isVisible ? 1 : 0,
  transform: isVisible ? 'translateX(0) scale(1)' : `translateX(${reverse ? '-40px' : '40px'}) scale(0.95)`,
  transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.4s'
});

const featureBadgeStyle = {
  display: 'inline-block',
  padding: '8px 20px',
  background: 'linear-gradient(135deg, rgba(79, 156, 249, 0.1), rgba(16, 185, 129, 0.1))',
  color: '#4F9CF9',
  borderRadius: '24px',
  fontSize: '14px',
  fontWeight: '700',
  marginBottom: '20px',
  letterSpacing: '0.02em'
};

const detailTitleStyle = {
  fontSize: 'clamp(28px, 4vw, 42px)',
  fontWeight: '900',
  color: '#1e293b',
  marginBottom: '20px',
  letterSpacing: '-0.03em',
  lineHeight: '1.3'
};

const detailDescStyle = {
  fontSize: 'clamp(16px, 2vw, 19px)',
  color: '#64748b',
  lineHeight: '1.8',
  marginBottom: '24px'
};

const detailListStyle = {
  listStyle: 'none',
  padding: '0',
  margin: '24px 0'
};

const detailListItemStyle = {
  fontSize: 'clamp(15px, 2vw, 17px)',
  color: '#475569',
  padding: '12px 0',
  paddingLeft: '32px',
  position: 'relative',
  '&::before': {
    content: '"✓"',
    position: 'absolute',
    left: '0',
    color: '#10b981',
    fontWeight: '900',
    fontSize: '20px'
  }
};

const imagePlaceholderStyle = {
  color: '#94a3b8',
  fontSize: '18px',
  fontWeight: '600',
  textAlign: 'center',
  zIndex: 1
};

const ctaSectionStyle = {
  maxWidth: '900px',
  width: '100%',
  margin: '0 auto',
  padding: '100px 40px',
  textAlign: 'center',
  background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  borderRadius: '24px',
  position: 'relative',
  overflow: 'hidden',
  zIndex: 1
};

const ctaIconStyle = {
  fontSize: '80px',
  marginBottom: '32px',
  filter: 'drop-shadow(0 8px 24px rgba(59, 130, 246, 0.4))'
};

const ctaTitleStyle = {
  fontSize: 'clamp(32px, 5vw, 48px)',
  fontWeight: '900',
  color: '#ffffff',
  marginBottom: '24px',
  letterSpacing: '-0.03em',
  lineHeight: '1.2'
};

const ctaHighlightStyle = {
  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text'
};

const ctaDescStyle = {
  fontSize: 'clamp(16px, 2vw, 19px)',
  color: '#94a3b8',
  lineHeight: '1.8',
  marginBottom: '40px'
};

const ctaButtonStyle = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  padding: '18px 40px',
  fontSize: '18px',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 12px 40px rgba(59, 130, 246, 0.45)'
};

const scrollTopButtonStyle = {
  position: 'fixed',
  bottom: '70px',
  right: '24px',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: 'white',
  color: '#3b82f6',
  border: '2px solid #e2e8f0',
  fontSize: '20px',
  fontWeight: '700',
  cursor: 'pointer',
  boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)',
  transition: 'all 0.3s ease',
  zIndex: 100
};
</script>

<style scoped>
/* 배경 텍스트 애니메이션 */
@keyframes scrollLeft {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* 버튼 호버 효과 */
button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
}

button:active {
  transform: translateY(0);
}

/* 이미지 호버 효과 */
img:hover {
  transform: scale(1.02);
}

/* 특징 카드 호버 효과 */
[data-feature]:hover {
  transform: translateY(-8px) !important;
  box-shadow: 0 20px 60px rgba(59, 130, 246, 0.25) !important;
  border-color: rgba(59, 130, 246, 0.3) !important;
}

/* 리스트 아이템 체크 마크 */
ul li {
  position: relative;
  padding-left: 32px;
}

ul li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 900;
  font-size: 20px;
}

/* 반응형 디자인 */
@media (max-width: 968px) {
  div[style*="gridTemplateColumns"] {
    grid-template-columns: 1fr !important;
    gap: 40px !important;
  }
  
  [data-detail] > div {
    order: 1 !important;
    padding-left: 0 !important;
  }
  
  [data-detail] > div:last-child {
    order: 2 !important;
  }
}

@media (max-width: 640px) {
  section {
    padding: 40px 20px !important;
  }
  
  button {
    width: 100%;
    max-width: 400px;
  }
}
</style>
