import React, { useMemo, useState, useCallback } from "react";
import {Calendar, momentLocalizer, Views} from "react-big-calendar";
import moment from "moment";
import 'moment/locale/ko';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/Schedule.css';
import { FAKE_EVENTS, ScheduleEvent } from '../../data/mockData';
import Modal from "../Modal.tsx";
import EventForm from "./EventForm.tsx";

// moment.js를 한국어 설정으로 초기화
moment.locale('ko');
const localizer = momentLocalizer(moment);

const Schedule: React.FC = () => {
    const [events, setEvents] = useState<ScheduleEvent[]>(FAKE_EVENTS);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [currentView, setCurrentView] = useState<any>(Views.MONTH);

    // 모달 관련 state 추가
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalInitialDate, setModalInitialDate] = useState<Date | undefined>(undefined);

    const monthlyEvents = useMemo(() => {
        return events
            .filter(event =>
                moment(event.start).isSame(currentDate, 'month')
            )
            .sort((a, b) => a.start.getTime() - b.start.getTime());
    }, [events, currentDate]);

    const dayPropGetter = useCallback(
        (date: Date) => ({
            className: moment(date).isSame(selectedDate, 'day') ? 'selected-slot' : '',
        }),
        [selectedDate]
    );

    // 날짜 더블클릭 또는 버튼 클릭 시 모달 여는 함수
    const openAddEventModal = (date?: Date) => {
        setModalInitialDate(date || new Date());
        setIsModalOpen(true);
    }

    // 새 일정 추가 핸들러
    const handleAddEvent = (eventDate: Omit<ScheduleEvent, 'id'>) => {
        const newEvent: ScheduleEvent = {
            id: Date.now(),
            ...eventDate,
        }
        setEvents(prev => [...prev, newEvent]);
        setIsModalOpen(false);
    }

    return (
        <div className="schedule-container">
            <div className="schedule-header">
                <h2> 🗓️ 일정관리 </h2>
                <button className="add-event-btn" onClick={() => openAddEventModal()}> 일정 등록</button>
            </div>

            <div className="calendar-wrapper">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{height: 600}}
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    onView={(view) => setCurrentView(view)}
                    selectable={'ignoreEvents'}
                    onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
                    onDoubleClickSlot={(slotInfo) => openAddEventModal(slotInfo.start)}
                    onDrillDown={() => {}}
                    dayPropGetter={dayPropGetter}
                    messages={{
                        next: "다음",
                        previous: "이전",
                        today: "오늘",
                        month: "월",
                        week: "주",
                        day: "일",
                    }}
                    // 달력의 월이 변경될 때 currentDate state를 업데이트함
                    onNavigate={(date) => setCurrentDate(date)}
                />
            </div>

            <div className="monthly-events-list">
                <h3> {moment(currentDate).format('YYYY년 M월')} 일정 목록 </h3>
                {monthlyEvents.length > 0 ? (
                    monthlyEvents.map(event => (
                        <div key={event.id} className="event-list-item">
                            <div className="event-date">
                                {moment(event.start).format('D일 (ddd)')}
                            </div>
                            <div className="event-title">
                                {event.title}
                            </div>
                            <div className="event-time">
                                {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                            </div>
                        </div>
                    ))
                ) : (
                    <p> 이번 달에는 등록된 일정이 없습니다. </p>
                )}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <EventForm
                    onSubmit={handleAddEvent}
                    initialDate={modalInitialDate}
                />
            </Modal>
        </div>
    );
};

export default Schedule;