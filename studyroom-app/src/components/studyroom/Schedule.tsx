import React, { useMemo, useState, useCallback } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import 'moment/locale/ko';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '../../styles/Schedule.css';
import { FAKE_EVENTS, ScheduleEvent } from '../../data/mockData';
import Modal from "../Modal";
import EventForm from "./EventForm";
import EventDetail from "./EventDetail";

// moment.js를 한국어 설정으로 초기화
moment.locale('ko');
const localizer = momentLocalizer(moment);

// 현재 로그인한 사용자를 가정합니다.
const CURRENT_USER_ID = '모임장';

const Schedule: React.FC = () => {
    // --- State 정의 ---
    const [events, setEvents] = useState<ScheduleEvent[]>(FAKE_EVENTS);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    // 모달 상태 관리
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    // 모달에 전달할 데이터 관리
    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
    const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

    // --- 핸들러 함수 정의 ---

    // 날짜 칸 클릭/더블클릭 핸들러
    const handleSelectSlot = (slotInfo: { start: Date, action: 'select' | 'click' | 'doubleClick' }) => {
        if (slotInfo.action === 'doubleClick') {
            openFormModal(slotInfo.start);
        } else {
            setSelectedDate(slotInfo.start);
        }
    };

    // 등록된 일정 클릭 핸들러
    const handleSelectEvent = (event: ScheduleEvent) => {
        setSelectedEvent(event);
        setIsDetailModalOpen(true);
    };

    // 폼 제출 핸들러 (생성/수정 통합)
    const handleFormSubmit = (eventData: Omit<ScheduleEvent, 'id' | 'authorId'>) => {
        if (editingEvent) {
            // 수정
            setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...editingEvent, ...eventData } : e));
        } else {
            // 생성
            const newEvent: ScheduleEvent = {
                id: Date.now(),
                authorId: CURRENT_USER_ID,
                ...eventData,
            };
            setEvents(prev => [...prev, newEvent]);
        }
        closeFormModal();
    };

    // 삭제 핸들러
    const handleDeleteEvent = () => {
        if (!selectedEvent) return;
        if (window.confirm("정말로 일정을 삭제하시겠습니까?")) {
            setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
            setIsDetailModalOpen(false);
        }
    };

    // 수정 시작 핸들러
    const handleEditEvent = () => {
        if (!selectedEvent) return;
        setEditingEvent(selectedEvent);
        setIsDetailModalOpen(false);
        setIsFormModalOpen(true);
    };

    // 폼 모달 열기/닫기
    const openFormModal = (date?: Date) => {
        setEditingEvent(null);
        setSelectedDate(date || new Date()); // 모달 열 때 날짜도 선택되도록
        setIsFormModalOpen(true);
    };
    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingEvent(null);
    };

    // --- 렌더링을 위한 데이터 가공 ---

    const monthlyEvents = useMemo(() => {
        return events
            .filter(event => moment(event.start).isSame(currentDate, 'month'))
            .sort((a, b) => a.start.getTime() - b.start.getTime());
    }, [events, currentDate]);

    const dayPropGetter = useCallback(
        (date: Date) => ({
            className: moment(date).isSame(selectedDate, 'day') ? 'selected-day' : '',
        }),
        [selectedDate]
    );

    return (
        <div className="schedule-container">
            <div className="schedule-header">
                <h2>🗓️ 일정관리</h2>
                <button className="add-event-btn" onClick={() => openFormModal()}>일정 등록</button>
            </div>

            <div className="calendar-wrapper">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 600 }}
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    dayPropGetter={dayPropGetter}
                    messages={{ next: "다음", previous: "이전", today: "오늘", month: "월", week: "주", day: "일" }}
                    onNavigate={(date) => setCurrentDate(date)}
                />
            </div>

            <div className="monthly-events-list">
                <h3>{moment(currentDate).format('YYYY년 M월')} 일정 목록</h3>
                {monthlyEvents.length > 0 ? (
                    monthlyEvents.map(event => (
                        <div key={event.id} className="event-list-item">
                            <div className="event-date">{moment(event.start).format('D일 (ddd)')}</div>
                            <div className="event-title">{event.title}</div>
                            <div className="event-time">{moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}</div>
                        </div>
                    ))
                ) : (
                    <p>이번 달에는 등록된 일정이 없습니다.</p>
                )}
            </div>

            {/* 생성/수정 모달 */}
            <Modal isOpen={isFormModalOpen} onClose={closeFormModal}>
                <EventForm
                    onSubmit={handleFormSubmit}
                    initialData={editingEvent ? editingEvent : undefined}
                />
            </Modal>

            {/* 상세 보기 모달 */}
            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
                {selectedEvent && (
                    <EventDetail
                        event={selectedEvent}
                        currentUser={{ id: CURRENT_USER_ID }}
                        onEdit={handleEditEvent}
                        onDelete={handleDeleteEvent}
                    />
                )}
            </Modal>
        </div>
    );
};

export default Schedule;