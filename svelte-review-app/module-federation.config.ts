export const mfConfig = {
  name: "svelteReviewApp",
  filename: "remoteEntry.js",
  exposes: {
    "./App": "./src/App.svelte",
  },
  shared: ["svelte"],
  dts: false,
};