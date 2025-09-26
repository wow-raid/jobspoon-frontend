// pages/SchedulePage.tsx
import styled from "styled-components";

export default function SchedulePage() {
    return (
        <>
            <NoticeBanner>🚧 서비스 준비 중입니다</NoticeBanner>

            <Section>
                <Title>내 일정</Title>
                {/* 👉 나중에 달력/일정 목록 들어갈 자리 */}
            </Section>
        </>
    );
}

/* ================== styled-components ================== */
const Section = styled.section`
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Title = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: rgb(17, 24, 39);
`;

const NoticeBanner = styled.div`
  background: #fef3c7; /* 연한 노랑 */
  color: #92400e;      /* 진한 주황/갈색 */
  font-size: 18px;     /* 글자 크게 */
  font-weight: 700;
  text-align: center;
  padding: 20px 12px;  /* 상하 넓게 */
  border-radius: 8px;
  margin: 24px 0;      /* 위아래 간격 */
`;