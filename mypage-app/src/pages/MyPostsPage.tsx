// pages/MyPostsPage.tsx
import styled, { keyframes } from "styled-components";
import React from "react";

export default function MyPostsPage() {
    return (
        <Section>
            <SectionHeader>
                <SectionTitle>나의 게시물</SectionTitle>
            </SectionHeader>

            <GuideBox>
                JobSpoon 곳곳에서 내가 남긴 <span className="emoji">🗂️</span>
                <strong> 게시글, 댓글, 리뷰</strong>를 한눈에 관리할 수 있는 공간이에요.
                <br />
                수정하거나 삭제할 수 있는
                관리 기능이 함께 추가될 예정입니다.
                <br />
                <span className="emoji">🚀</span>현재는 서비스 준비 중이며,
                더 편리한 기능으로 곧 찾아올게요 <span className="emoji">💙</span>
            </GuideBox>
        </Section>
    );
}

/* ================= styled-components ================= */
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
`;

const floatLoop = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
`;

const bounceEmoji = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
`;

const Section = styled.section`
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SectionTitle = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: rgb(17, 24, 39);
`;

const GuideBox = styled.div`
    background: #e0ecff; /* 멤버십과 동일한 파스텔 블루 */
    color: #1e3a8a;      /* 네이비 블루 텍스트 */
    font-size: 15px;
    line-height: 1.8;
    font-weight: 500;
    border-radius: 12px;
    padding: 24px;
    position: relative;
    white-space: pre-line;
    border: 1px solid #bfdbfe;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.1);

    animation: ${fadeUp} 0.8s ease both, ${floatLoop} 3.5s ease-in-out infinite;

    &::before,
    &::after {
        content: "";
        position: absolute;
        left: 40px;
        border-width: 0 8px 8px 8px;
        border-style: solid;
    }

    &::before {
        top: -9px;
        border-color: transparent transparent #bfdbfe transparent;
    }

    &::after {
        top: -8px;
        border-color: transparent transparent #e0ecff transparent;
    }

    strong {
        font-weight: 700;
        color: #1e40af; /* 강조 파랑 */
    }

    .emoji {
        display: inline-block;
        animation: ${bounceEmoji} 2.8s ease-in-out infinite;
    }
`;
