{/* 멤버십 메뉴 (간소화 버전) */}

import React from "react";
import styled from "styled-components";

export default function MembershipPage() {
    return (
        <>
            {/* 🚧 안내 배너 */}
            <NoticeBanner>🚧 서비스 준비 중입니다</NoticeBanner>

            {/* 크레딧 섹션 */}
            <Section>
                <SectionHeader>
                    <SectionTitle>멤버십</SectionTitle>
                </SectionHeader>

                <SectionDesc>
                    🌟 JobSpoon 멤버십은 학습, 면접, 스터디 등 <br />
                    다양한 기능을 자유롭게 이용할 수 있는 구독형 서비스예요! <br />
                    🚀 현재 서비스 준비 중이며, 더 많은 혜택과 함께 곧 찾아올게요 💛
                </SectionDesc>
            </Section>
        </>
    );
}

/* ================= styled-components ================= */
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

const NoticeBanner = styled.div`
    background: #fef3c7; /* 연한 노랑 */
    color: #92400e;      /* 진한 주황/갈색 */
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    padding: 20px 12px;
    border-radius: 8px;
    margin: 24px 0;
`;

const SectionDesc = styled.p`
    font-size: 14px;
    color: rgb(107, 114, 128);
    line-height: 1.8;
    white-space: pre-line; /* 줄바꿈 유지 */
`;