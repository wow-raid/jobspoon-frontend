{/* 멤버십 메뉴 (간소화 버전) */}

import React from "react";
import styled, { keyframes } from "styled-components";

export default function MembershipPage() {
    return (
        <>
            <Section>
                <SectionHeader>
                    <SectionTitle>멤버십</SectionTitle>
                </SectionHeader>

                <MembershipInfo>
                    <span className="emoji">💎</span> JobSpoon 멤버십은 학습, 면접, 스터디 등 <br />
                    다양한 기능을 자유롭게 이용할 수 있는 구독형 서비스예요! <br />
                    <span className="emoji">🚀</span> 현재 서비스 준비 중이며, 더 많은 혜택과 함께 곧 찾아올게요 <span className="emoji">💙</span>
                </MembershipInfo>
            </Section>
        </>
    );
}

/* ================= styled-components ================= */
const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const floatLoop = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
`;

const bounceEmoji = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
`;

const Section = styled.section`
    padding: 24px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 20px;
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

const MembershipInfo = styled.div`
    background: #e0ecff; /* 파스텔 블루 */
    color: #1e3a8a; /* 네이비 블루 */
    font-size: 15px;
    line-height: 1.8;
    font-weight: 500;
    border-radius: 12px;
    padding: 24px;
    margin-top: 8px;
    position: relative;
    white-space: pre-line;
    border: 1px solid #bfdbfe;
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.1);

    /* 등장 + 둥둥 효과 */
    animation: ${fadeUp} 0.8s ease both, ${floatLoop} 3.5s ease-in-out infinite;

    /* 말풍선 꼬리 (테두리 포함 두 겹) */
    &::before,
    &::after {
        content: "";
        position: absolute;
        left: 40px;
        border-width: 0 8px 8px 8px;
        border-style: solid;
    }

    /* 바깥쪽 (테두리색) */
    &::before {
        top: -9px; /* 살짝 위로 */
        border-color: transparent transparent #bfdbfe transparent;
    }

    /* 안쪽 (배경색) */
    &::after {
        top: -8px;
        border-color: transparent transparent #e0ecff transparent;
    }

    /* 이모지 통통 튀는 애니메이션 */
    .emoji {
        display: inline-block;
        animation: ${bounceEmoji} 2.8s ease-in-out infinite;
    }
`;