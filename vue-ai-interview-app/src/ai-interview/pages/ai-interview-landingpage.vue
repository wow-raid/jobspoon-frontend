<template>
<div>
  <!-- 히어로 섹션 -->
  <section :style="heroSectionStyle" class="hero-section">
    <div class="animated-background">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
      <div class="wave wave4"></div>
    </div>

    <div :style="heroContentStyle" class="animate-on-scroll">
      <div class="logo-container animate-on-scroll">
        <h1 :style="logoStyle">JobSpoon AI 인터뷰</h1>
      </div>
      <h1 :style="heroTitleStyle" class="animate-on-scroll delay-100">AI로 완성하는<br /><span class="gradient-text">완벽한 면접 준비</span></h1>
      <p :style="heroSubtitleStyle" class="animate-on-scroll delay-200">
        JobSpoon의 AI 인터뷰 시스템으로 실전과 같은 면접 경험을 쌓고
        자신감을 키워보세요. 실시간 피드백과 맞춤형 질문으로 여러분의 취업 성공률을 높입니다.
      </p>
      <div :style="buttonGroupStyle" class="animate-on-scroll delay-300">
        <button :style="primaryButtonStyle" class="btn-hover-effect pulse-animation primary-btn" @click="goAiInterview" >시작하기</button>
        <button :style="secondaryButtonStyle" class="btn-hover-effect secondary-btn">더 알아보기</button>
      </div>
    </div>

    <div :style="landingImageBox">
      <img :src="landingImage" alt="ai_logo" :style="ladingImageStyle">
    </div>



  </section>

  <!-- 특징 섹션 -->
  <section :style="featureSectionStyle">
    <h2 :style="sectionTitleStyle" class="animate-on-scroll">주요 특징</h2>
    <div :style="featureContainerStyle">
      <div :style="featureCardStyle" class="animate-on-scroll feature-card">
        <div class="feature-icon-wrapper">
          <div :style="featureIconStyle" class="mdi mdi-robot"></div>
        </div>
        <h3 :style="featureTitleStyle">AI 기반 면접 시뮬레이션</h3>
        <p :style="featureDescriptionStyle">실제 면접과 유사한 환경에서 AI가 다양한 질문을 제시하고 답변을 분석합니다.</p>
        <div class="feature-hover-effect"></div>
      </div>

      <div :style="featureCardStyle" class="animate-on-scroll delay-100 feature-card">
        <div class="feature-icon-wrapper">
          <div :style="featureIconStyle" class="mdi mdi-chart-line"></div>
        </div>
        <h3 :style="featureTitleStyle">상세한 피드백 제공</h3>
        <p :style="featureDescriptionStyle">답변의 강점과 약점을 분석하여 개선점을 제시하고 더 나은 답변 방향을 안내합니다.</p>
        <div class="feature-hover-effect"></div>
      </div>

      <div :style="featureCardStyle" class="animate-on-scroll delay-200 feature-card">
        <div class="feature-icon-wrapper">
          <div :style="featureIconStyle" class="mdi mdi-account-group"></div>
        </div>
        <h3 :style="featureTitleStyle">맞춤형 질문 생성</h3>
        <p :style="featureDescriptionStyle">지원 직무와 경력에 맞는 맞춤형 질문을 생성하여 실전 면접에 대비할 수 있습니다.</p>
        <div class="feature-hover-effect"></div>
      </div>
    </div>
  </section>

  <!-- CTA 섹션 -->
  <section :style="ctaSectionStyle" class="animate-on-scroll">
    <h2 :style="ctaTitleStyle">지금 바로 AI 면접을 시작하세요</h2>
    <p :style="ctaDescriptionStyle">
      JobSpoon의 AI 인터뷰 시스템으로 면접 준비를 완벽하게 마치고 자신감 있게 실전에 임하세요.
    </p>
    <button :style="ctaButtonStyle" class="btn-hover-effect">무료로 시작하기</button>
  </section>
</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import landingImage from '../../assets/images/fixed/landinImge.jpg'

const currentUrl = process.env.CURRENT_URL;
const router = useRouter();

const goAiInterview = () =>{
  window.location.href = `${currentUrl}/vue-ai-interview/ai-interview/select`
}


// 모바일 메뉴 상태 관리
const mobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

// 인라인 스타일 객체 정의
// 헤더 스타일
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '1rem 2rem',
  backgroundColor: '#ffffff',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 100
};

const landingImageBox = {
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  zIndex: 3,
  '@media (max-width: 768px)': {
    marginLeft: '0',
    marginTop: '1rem'
  }
};

const ladingImageStyle = {
  width: '100%',
  height: '100%',
  maxWidth: '700px',
  objectFit: 'contain',
  filter: 'drop-shadow(0 20px 30px rgba(0, 0, 0, 0.15))',
  transform: 'translateZ(0)',
  animation: 'floatImage 6s ease-in-out infinite',
  transition: 'all 0.5s ease'
};

const navMenuStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem'
};

const navItemStyle = {
  color: '#333333',
  textDecoration: 'none',
  fontWeight: '500',
  cursor: 'pointer',
  transition: 'color 0.3s ease'
};

const navButtonStyle = {
  backgroundColor: '#3b82f6',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.5rem',
  padding: '0.75rem 1.5rem',
  fontWeight: '500',
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease'
};

// 히어로 섹션 스타일
const heroSectionStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0 4rem',
  background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
  gap: '1rem',
  maxWidth: '100%',
  minHeight: '90vh',
  position: 'relative',
  overflow: 'hidden',
  '@media (max-width: 768px)': {
    flexDirection: 'column',
    textAlign: 'center',
    gap: '0.5rem',
    padding: '2rem 1rem'
  }
};

const heroContentStyle = {
  flex: '1',
  maxWidth: '800px',
  padding: '2rem',
  marginLeft: '2rem',
  marginRight: '0.5rem',
  gap: '0.25rem',
  '@media (max-width: 768px)': {
    marginBottom: '1rem',
    marginRight: '0',
    textAlign: 'center'
  }
};

const heroTitleStyle = {
  fontSize: '3.8rem',
  fontWeight: '800',
  color: '#1e293b',
  marginBottom: '1rem',
  lineHeight: '1.1',
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  '@media (max-width: 768px)': {
    fontSize: '2.5rem'
  },
  background: 'linear-gradient(90deg, #1e40af 0%, #3b82f6 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  letterSpacing: '-0.02em',
  transform: 'translateZ(0)',
  animation: 'textGlow 3s ease-in-out infinite alternate'
};

const heroSubtitleStyle = {
  fontSize: '1.2rem',
  color: '#64748b',
  marginBottom: '1.5rem',
  lineHeight: '1.5',
  maxWidth: '90%',
  '@media (max-width: 768px)': {
    fontSize: '1.1rem',
    maxWidth: '100%'
  }
};

const buttonGroupStyle = {
  display: 'flex',
  gap: '1rem',
  '@media (max-width: 480px)': {
    flexDirection: 'column'
  }
};

const primaryButtonStyle = {
  backgroundColor: '#3b82f6',
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.75rem',
  padding: '1.25rem 2.5rem',
  fontWeight: '700',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3), 0 0 0 2px rgba(59, 130, 246, 0.05), inset 0 -3px 0 rgba(0, 0, 0, 0.1)',
  transform: 'translateY(-2px)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 15px 25px rgba(59, 130, 246, 0.4), 0 0 0 3px rgba(59, 130, 246, 0.15), inset 0 -3px 0 rgba(0, 0, 0, 0.15)'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 70%)',
    transform: 'rotate(45deg)',
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:hover::before': {
    opacity: 1,
    animation: 'buttonGlow 2s infinite'
  }
};

const secondaryButtonStyle = {
  backgroundColor: 'transparent',
  color: '#3b82f6',
  border: '2px solid #3b82f6',
  borderRadius: '0.75rem',
  padding: '1.25rem 2.5rem',
  fontWeight: '700',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
  transform: 'translateY(-2px)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    transform: 'translateY(-4px) scale(1.02)',
    boxShadow: '0 8px 15px rgba(0, 0, 0, 0.08)',
    borderColor: '#2563eb'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '0%',
    background: 'linear-gradient(to top, rgba(59, 130, 246, 0.1), transparent)',
    transition: 'height 0.3s ease',
    zIndex: -1
  },
  '&:hover::after': {
    height: '100%',
    animation: 'buttonFill 1s forwards'
  }
};

const heroImageContainerStyle = {
  flex: '1',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  zIndex: 2,
  marginLeft: '-1rem',
  '@media (max-width: 768px)': {
    marginLeft: '0',
    marginTop: '1rem'
  }
};

const logoStyle = {
  fontSize: '1.4rem',
  fontWeight: '700',
  color: '#3b82f6',
  marginBottom: '1rem',
  letterSpacing: '0.02em',
  display: 'inline-block',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-5px',
    left: '0',
    width: '40px',
    height: '3px',
    background: 'linear-gradient(90deg, #3b82f6 0%, rgba(59, 130, 246, 0.3) 100%)',
    borderRadius: '2px'
  }
};

// 특징 섹션 스타일
const featureSectionStyle = {
  padding: '6rem 2rem',
  backgroundColor: '#f8fafc',
  textAlign: 'center'
};

const sectionTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: '3rem',
  textAlign: 'center',
  position: 'relative',
  display: 'inline-block',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-10px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80px',
    height: '4px',
    backgroundColor: '#3b82f6',
    borderRadius: '2px'
  }
};

const featureContainerStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
  maxWidth: '1200px',
  margin: '0 auto'
};

const featureCardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(15px)',
  borderRadius: '1.5rem',
  padding: '3rem 2rem',
  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
  transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  position: 'relative',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  transform: 'translateZ(0)',
  zIndex: 2,
  '&:hover': {
    transform: 'translateY(-15px) scale(1.02)',
    boxShadow: '0 30px 60px rgba(59, 130, 246, 0.15), 0 0 0 2px rgba(59, 130, 246, 0.1) inset'
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)',
    opacity: 0,
    transition: 'opacity 0.5s ease',
    zIndex: -1
  },
  '&:hover::before': {
    opacity: 1
  }
};

const featureIconStyle = {
  fontSize: '2.5rem',
  color: '#3b82f6',
  marginBottom: '1.5rem'
};

const featureTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '1rem'
};

const featureDescriptionStyle = {
  fontSize: '1.1rem',
  color: '#64748b',
  lineHeight: '1.6'
};

// CTA 섹션 스타일
const ctaSectionStyle = {
  padding: '10rem 2rem',
  backgroundColor: '#1e293b',
  textAlign: 'center',
  backgroundImage: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0) 70%)',
    zIndex: 1,
    animation: 'pulseBg 8s infinite'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%233b82f6\' fill-opacity=\'0.05\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
    opacity: 0.5,
    zIndex: 0
  }
};

const ctaTitleStyle = {
  fontSize: '2.5rem',
  fontWeight: '700',
  color: '#ffffff',
  marginBottom: '1.5rem',
  position: 'relative',
  zIndex: 2
};

const ctaDescriptionStyle = {
  fontSize: '1.25rem',
  color: '#94a3b8',
  marginBottom: '2.5rem',
  maxWidth: '800px',
  margin: '0 auto 2.5rem',
  position: 'relative',
  zIndex: 2
};

const ctaButtonStyle = {
  backgroundColor: '#3b82f6',
  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  color: '#ffffff',
  border: 'none',
  borderRadius: '0.5rem',
  padding: '1.25rem 2.5rem',
  fontWeight: '600',
  fontSize: '1.1rem',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
  position: 'relative',
  zIndex: 2,
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.5)'
  }
};

// 애니메이션 효과 적용
onMounted(() => {
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });
  
  animateElements.forEach(element => {
    observer.observe(element);
  });
});
</script>

<style scoped>
/* 애니메이션 효과 */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.animate-on-scroll.visible {
  opacity: 1;
  transform: translateY(0);
}

.delay-100 {
  transition-delay: 0.1s;
}

.delay-200 {
  transition-delay: 0.2s;
}

.delay-300 {
  transition-delay: 0.3s;
}

/* 히어로 섹션 애니메이션 */
.hero-section {
  gap: 1rem;
  position: relative;
  overflow: hidden;
}

.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
}

.wave {
  position: absolute;
  width: 200%;
  height: 200%;
  border-radius: 40%;
  opacity: 0.3;
}

.wave1 {
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.2) 0%, rgba(37, 99, 235, 0.2) 100%);
  bottom: -80%;
  left: -50%;
  animation: wave 20s linear infinite;
}

.wave2 {
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.15) 100%);
  bottom: -70%;
  left: -30%;
  animation: wave 16s linear infinite;
  animation-delay: -5s;
}

.wave3 {
  background: linear-gradient(90deg, rgba(168, 85, 247, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%);
  bottom: -65%;
  left: -40%;
  animation: wave 18s linear infinite;
  animation-delay: -2s;
}

.wave4 {
  background: linear-gradient(90deg, rgba(236, 72, 153, 0.05) 0%, rgba(219, 39, 119, 0.05) 100%);
  bottom: -75%;
  left: -45%;
  animation: wave 22s linear infinite;
  animation-delay: -7s;
}

@keyframes wave {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 플로팅 아이콘 */
.floating-element {
  position: absolute;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  z-index: 1;
}

.floating-icon {
  font-size: 2rem;
  color: #3b82f6;
}

.element1 {
  top: 20%;
  left: 5%;
  animation: float 6s ease-in-out infinite;
}

.element2 {
  top: 60%;
  left: 15%;
  animation: float 8s ease-in-out infinite;
  animation-delay: 1s;
}

.element3 {
  top: 30%;
  right: 10%;
  animation: float 7s ease-in-out infinite;
  animation-delay: 2s;
}

.element4 {
  bottom: 15%;
  right: 20%;
  animation: float 9s ease-in-out infinite;
  animation-delay: 3s;
}

@keyframes floatDevice {
  0% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-15px) rotate(1deg);
  }
  50% {
    transform: translateY(0) rotate(0deg);
  }
  75% {
    transform: translateY(10px) rotate(-1deg);
  }
  100% {
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes ctaGlow {
  0% {
    transform: rotate(45deg) translateY(0);
    opacity: 0.5;
  }
  50% {
    transform: rotate(45deg) translateY(-100%);
    opacity: 0.8;
  }
  100% {
    transform: rotate(45deg) translateY(-200%);
    opacity: 0;
  }
}

@keyframes ctaShine {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulseBg {
  0% {
    opacity: 0.2;
    transform: scale(1);
  }
  50% {
    opacity: 0.4;
    transform: scale(1.05);
  }
  100% {
    opacity: 0.2;
    transform: scale(1);
  }
}

.animated-device {
  position: relative;
  width: 280px;
  height: 560px;
  background: #111827;
  border-radius: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.5);
  padding: 10px;
  overflow: hidden;
  animation: device-float 6s ease-in-out infinite;
  transform-style: preserve-3d;
  perspective: 1000px;
  transition: all 0.5s ease;
}

.animated-device::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%);
  border-radius: 40px;
  z-index: 2;
  pointer-events: none;
}

@keyframes device-float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
  100% {
    transform: translateY(0);
  }
}

.device-notch {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 150px;
  height: 30px;
  background: #111827;
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
  z-index: 3;
}

.device-button {
  position: absolute;
  right: -3px;
  top: 100px;
  width: 3px;
  height: 50px;
  background: #2d3748;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.device-screen {
  position: relative;
  width: 100%;
  height: 100%;
  background: #1a202c;
  overflow: hidden;
  z-index: 1;
}

.chat-interface {
  padding: 60px 15px 15px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background: linear-gradient(180deg, #111827 0%, #1e293b 100%);
  position: relative;
  overflow: hidden;
}

.chat-interface::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.2;
  pointer-events: none;
}

.chat-message {
  margin-bottom: 15px;
  display: flex;
  animation: message-fade-in 0.5s ease-out forwards;
  opacity: 0;
}

.ai-message {
  justify-content: flex-start;
}

.user-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 80%;
  padding: 14px 18px;
  border-radius: 20px;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  transform: translateZ(0);
  position: relative;
  overflow: hidden;
}

.ai-message .message-bubble {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border-bottom-left-radius: 5px;
  border-top-right-radius: 24px;
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
}

.ai-message .message-bubble::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%);
  opacity: 0.5;
  pointer-events: none;
}

.user-message .message-bubble {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
  color: white;
  border-bottom-right-radius: 5px;
  border-top-left-radius: 24px;
  box-shadow: 0 5px 15px rgba(75, 85, 99, 0.3);
}

.delay-1 {
  animation-delay: 1s;
}

.delay-2 {
  animation-delay: 2s;
}

.delay-3 {
  animation-delay: 3s;
}

@keyframes message-fade-in {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.typing-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  display: inline-block;
  animation: typing-bounce 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing-bounce {
  0%, 80%, 100% {
    transform: scale(0.6);
  }
  40% {
    transform: scale(1);
  }
}

/* 버튼 애니메이션 */
.pulse-animation {
  animation: pulse 2s infinite;
}

.btn-hover-effect {
  transition: all 0.3s ease;
}

.btn-hover-effect:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}

/* 특징 카드 효과 */
.feature-card {
  position: relative;
  overflow: hidden;
}

.feature-hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover .feature-hover-effect {
  opacity: 1;
}

.feature-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  position: relative;
}

.feature-icon-wrapper::after {
  content: '';
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  border-radius: 50%;
  border: 2px solid rgba(59, 130, 246, 0.2);
  animation: pulse-glow 2s infinite;
}

@keyframes pulse-glow {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.shimmer-effect {
  background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
  background-size: 200% 100%;
  animation: shimmer 3s infinite;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover .shimmer-effect {
  opacity: 1;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

/* 버튼 클릭 효과 */
.btn-hover-effect:active {
  transform: translateY(0);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .hero-container {
    flex-direction: column;
    padding: 3rem 1rem;
  }

  .hero-content {
    margin-bottom: 2rem;
  }

  .animated-device {
    width: 240px;
    height: 480px;
  }

  .feature-card {
    padding: 2rem 1.5rem;
  }

  .floating-element {
    transform: scale(0.8);
  }

  .element1 {
    left: -10%;
  }

  .element3 {
    right: -10%;
  }

  .element4 {
    bottom: -10%;
  }

  .gradient-text {
    display: inline;
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .button-group {
    flex-direction: column;
    gap: 1rem;
  }

  .animated-device {
    width: 200px;
    height: 400px;
  }

  .device-notch {
    width: 100px;
    height: 20px;
  }

  .floating-element {
    display: none;
  }
}
</style>
