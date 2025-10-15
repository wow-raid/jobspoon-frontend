import styled from "styled-components";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ko } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

const locales = { ko };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

type Props = {
    schedules: any[];
    onEventClick?: (event: any) => void;
    view: "month" | "week" | "day";
    date: Date;
    onViewChange: (v: "month" | "week" | "day") => void;
    onDateChange: (d: Date) => void;
};

// 커스텀 Toolbar
const CustomToolbar = ({ label, onNavigate, onView, view }: any) => {
    const goToBack = () => onNavigate("PREV");
    const goToNext = () => onNavigate("NEXT");
    const goToToday = () => onNavigate("TODAY");

    return (
        <ToolbarWrapper>
            <div className="nav-buttons">
                <button onClick={goToBack}>이전</button>
                <button onClick={goToToday}>오늘</button>
                <button onClick={goToNext}>다음</button>
            </div>
            <div className="label">{label}</div>

            {/* 여기 핵심 — onViewChange 대신 onView 사용 */}
            {view !== "month" && (
                <BackToMonthBtn onClick={() => onView("month")}>
                    ← 월간 보기
                </BackToMonthBtn>
            )}
        </ToolbarWrapper>
    );
};

export default function Calendar({ schedules, onEventClick }: Props) {
    const events = schedules.map((s) => ({
        title:
            s.type === "study" ? `${s.studyRoomTitle || ""} - ${s.title}` : s.title,
        start: new Date(s.startTime),
        end: new Date(s.endTime),
        allDay: s.allDay,
        description: s.description,
        color: s.type === "study" ? "#10b981" : "#3b82f6",
        type: s.type,
        studyRoomId: s.studyRoomId,
    }));

    const CustomEvent = ({ event }: any) => (
        <div style={{ whiteSpace: "normal", fontSize: 13 }}>{event.title}</div>
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
                views={["month", "week", "day"]}
                defaultView="month"
                eventPropGetter={(event) => ({
                    style: {
                        backgroundColor: event.color,
                        borderRadius: "6px",
                        border: "none",
                        color: "white",
                    },
                })}
                messages={{
                    next: "다음",
                    previous: "이전",
                    today: "오늘",
                    month: "월",
                    week: "주",
                    day: "일",
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
`;

const ToolbarWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    padding: 8px 16px;

    .nav-buttons button {
        background: #f3f4f6;
        border: none;
        border-radius: 8px;
        padding: 6px 10px;
        font-size: 13px;
        color: #374151;
        cursor: pointer;
        margin-right: 6px;
    }

    .label {
        font-weight: 600;
        color: #111827;
        font-size: 15px;
    }
`;

const BackToMonthBtn = styled.button`
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 6px 10px;
    font-size: 13px;
    cursor: pointer;
`;
