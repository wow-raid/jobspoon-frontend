export const mfConfig = {
  name: "html_container",
  remotes: {
    // Docker 컨테이너 내에서는 상대 경로를 사용
    vueAccountApp: `vueAccountApp@/vue-account-app/remoteEntry.js`,
    navigationBarApp: `navigationBarApp@/navigation-bar-app/remoteEntry.js`,
    studyRoomApp: `studyRoomApp@/studyroom-app/remoteEntry.js`,
    vueAiInterviewApp: `vueAiInterviewApp@/vue-ai-interview-app/remoteEntry.js`,
    svelteReviewApp: `svelteReviewApp@/svelte-review-app/remoteEntry.js`,
    myPageApp: `myPageApp@/mypage-app/remoteEntry.js`
  },
  shared: {
    react: { singleton: true, requiredVersion: "^18.2.0" },
    "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
    "@mui/material": { singleton: true, requiredVersion: "^7.0.1" },
    "@mui/icons-material": { singleton: true, requiredVersion: "^7.0.1" },
    "react-router-dom": { singleton: true, requiredVersion: "^6.30.0" },
    three: { singleton: true, requiredVersion: "^0.177.0" },
    '@jobspoon/app-state': { singleton: true, eager: true },
    '@jobspoon/theme-bridge': { singleton: true },
    "styled-components": { singleton: true, requiredVersion: "^6.1.19" },
  },
};
