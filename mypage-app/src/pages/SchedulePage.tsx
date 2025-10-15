import styled from "styled-components";
import { useEffect, useMemo, useState } from "react";
import {
    fetchUserStudySchedules,
    UserStudySchedule
} from "../api/studyScheduleApi.ts";
import {
    fetchUserSchedules,
    createUserSchedule,
    UserScheduleResponse,
    UserScheduleRequest
} from "../api/userScheduleApi.ts";
import Calendar from "../components/schedule/Calendar.tsx";
import ScheduleDetailPanel from "../components/schedule/ScheduleDetailPanel.tsx";
import AddScheduleModal from "../components/modals/AddScheduleModal.tsx";

type UnifiedSchedule = (UserScheduleResponse | UserStudySchedule) & {
    type: "personal" | "study";
};

export default function SchedulePage() {
    const [allSchedules, setAllSchedules] = useState<UnifiedSchedule[]>([]);
    const [viewMode, setViewMode] = useState<"all" | "personal" | "study">("all");
    const [selected, setSelected] = useState<UnifiedSchedule | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // 추가: 월간/주간/일간 뷰 상태 관리
    const [calendarView, setCalendarView] = useState<"month" | "week" | "day">("month");
    const [calendarDate, setCalendarDate] = useState<Date>(new Date());

    // 일정 불러오기 (개인 + 스터디)
    async function loadSchedules() {
        try {
            const [personal, study] = await Promise.all([
                fetchUserSchedules(),
                fetchUserStudySchedules(),
            ]);

            const merged: UnifiedSchedule[] = [
                ...personal.map((p) => ({ ...p, type: "personal" as const })),
                ...study.map((s) => ({ ...s, type: "study" as const })),
            ];

            setAllSchedules(merged);
        } catch (err) {
            console.error("일정 불러오기 실패:", err);
        }
    }

    useEffect(() => {
        loadSchedules();
    }, []);

    // 일정 등록
    async function handleCreateSchedule(formData: UserScheduleRequest) {
        try {
            await createUserSchedule(formData);
            await loadSchedules(); // 일정 목록 갱신
            setIsAddModalOpen(false);
        } catch (err) {
            console.error("일정 등록 실패:", err);
        }
    }

    // 보기 모드 필터링
    const filteredSchedules = useMemo(() => {
        if (viewMode === "all") return allSchedules;
        return allSchedules.filter((s) => s.type === viewMode);
    }, [allSchedules, viewMode]);

    return (
        <Section>
            {/* 상단 헤더 영역 */}
            <HeaderArea>
                <Title>내 일정</Title>
                <RightArea>
                    {/* 개인 일정일 때만 일정 추가 버튼 */}
                    {viewMode === "personal" && (
                        <AddButton onClick={() => setIsAddModalOpen(true)}>
                            + 일정 추가
                        </AddButton>
                    )}

                    {/* 보기 모드 토글 */}
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
                </RightArea>
            </HeaderArea>

            {/* 달력 */}
            {/* view, date 상태를 제어하도록 변경 */}
            <Calendar
                schedules={filteredSchedules}
                view={calendarView}
                date={calendarDate}
                onViewChange={setCalendarView}
                onDateChange={setCalendarDate}
                onEventClick={(event) => setSelected(event)}
            />

            {/* 일정 상세 패널 */}
            <ScheduleDetailPanel
                schedule={selected}
                onClose={() => setSelected(null)}
            />

            {/* 일정 추가 모달 */}
            {isAddModalOpen && (
                <AddScheduleModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleCreateSchedule}
                />
            )}
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

const RightArea = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const AddButton = styled.button`
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 6px;
    padding: 6px 14px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
        background: #2563eb;
    }
`;