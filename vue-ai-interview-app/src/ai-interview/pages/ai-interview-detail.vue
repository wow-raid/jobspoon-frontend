<template>
  <main>
    <v-container align-center :style="containerStyle">
      <v-btn icon @click="goBack" :style="backButtonStyle">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      
      <div :style="selectionContainerStyle">
        <div :style="titleContainerStyle">
          <h2 :style="enhancedTitleStyle">
            <span :style="titleHighlightStyle">{{ pageTitle }}</span>
          </h2>
          <div :style="titleUnderlineStyle"></div>
          <p :style="titleDescriptionStyle">{{ pageDescription }}</p>
        </div>
        
        <!-- 전형별 면접 - 세부 유형 선택 -->
        <div v-if="interviewType === '전형별'" :style="interviewOptionsWrapperStyle">
          <div 
            v-for="(option, index) in interviewSubTypes" 
            :key="index"
            :style="[interviewTypeItemStyle, 
                    selectedInterviewSubType === option.type ? selectedInterviewTypeItemStyle : {}, 
                    option.status === 'preparing' ? preparingInterviewTypeItemStyle : {}]"
            @click="selectInterviewSubType(option.type)"
          >
            <div :style="interviewTypeIconStyle">
              <v-icon size="32" :color="selectedInterviewSubType === option.type ? 'white' : 'primary'">
                {{ option.icon }}
              </v-icon>
            </div>
            <div :style="interviewTypeContentStyle">
              <h2 :style="[interviewTypeTitleStyle, selectedInterviewSubType === option.type ? selectedInterviewTypeTitleStyle : {}]">{{ option.title }}</h2>
              <p :style="interviewTypeDescriptionStyle">{{ option.description }}</p>
            </div>
            <div :style="interviewTypeStatusStyle" v-if="option.status === 'preparing'">
              <v-chip color="grey" small>준비중</v-chip>
            </div>
            <div :style="interviewTypeOverlayStyle"></div>
          </div>
        </div>

        <!-- 기업별 면접 - 회사 선택 -->
        <div v-else-if="interviewType === '기업별'" :style="companySelectionWrapperStyle">
          <div :style="companyChipContainerStyle">
            <v-chip
              v-for="(company, index) in companies"
              :key="index"
              :value="company"
              clickable
              @click="selectCompany(company)"
              :style="[companyChipStyle, selectedCompany === company ? companyChipSelectedStyle : {}]"
            >
              {{ company }}
            </v-chip>
          </div>
          
          <div v-if="selectedCompany" :style="companyButtonContainerStyle">
            <v-btn 
              color="primary" 
              :style="companyNextButtonStyle"
              @click="goToDetailForm"
            >
              <v-icon left>mdi-arrow-right</v-icon>
              다음 단계로
            </v-btn>
          </div>
        </div>
        
        <!-- 채용공고별 면접 (준비중) -->
        <div v-else-if="interviewType === '채용공고별'" :style="preparingContainerStyle">
          <v-icon size="64" color="#3b82f6" :style="preparingIconStyle">mdi-clock-outline</v-icon>
          <p :style="preparingTextStyle">채용공고별 면접 기능은 현재 개발 중입니다.</p>
          <p :style="preparingSubtextStyle">곧 만나보실 수 있습니다.</p>
          
          <v-btn
            color="#3b82f6"
            @click="goBack"
            :style="backToSelectionBtnStyle"
          >
            이전 화면으로 돌아가기
          </v-btn>
        </div>
      </div>
    </v-container>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// 라우터에서 전달받은 면접 유형
const interviewType = ref(route.params.type || '');

// 페이지 타이틀 및 설명 계산
const pageTitle = computed(() => {
  if (interviewType.value === '전형별') return '면접 세부 유형을 선택해주세요';
  if (interviewType.value === '기업별') return '회사를 선택해주세요';
  if (interviewType.value === '채용공고별') return '채용공고별 면접 준비';
  return '';
});

const pageDescription = computed(() => {
  if (interviewType.value === '전형별') return '자신에게 맞는 면접 세부 유형을 선택하여 맞춤형 면접을 준비해보세요';
  if (interviewType.value === '기업별') return '지원하려는 회사를 선택하여 해당 기업에 맞는 맞춤형 면접을 준비해보세요';
  if (interviewType.value === '채용공고별') return '지원하려는 채용공고에 맞춰 맞춤형 면접을 준비해보세요';
  return '';
});

// 이전 화면으로 돌아가기
const goBack = () => {
  router.push('/ai-interview/select');
};

// ---------- 스타일 변수 ---------- //
const containerStyle = { marginBottom:"15%", marginTop: "1%", maxWidth: "1200px" };
const mb8Style = { marginBottom: "32px" };
const formContainerStyle = { marginTop: "32px", padding: "16px" };
const drawLineStyle = {
  border: "1px solid #333",
  padding: "16px",
  borderRadius: "10px",
  width: "90%",
  marginTop: "32px"
};
const liStyle = { marginLeft: "2%" };
const buttonStyle = {
  minWidth: "120px",
  padding: "12px 24px",
  margin: "0 8px",
  borderRadius: "8px",
  fontWeight: "500",
};

// 타이틀 컨테이너 스타일
const titleContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '3rem',
  position: 'relative',
  width: '100%'
};

// 향상된 타이틀 스타일
const enhancedTitleStyle = {
  fontSize: '2.8rem',
  fontWeight: '800',
  color: '#333',
  marginBottom: '1rem',
  letterSpacing: '-0.02em',
  textAlign: 'center',
  width: '100%',
  position: 'relative',
  textShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
  lineHeight: '1.2'
};

// 타이틀 하이라이트 스타일
const titleHighlightStyle = {
  background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  backgroundClip: 'text',
  position: 'relative',
  display: 'inline-block'
};

// 타이틀 밑줄 스타일
const titleUnderlineStyle = {
  width: '80px',
  height: '4px',
  background: 'linear-gradient(90deg, #3b82f6 0%, rgba(59, 130, 246, 0.3) 100%)',
  borderRadius: '2px',
  marginBottom: '1.5rem'
};

// 타이틀 설명 스타일
const titleDescriptionStyle = {
  fontSize: '1.2rem',
  color: '#64748b',
  textAlign: 'center',
  maxWidth: '600px',
  lineHeight: '1.5',
  fontWeight: '400'
};

// 선택 화면 스타일
const selectionContainerStyle = {
  marginBottom: '10rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%'
};

// 면접 유형 선택 옵션 스타일
const interviewOptionsWrapperStyle = {
  width: '100%',
  maxWidth: '1000px',
  margin: '0 auto',
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '20px'
};

// 면접 유형 아이템 스타일
const interviewTypeItemStyle = {
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
  backgroundColor: 'white',
  width: '280px',
  height: '500px',
  display: 'flex',
  flexDirection: 'column',
  border: '1px solid #e5e7eb'
};

// 선택된 면접 유형 아이템 스타일
const selectedInterviewTypeItemStyle = {
  backgroundColor: '#f0f7ff',
  borderColor: '#3b82f6',
  borderWidth: '2px',
  boxShadow: '0 8px 24px rgba(59, 130, 246, 0.2)',
  transform: 'translateY(-5px)'
};

// 준비중인 면접 유형 아이템 스타일
const preparingInterviewTypeItemStyle = {
  opacity: '0.7',
  backgroundColor: '#f9fafb',
  pointerEvents: 'none'
};

// 면접 유형 아이콘 스타일
const interviewTypeIconStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '80px',
  backgroundColor: '#f3f4f6',
  borderBottom: '1px solid #e5e7eb'
};

// 면접 유형 콘텐츠 스타일
const interviewTypeContentStyle = {
  flex: '1',
  padding: '1.5rem',
  position: 'relative',
  zIndex: '2',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};

// 면접 유형 제목 스타일
const interviewTypeTitleStyle = {
  fontSize: '1.25rem',
  fontWeight: '600',
  marginBottom: '0.5rem',
  color: '#333',
  textAlign: 'center'
};

// 선택된 면접 유형 제목 스타일
const selectedInterviewTypeTitleStyle = {
  color: '#1e40af'
};

// 면접 유형 설명 스타일
const interviewTypeDescriptionStyle = {
  fontSize: '0.9rem',
  color: '#6b7280',
  textAlign: 'center'
};

// 면접 유형 상태 스타일
const interviewTypeStatusStyle = {
  position: 'absolute',
  top: '0.75rem',
  right: '0.75rem',
  zIndex: '3'
};

// 면접 유형 오버레이 스타일
const interviewTypeOverlayStyle = {
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
  opacity: '0',
  transition: 'opacity 0.3s ease',
  zIndex: '1'
};

// 회사 선택 스타일
const companySelectionWrapperStyle = {
  width: '100%',
  maxWidth: '800px',
  margin: '0 auto 2rem'
};

// 회사 선택 칩 컨테이너 스타일
const companyChipContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '12px'
};

// 회사 선택 칩 스타일
const companyChipStyle = {
  fontSize: '1rem',
  padding: '12px 20px',
  borderRadius: '30px',
  backgroundColor: '#f3f4f6',
  color: '#333',
  border: '1px solid #e5e7eb',
  transition: 'all 0.3s ease'
};

// 선택된 회사 칩 스타일
const companyChipSelectedStyle = {
  backgroundColor: '#3b82f6',
  color: 'white',
  borderColor: '#3b82f6',
  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
  transform: 'translateY(-2px)'
};

// 준비중 화면 컨테이너 스타일
const preparingContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '3rem',
  backgroundColor: '#f9fafb',
  borderRadius: '16px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  maxWidth: '600px',
  margin: '0 auto'
};

// 준비중 아이콘 스타일
const preparingIconStyle = {
  marginBottom: '1.5rem'
};

// 준비중 텍스트 스타일
const preparingTextStyle = {
  fontSize: '1.25rem',
  fontWeight: '500',
  color: '#333',
  marginBottom: '0.5rem',
  textAlign: 'center'
};

// 준비중 서브텍스트 스타일
const preparingSubtextStyle = {
  fontSize: '1rem',
  color: '#6b7280',
  marginBottom: '2rem',
  textAlign: 'center'
};

// 뒤로가기 버튼 스타일
const backButtonStyle = {
  position: 'absolute',
  top: '50px',
  left: '150px',
  zIndex: 10,
};

// 선택 화면으로 돌아가기 버튼 스타일
const backToSelectionBtnStyle = {
  padding: '12px 24px',
  fontWeight: '500',
  borderRadius: '8px',
  color: 'white',
  textTransform: 'none',
  letterSpacing: '0.02em'
};

// 회사 선택 후 다음 버튼 컨테이너 스타일
const companyButtonContainerStyle = {
  display: "flex",
  justifyContent: "center",
  marginTop: "2rem",
  width: "100%"
};

// 회사 선택 후 다음 버튼 스타일
const companyNextButtonStyle = {
  padding: "14px 28px",
  fontWeight: "600",
  fontSize: "1.1rem",
  borderRadius: "12px",
  boxShadow: "0 8px 16px rgba(59, 130, 246, 0.3)",
  transition: "all 0.3s ease",
  textTransform: "none",
  letterSpacing: "0.02em",
  backgroundColor: "#3b82f6",
  color: "white",
  minWidth: "150px",
  minHeight: "50px"
};

const selectedChipStyle = {
  backgroundColor: "#6366f1",
  color: "white",
  transition: "all 0.3s ease",
};
const unselectedChipStyle = {
  backgroundColor: "#e0e0e0",
  color: "black",
  transition: "all 0.3s ease",
};

// 2단계: 면접 세부 유형 선택
const interviewSubTypes = [
  {
    type: "기술면접",
    title: "기술 면접",
    icon: "mdi-code-tags",
    description: "기술적 역량을 평가하는 면접",
    status: "active"
  },
  {
    type: "인성면접",
    title: "인성 면접",
    icon: "mdi-account-heart",
    description: "인성과 조직 적합성을 평가하는 면접",
    status: "preparing"
  },
  {
    type: "종합면접",
    title: "종합 면접",
    icon: "mdi-account-multiple",
    description: "기술과 인성을 종합적으로 평가하는 면접",
    status: "preparing"
  }
];
const selectedInterviewSubType = ref("");

// 회사
const companies = ref(["당근마켓", "Toss", "SK-encore", "KT M mobile", "네이버", "카카오", "라인", "쿠팡"]);
const selectedCompany = ref("");

// 회사 선택 함수
const selectCompany = (company) => {
  selectedCompany.value = company;
};

// 상세 정보 입력 페이지로 이동 함수
const goToDetailForm = () => {
  if (!selectedCompany.value) {
    alert("회사를 선택해 주세요.");
    return;
  }
  
  router.push({
    name: 'ai-interview-form',
    params: { 
      type: interviewType.value,
      company: selectedCompany.value
    }
  });
};

// 전공
const academicBackgrounds = ref(["전공자", "비전공자"]);
const academicBackgroundMap = { 전공자: 2, 비전공자: 1 };
const selectedAcademicBackground = ref("");

// 경력
const careers = ref(["신입", "3년 이하", "5년 이하", "10년 이하", "10년 이상"]);
const careerMap = { 신입: 1, "3년 이하": 2, "5년 이하": 3, "10년 이하": 4, "10년 이상": 5 };
const selectedCareer = ref("");

// 프로젝트 경험
const projectExperience = ref(["있음", "없음"]);
const projectExperienceMap = { 있음: 2, 없음: 1 };
const selectedProjectExperience = ref("");

// 직무
const keywords = ref(["Backend", "Frontend", "App·Web", "AI", "Embedded", "DevOps"]);
const keywordMap = { Backend: 1, Frontend: 2, Embedded: 3, AI: 4, DevOps: 5, "App·Web": 6 };
const selectedKeyword = ref("");

// 기술 스택
const skills = ref([
  "풀스택", "백엔드/서버개발", "프론트엔드", "웹개발", "Flutter", "Java",
  "JavaScript", "Python", "Vue.js", "API", "MYSQL", "AWS", "ReactJS", "ASP",
  "Angular", "Bootstrap", "Node.js", "jQuery", "PHP", "JSP", "GraphQL", "HTML5",
]);
const skillsMap = Object.fromEntries(skills.value.map((s, i) => [s, i + 1]));
const selectedTechSkills = ref([]);

// 폼 유효성 검사
const isFormValid = computed(() => {
  if (interviewType.value === '전형별') {
    return (
      selectedInterviewSubType.value === '기술면접' &&
      selectedKeyword.value &&
      selectedAcademicBackground.value &&
      selectedCareer.value &&
      selectedProjectExperience.value &&
      selectedTechSkills.value.length > 0
    );
  } else if (interviewType.value === '기업별') {
    return (
      selectedCompany.value &&
      selectedKeyword.value &&
      selectedAcademicBackground.value &&
      selectedCareer.value &&
      selectedProjectExperience.value &&
      selectedTechSkills.value.length > 0
    );
  }
  return false;
});

// 선택 핸들러
const selectInterviewSubType = (type) => {
  // 준비중인 옵션은 선택 불가
  const option = interviewSubTypes.find(opt => opt.type === type);
  if (option && option.status === 'preparing') {
    alert('해당 기능은 현재 준비 중입니다.');
    return;
  }
  
  selectedInterviewSubType.value = type;
  
  // 선택 후 상세 정보 입력 페이지로 이동
  router.push({
    name: 'ai-interview-form',
    params: { 
      type: interviewType.value,
      subType: type
    }
  });
};

// 상세 정보 입력 페이지로 이동 함수
// const goToDetailForm = () => {
//   if (!selectedCompany.value) {
//     alert("회사를 선택해 주세요.");
//     return;
//   }
//
//   router.push({
//     name: 'ai-interview-form',
//     params: {
//       type: interviewType.value,
//       company: selectedCompany.value
//     }
//   });
// };

onMounted(() => {
  // 면접 유형이 없으면 선택 페이지로 리다이렉트
  if (!interviewType.value) {
    router.push('/ai-interview-selection');
  }
});
</script>
