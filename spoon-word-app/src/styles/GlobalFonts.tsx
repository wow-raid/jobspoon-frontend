import { createGlobalStyle } from "styled-components";

const ASSET = ""; // ⚠️ 포트 3006로 보내지 말고, 동일 오리진에서 받자!

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