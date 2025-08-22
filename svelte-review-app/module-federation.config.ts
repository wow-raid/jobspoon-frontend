export const mfConfig = {
  name: "svelteReviewApp",
  filename: "remoteEntry.js",
  exposes: {
    "./App": "./src/App.svelte",
  },
  shared: {
    svelte: { singleton: true, requiredVersion: "^4.2.9", },
    three: { singleton: true, requiredVersion: "^0.177.0", },
    '@jobspoon/theme-bridge': { singleton: true, eager: false },
  },
  dts: false,
};