// Tailwind CSS 불러오기
import "./index.css";

// body에 debug 클래스 추가하면 모든 요소에 테두리 표시됨
document.body.classList.add("debug");

// 단독 실행 환경에서만 bootstrap 실행
import("./bootstrap.tsx");
