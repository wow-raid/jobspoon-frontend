{/* 멤버십 메뉴 */}

import React, { useState } from "react";
import styled from "styled-components";
import ServiceModal from "../components/modals/ServiceModal.tsx";
import CreditUsageModal from "../components/modals/CreditUsageModal.tsx";

// 운영 중인 크레딧 상품 (mock)
const credits = [
    { id: 1, name: "10 크레딧", amount: 10, price: 5000, tag: "체험용" },
    { id: 2, name: "50 크레딧", amount: 50, price: 20000, tag: "꾸준히 사용하는 분께 추천" },
    { id: 3, name: "100 크레딧", amount: 100, price: 35000, tag: "헤비 유저 전용" },
];

// 내 크레딧 현황 (mock)
const myCredits = {
    balance: 72,
    lastUsed: "2025-09-14",
    expiry: "2026-03-01",
    usageHistory: [
        { date: "2025-09-14", action: "AI 모의면접", cost: 5 },
        { date: "2025-09-10", action: "문제풀이", cost: 2 },
        { date: "2025-09-05", action: "스터디룸 개설", cost: 10 },
        { date: "2025-08-30", action: "문제풀이", cost: 3 },
        { date: "2025-08-25", action: "AI 모의면접", cost: 5 },
    ],
};

export default function MembershipPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [usageModalOpen, setUsageModalOpen] = useState(false);

    return (
        <>
            <NoticeBanner>🚧 서비스 준비 중입니다</NoticeBanner>

            {/* 운영 중인 크레딧 상품 */}
            <Section>
                <SectionHeader>
                    <SectionTitle>크레딧 충전하기</SectionTitle>
                    <InfoButton onClick={() => setUsageModalOpen(true)}>사용처 안내</InfoButton>
                </SectionHeader>
                <SectionDesc>
                    크레딧은 AI 모의면접, 문제풀이, 스터디룸 개설 등에 사용할 수 있습니다.
                </SectionDesc>
                <PlanGrid>
                    {credits.map((credit) => (
                        <PlanCard key={credit.id}>
                            <h3>{credit.name}</h3>
                            <p className="price">{credit.price.toLocaleString()}원</p>
                            <TagBadge>{credit.tag}</TagBadge>
                            <DetailButton onClick={() => setIsModalOpen(true)}>
                                구매하기
                            </DetailButton>
                        </PlanCard>
                    ))}
                </PlanGrid>
            </Section>

            {/* 내 크레딧 현황 */}
            <Section>
                <SectionTitle>내 크레딧</SectionTitle>
                <SubscriptionBox>
                    <p>
                        보유 크레딧: <strong>{myCredits.balance}개</strong>
                    </p>
                    <p>마지막 사용일: {myCredits.lastUsed}</p>
                    <p>만료일: {myCredits.expiry}</p>
                    <CancelButton onClick={() => setIsModalOpen(true)}>
                        환불 요청
                    </CancelButton>
                </SubscriptionBox>
            </Section>

            {/* 사용 내역 */}
            <Section>
                <SectionTitle>사용 내역</SectionTitle>
                <UsageList>
                    {myCredits.usageHistory.map((u, i) => (
                        <UsageItem key={i}>
                            <span>{u.date}</span>
                            <span>{u.action}</span>
                            <span>-{u.cost} 크레딧</span>
                        </UsageItem>
                    ))}
                </UsageList>
            </Section>

            {/* 서비스 모달 */}
            <ServiceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />

            {/* 사용처 안내 모달 */}
            <CreditUsageModal
                isOpen={usageModalOpen}
                onClose={() => setUsageModalOpen(false)}
            />
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

const SectionDesc = styled.p`
    font-size: 14px;
    color: rgb(107, 114, 128);
    margin-top: -8px;
    margin-bottom: 16px;
`;

const PlanGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
`;

const PlanCard = styled.div`
    background: rgb(249, 250, 251);
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

    display: flex;               /* flexbox */
    flex-direction: column;      /* 세로 배치 */

    h3 {
        font-size: 16px;
        font-weight: 600;
        color: rgb(17, 24, 39);
        margin-bottom: 8px;
    }

    .price {
        font-size: 14px;
        font-weight: 500;
        color: rgb(59, 130, 246);
        margin-bottom: 6px;
    }

    .tag {
        font-size: 13px;
        font-weight: 500;
        color: rgb(59, 130, 246);
        background: rgba(59, 130, 246, 0.1);
        padding: 4px 10px;
        border-radius: 999px;
        display: inline-block;
        width: fit-content;
    }
`;

const TagBadge = styled.span`
    display: inline-block;        /* 블록 전체 말고 글자만큼 */
    width: fit-content;           /* 글씨 크기만큼만 차지 */
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    color: rgb(59, 130, 246);
    background: rgba(59, 130, 246, 0.1);
    border-radius: 999px;         /* pill 형태 */
    margin-bottom: 12px;
`;

const SubscriptionBox = styled.div`
    background: rgb(249, 250, 251);
    border-radius: 12px;
    padding: 20px;
    font-size: 14px;
    color: rgb(55, 65, 81);

    p {
        margin-bottom: 6px;
    }

    strong {
        font-weight: 700;
        color: rgb(17, 24, 39);
    }
`;

const DetailButton = styled.button`
    margin-top: auto;             /* 버튼을 맨 아래로 */
    align-self: flex-end;         /* 오른쪽 끝으로 */
    padding: 8px 12px;
    font-size: 13px;
    background: rgb(59, 130, 246);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
`;

const CancelButton = styled(DetailButton)`
    background: rgb(239, 68, 68); /* 빨강 계열 */
    margin-top: 12px;
`;

const UsageList = styled.div`
    max-height: 200px;
    overflow-y: auto;
`;

const UsageItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid #eee;
`;

const InfoButton = styled.button`
  font-size: 13px;
  padding: 6px 12px;
  background: rgb(243, 244, 246);
  color: rgb(55, 65, 81);
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: rgb(229, 231, 235);
  }
`;

const NoticeBanner = styled.div`
    background: #fef3c7; /* 연한 노랑 */
    color: #92400e;      /* 진한 주황/갈색 */
    font-size: 18px;     /* ✅ 글자 크기 키움 */
    font-weight: 700;    /* ✅ 글자 두께 강조 */
    text-align: center;
    padding: 20px 12px;  /* ✅ 상하 여백 넓힘 */
    border-radius: 8px;
    margin: 24px 0;      /* ✅ 위아래 간격 넉넉히 */
`;