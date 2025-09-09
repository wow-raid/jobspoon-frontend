import * as path from "node:path";
import { defineConfig } from "@rspack/cli";
import {DefinePlugin, rspack} from "@rspack/core";
import * as RefreshPlugin from "@rspack/plugin-react-refresh";
import { ModuleFederationPlugin } from "@module-federation/enhanced/rspack";

import { mfConfig } from "./module-federation.config";

const isDev = process.env.NODE_ENV === "development";

// Target browsers, see: https://github.com/browserslist/browserslist
const targets = ["chrome >= 87", "edge >= 88", "firefox >= 78", "safari >= 14"];

export default defineConfig({
  context: __dirname,
  entry: {
    main: "./src/index.ts",
  },
  resolve: {
    extensions: ["...", ".ts", ".tsx", ".jsx"],
  },

  devServer: {
    port: 80,
    historyApiFallback: {
      rewrites: [
        { from: /^\/vue-account\/kakao_oauth\/kakao-access-token$/, to: '/index.html' },
        { from: /^\/vue-account\/.*$/, to: '/index.html' },
        { from: /./, to: '/index.html' },
      ]
    },
    watchFiles: [path.resolve(__dirname, "src")],
  },
  output: {
    // You need to set a unique value that is not equal to other applications
    uniqueName: "main_container",
    // publicPath must be configured if using manifest
    publicPath: "/",
  },

  experiments: {
    css: true,
  },

  module: {
    rules: [
      {
        test: /\.svg$/,
        type: "asset",
      },
      {
        test: /\.(png|jpe?g|gif|webp|avif)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name].[contenthash:6][ext]",
        },
      },
      {
        test: /\.css$/,
        use: ["postcss-loader"],
        type: "css",
      },
      {
        test: /\.(jsx?|tsx?)$/,
        use: [
          {
            loader: "builtin:swc-loader",
            options: {
              jsc: {
                parser: {
                  syntax: "typescript",
                  tsx: true,
                },
                transform: {
                  react: {
                    runtime: "automatic",
                    development: isDev,
                    refresh: isDev,
                  },
                },
              },
              env: { targets },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new rspack.HtmlRspackPlugin({
      template: "./index.html",
    }),
    new DefinePlugin({
      "process.env.MFE_PUBLIC_SERVICE": JSON.stringify(process.env.MFE_PUBLIC_SERVICE),
      "process.env.VUE_ACCOUNT_APP": JSON.stringify(process.env.VUE_ACCOUNT_APP),
      "process.env.VUE_AI_INTERVIEW_APP": JSON.stringify(process.env.VUE_AI_INTERVIEW_APP),
      "process.env.REACT_NAVIGATION_APP": JSON.stringify(process.env.REACT_NAVIGATION_APP),
      "process.env.REACT_STUDYROOM_APP": JSON.stringify(process.env.REACT_STUDYROOM_APP),
      "process.env.REACT_MYPAGE_APP": JSON.stringify(process.env.REACT_MYPAGE_APP),
      "process.env.REACT_SPOON_WORD_APP": JSON.stringify(process.env.REACT_SPOON_WORD_APP),
    }),
    new ModuleFederationPlugin(mfConfig),
  ].filter(Boolean),
  optimization: {
    minimizer: [
      new rspack.SwcJsMinimizerRspackPlugin(),
      new rspack.LightningCssMinimizerRspackPlugin({
        minimizerOptions: { targets },
      }),
    ],
  },
});
