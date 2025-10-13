import styled from "styled-components";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { UserStudySchedule } from "../../api/studyScheduleApi";

const locales = { ko };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

type Props = {
    schedules: UserStudySchedule[];
    onEventClick?: (event: any) => void;
};

// 커스텀 Toolbar (이전 → 오늘 → 다음 순서)
const CustomToolbar = (toolbar: any) => {
    const goToBack = () => toolbar.onNavigate("PREV");
    const goToNext = () => toolbar.onNavigate("NEXT");
    const goToToday = () => toolbar.onNavigate("TODAY");

    const label = () => {
        const date = toolbar.date;
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월`;
    };

    return (
        <ToolbarWrapper>
            <div className="nav-buttons">
                <button onClick={goToBack}>이전</button>
                <button onClick={goToToday}>오늘</button>
                <button onClick={goToNext}>다음</button>
            </div>
            <div className="label">{label()}</div>
            <div className="view-buttons">
                {toolbar.views.map((view: string) => (
                    <button
                        key={view}
                        onClick={() => toolbar.onView(view)}
                        className={toolbar.view === view ? "active" : ""}
                    >
                        {view === "month" && "월"}
                        {view === "week" && "주"}
                        {view === "day" && "일"}
                        {view === "agenda" && "Agenda"}
                    </button>
                ))}
            </div>
        </ToolbarWrapper>
    );
};

export default function Calendar({ schedules, onEventClick }: Props) {
    const events = schedules.map((s) => ({
        title: `${s.studyRoomTitle} - ${s.title}`,
        start: new Date(s.startTime),
        end: new Date(s.endTime),
        allDay: false,
        description: s.description,
        studyRoomTitle: s.studyRoomTitle,
        studyRoomId: s.studyRoomId,
    }));

    const CustomEvent = ({ event }: any) => (
        <div style={{ whiteSpace: "normal", overflow: "visible", fontSize: 13 }}>
            {event.title}
        </div>
    );

    return (
        <CalendarWrapper>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={onEventClick}
                culture="ko"
                style={{ height: "100%" }}
                components={{ event: CustomEvent, toolbar: CustomToolbar }}
                views={["month", "week", "day", "agenda"]}
                defaultView="month"
                messages={{
                    next: "다음",
                    previous: "이전",
                    today: "오늘",
                    month: "월",
                    week: "주",
                    day: "일",
                    agenda: "Agenda",
                }}
            />
        </CalendarWrapper>
    );
}

/* ================== styled-components ================== */
const CalendarWrapper = styled.div`
    height: 650px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    font-family: "Noto Sans KR", sans-serif;

    /* ========== 날짜 셀 ========== */
    .rbc-month-view {
        border: none;
        .rbc-header {
            padding: 10px 0;
            font-weight: 600;
            font-size: 13px;
            color: #4b5563;
            border-bottom: 1px solid #e5e7eb;
        }
    }

    .rbc-date-cell {
        color: #6b7280;
        padding: 4px;
        font-size: 13px;
    }

    /* 일요일 컬러 */
    .rbc-header:first-child,
    .rbc-date-cell:nth-child(1) {
        color: #dc2626;
    }

    /* 오늘 날짜 하이라이트 */
    .rbc-today {
        background: #eef2ff !important;
        border-radius: 4px;
    }

    /* ========== 이벤트 ========== */
    .rbc-event {
        background: #3b82f6;
        border: none;
        border-radius: 6px;
        color: #fff;
        padding: 3px 6px;
        font-size: 13px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
    }

    .rbc-event:hover {
        transform: scale(1.03);
        background: #2563eb;
        box-shadow: 0 2px 6px rgba(37, 99, 235, 0.3);
    }

    /* 선택된 상태 */
    .rbc-selected {
        background: #2563eb !important;
    }

    /* 이전/다음 달 구역 회색톤 */
    .rbc-off-range-bg {
        background: #f9fafb;
    }

    /* 달력 경계선 부드럽게 */
    .rbc-month-row {
        border-bottom: 1px solid #f3f4f6;
    }
`;

/* ========== 커스텀 Toolbar 스타일 ========== */
const ToolbarWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    padding: 8px 16px;

    .nav-buttons button,
    .view-buttons button {
        background: #f3f4f6;
        border: none;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 13px;
        color: #374151;
        cursor: pointer;
        margin-right: 6px;
        transition: 0.2s;
    }

    .nav-buttons button:hover,
    .view-buttons button:hover {
        background: #e5e7eb;
    }

    .view-buttons .active {
        background: #e0e7ff;
        color: #1d4ed8;
        font-weight: 600;
        box-shadow: 0 0 0 2px #3b82f6 inset;
    }

    .label {
        font-weight: 600;
        color: #111827;
        font-size: 15px;
    }
`;
