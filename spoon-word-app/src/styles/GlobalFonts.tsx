import { createGlobalStyle } from "styled-components";

const ASSET = process.env.MFE_PUBLIC_SERVICE || "";

export const GlobalFonts = createGlobalStyle`
  @font-face {
    font-family: 'GhanaChocolate';
    src: url('${ASSET}/fonts/ghana-choco/GhanaChocolate.woff2') format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }

  :root{
    --font-display: 'GhanaChocolate', 'Pretendard', 'Noto Sans KR', system-ui, -apple-system, Segoe UI, Roboto, 'Helvetica Neue', Arial, 'Apple SD Gothic Neo', 'Malgun Gothic', '맑은 고딕', sans-serif;
  }
`;
