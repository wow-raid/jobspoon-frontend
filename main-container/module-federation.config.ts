// 환경 변수가 없을 경우 오류 로그 출력
const checkEnvVar = (name: string, value: string | undefined): string => {
  if (!value) {
    console.error(`⚠️ 환경 변수 ${name}이(가) 설정되지 않았습니다.`);
    return '';
  }
  return value;
};

// 환경 변수에서 값 가져오기
const VUE_ACCOUNT_APP = checkEnvVar('VUE_ACCOUNT_APP', process.env.VUE_ACCOUNT_APP);
const VUE_AI_INTERVIEW_APP = checkEnvVar('VUE_AI_INTERVIEW_APP', process.env.VUE_AI_INTERVIEW_APP);
const REACT_NAVIGATION_APP = checkEnvVar('REACT_NAVIGATION_APP', process.env.REACT_NAVIGATION_APP);
const REACT_STUDYROOM_APP = checkEnvVar('REACT_STUDYROOM_APP', process.env.REACT_STUDYROOM_APP);
const SVELTE_REVIEW_APP = checkEnvVar('SVELTE_REVIEW_APP', process.env.SVELTE_REVIEW_APP);
const SVELTEKIT_REVIEW_APP = checkEnvVar('SVELTEKIT_REVIEW_APP', process.env.SVELTEKIT_REVIEW_APP);
const REACT_MYPAGE_APP = checkEnvVar('REACT_MYPAGE_APP', process.env.REACT_MYPAGE_APP);
const REACT_SPOON_WORD_APP = checkEnvVar('REACT_SPOON_WORD_APP', process.env.REACT_SPOON_WORD_APP);

// 개발 환경에서 로그 출력
if (process.env.NODE_ENV === 'development') {
  console.log('🔄 Module Federation Config - 환경 변수:');
  console.log('📍 VUE_ACCOUNT_APP:', VUE_ACCOUNT_APP);
  console.log('📍 REACT_NAVIGATION_APP:', REACT_NAVIGATION_APP);
  console.log('📍 VUE_AI_INTERVIEW_APP:', VUE_AI_INTERVIEW_APP);
}

export const mfConfig = {
  name: "html_container",
  remotes: {
    vueAccountApp: `vueAccountApp@${VUE_ACCOUNT_APP}/remoteEntry.js`,
    navigationBarApp: `navigationBarApp@${REACT_NAVIGATION_APP}/remoteEntry.js`,
    studyRoomApp: `studyRoomApp@${REACT_STUDYROOM_APP}/remoteEntry.js`,
    vueAiInterviewApp: `vueAiInterviewApp@${VUE_AI_INTERVIEW_APP}/remoteEntry.js`,
    svelteReviewApp: `svelteReviewApp@${SVELTE_REVIEW_APP}/remoteEntry.js`,
    svelteKitReviewApp: `svelteKitReviewApp@${SVELTEKIT_REVIEW_APP}/remoteEntry.js`,
    myPageApp: `myPageApp@${REACT_MYPAGE_APP}/remoteEntry.js`,
    spoonWordApp: `spoonWordApp@${REACT_SPOON_WORD_APP}/remoteEntry.js`
  },
  shared: {
    react: { singleton: true, requiredVersion: "^18.2.0", eager: true },
    "react-dom": { singleton: true, requiredVersion: "^18.2.0", eager: true },
    "@mui/material": { singleton: true, requiredVersion: "^7.0.1" },
    "@mui/icons-material": { singleton: true, requiredVersion: "^7.0.1" },
    "react-router-dom": { singleton: true, requiredVersion: "^6.30.0" },
    three: { singleton: true, requiredVersion: "^0.177.0" },
    '@jobspoon/app-state': { singleton: true, eager: true },
    '@jobspoon/theme-bridge': { singleton: true, eager: true },
    "styled-components": { singleton: true, requiredVersion: "^6.1.19" },
  },
};
