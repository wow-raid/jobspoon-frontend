{/* 스터디 모임 일정 탭 */}

import styled from "styled-components";
import { useEffect, useState } from "react";
import {
    fetchUserStudySchedules,
    UserStudySchedule
} from "../api/studyScheduleApi.ts";
import Calendar from "../components/schedule/Calendar.tsx";
import ScheduleDetailPanel from "../components/schedule/ScheduleDetailPanel.tsx";

export default function SchedulePage() {
    const [schedules, setSchedules] = useState<UserStudySchedule[]>([]);
    const [selected, setSelected] = useState<UserStudySchedule | null>(null);

    useEffect(() => {
        fetchUserStudySchedules().then(setSchedules);
    }, []);

    return (
        <>
            <Section>
                <Title>내 스터디 모임 일정</Title>

                {/* 일정 달력 */}
                <Calendar
                    schedules={schedules}
                    onEventClick={(event) => setSelected(event)}
                />

                {/* 일정 상세 패널 */}
                <ScheduleDetailPanel
                    schedule={selected}
                    onClose={() => setSelected(null)}
                />
            </Section>
        </>
    );
}

/* ================== styled-components ================== */
const Section = styled.section`
    position: relative; /* ✅ 슬라이드 패널 위치 기준 */
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
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