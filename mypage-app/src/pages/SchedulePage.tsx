{/* 스터디 모임 일정 탭 */}

import styled from "styled-components";
import { useEffect, useState } from "react";
import {
    fetchUserStudySchedules,
    UserStudySchedule
} from "../api/studyScheduleApi.ts";
import Calendar from "../components/schedule/Calendar.tsx";

export default function SchedulePage() {

    const [schedules, setSchedules] = useState<UserStudySchedule[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchUserStudySchedules();
                setSchedules(data);
            } catch (e) {
                console.error("일정 불러오기 실패:", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <p>불러오는 중...</p>;
    if (schedules.length === 0) return <NoticeBanner>현재 등록된 일정이 없습니다.</NoticeBanner>;

    return (
        <>
            <Section>
                <Title>내 스터디 모임 일정</Title>
                {/* 👉 나중에 달력/일정 목록 들어갈 자리 */}
                <Calendar schedules={schedules}/>
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