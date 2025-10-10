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

export default function Calendar({ schedules, onEventClick }: Props) {
    const events = schedules.map((s) => ({
        title: `${s.studyRoomTitle} - ${s.title}`,
        start: new Date(s.startTime),
        end: new Date(s.endTime),
        allDay: false,
        description: s.description,
        studyRoomTitle: s.studyRoomTitle,
    }));

    // 이벤트 셀 커스터마이징 (한 줄로 잘리지 않게)
    const CustomEvent = ({ event }: any) => (
        <div style={{ whiteSpace: "normal", overflow: "visible", fontSize: 13 }}>
            {event.title}
        </div>
    );

    return (
        <div style={{ height: 600 }}>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={onEventClick}
                culture="ko"
                style={{ height: 650 }}
                components={{ event: CustomEvent }}
                messages={{
                    next: "다음",
                    previous: "이전",
                    today: "오늘",
                    month: "월",
                    week: "주",
                    day: "일",
                }}
            />
        </div>
    );
}