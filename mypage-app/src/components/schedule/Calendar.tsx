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
};

export default function Calendar({ schedules }: Props) {
    const events = schedules.map((s) => ({
        title: `${s.studyRoomTitle} - ${s.title}`,
        start: new Date(s.startTime),
        end: new Date(s.endTime),
        allDay: false,
    }));

    return (
        <div style={{ height: 600 }}>
            <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                culture="ko"
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