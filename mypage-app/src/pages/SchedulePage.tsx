{/* 스터디 모임 일정 탭 */}

import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import {
    fetchUserStudySchedules,
    UserStudySchedule
} from "../api/studyScheduleApi.ts";
import {
    fetchUserSchedules,
    UserScheduleResponse
} from "../api/userScheduleApi.ts";
import Calendar from "../components/schedule/Calendar.tsx";
import ScheduleDetailPanel from "../components/schedule/ScheduleDetailPanel.tsx";

type UnifiedSchedule = (UserScheduleResponse | UserStudySchedule) & {
    type: "personal" | "study";
};

export default function SchedulePage() {
    const [allSchedules, setAllSchedules] = useState<UnifiedSchedule[]>([]);
    const [viewMode, setViewMode] = useState<"all" | "personal" | "study">("all");
    const [selected, setSelected] = useState<UnifiedSchedule | null>(null);


    // 일정 불러오기 (개인 + 스터디)
    useEffect(() => {
        async function loadSchedules() {
            const [personal, study] = await Promise.all([
                fetchUserSchedules(),
                fetchUserStudySchedules(),
            ]);

            const merged: UnifiedSchedule[] = [
                ...personal.map((p) => ({ ...p, type: "personal" as const })),
                ...study.map((s) => ({ ...s, type: "study" as const })),
            ];

            setAllSchedules(merged);
        }

        loadSchedules();
    }, []);

    // 보기 모드 필터링
    const filteredSchedules = useMemo(() => {
        if (viewMode === "all") return allSchedules;
        return allSchedules.filter((s) => s.type === viewMode);
    }, [allSchedules, viewMode]);

    return (
        <Section>
            <HeaderArea>
                <Title>내 일정</Title>
                <ViewToggle>
                    <button
                        className={viewMode === "all" ? "active" : ""}
                        onClick={() => setViewMode("all")}
                    >
                        전체
                    </button>
                    <button
                        className={viewMode === "personal" ? "active" : ""}
                        onClick={() => setViewMode("personal")}
                    >
                        개인 일정
                    </button>
                    <button
                        className={viewMode === "study" ? "active" : ""}
                        onClick={() => setViewMode("study")}
                    >
                        스터디 일정
                    </button>
                </ViewToggle>
            </HeaderArea>

            {/* 달력 */}
            <Calendar
                schedules={filteredSchedules}
                onEventClick={(event) => setSelected(event)}
            />

            {/* 일정 상세 패널 */}
            <ScheduleDetailPanel
                schedule={selected}
                onClose={() => setSelected(null)}
            />
        </Section>
    );
}

/* ================== styled-components ================== */
const Section = styled.section`
    position: relative;
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
`;

const HeaderArea = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Title = styled.h2`
    font-size: 18px;
    font-weight: 700;
    color: rgb(17, 24, 39);
`;

const ViewToggle = styled.div`
    display: flex;
    gap: 8px;

    button {
        padding: 6px 14px;
        border-radius: 6px;
        border: 1px solid #d1d5db;
        background: #f9fafb;
        cursor: pointer;
        font-size: 14px;
        color: #374151;
        transition: 0.2s;

        &.active {
            background: #3b82f6;
            color: white;
            border-color: #2563eb;
        }

        &:hover {
            background: #e5e7eb;
        }
    }
`;