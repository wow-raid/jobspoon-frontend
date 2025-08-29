import React from "react";
import styled from "styled-components";

import img01 from "../assets/main01.jpg";
import img02 from "../assets/main02.jpg";
import img03 from "../assets/main03.jpg";
import img04 from "../assets/main04.jpg";
import img05 from "../assets/main05.jpg";
import img06 from "../assets/main06.jpg";
import img07 from "../assets/main07.jpg";

const Page = styled.main`
  background: #0f1017;
  min-height: 100vh;

  /* 텍스트/이미지 선택 및 터치 호출 방지 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
`;

const Section = styled.section`
  width: 100%;
  margin: 0;
`;

const Picture = styled.img`
  width: 100%;
  display: block;
  height: auto;

  /* 이미지 상호작용 차단 */
  pointer-events: none;        /* 클릭/우클릭 대상에서 제외 */
  -webkit-user-drag: none;     /* 사파리/크롬 드래그 방지 */
  user-drag: none;             /* 표준화 전 속성 */
`;

/* 우클릭/롱프레스 메뉴 차단용 핸들러 */
const preventContextMenu: React.MouseEventHandler = (e) => {
    e.preventDefault();
};

export default function Main() {
    const images = [img01, img02, img03, img04, img05, img06, img07];

    return (
        <Page onContextMenu={preventContextMenu}>
            {images.map((src, i) => (
                <Section key={src} onContextMenu={preventContextMenu}>
                    <Picture
                        src={src}
                        alt={`JOB Spoon 메인 비주얼 ${i + 1}`}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}              // 드래그 방지(HTML 속성)
                        onDragStart={(e) => e.preventDefault()}
                    />
                </Section>
            ))}
        </Page>
    );
}
