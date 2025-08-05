export const mfConfig = {
  name: "html_container",
  remotes: {
    vueAccountApp: `vueAccountApp@${process.env.VUE_ACCOUNT_APP}/remoteEntry.js`,
    navigationBarApp: `navigationBarApp@${process.env.REACT_NAVIGATION_APP}/remoteEntry.js`,
    studyRoomApp: `studyRoomApp@${process.env.REACT_STUDYROOM_APP}/remoteEntry.js`,
  },
  shared: {
    react: { singleton: true, requiredVersion: "^18.2.0" },
    "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
    "@mui/material": { singleton: true, requiredVersion: "^7.0.1" },
    "@mui/icons-material": { singleton: true, requiredVersion: "^7.0.1" },
    "react-router-dom": { singleton: true, requiredVersion: "^6.30.0" },
    three: { singleton: true, requiredVersion: "^0.177.0" },
  },
};
