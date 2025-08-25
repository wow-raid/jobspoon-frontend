// Schedule.tsx
import React, { useMemo, useState, useCallback } from "react";
import styled from "styled-components";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { FAKE_EVENTS, ScheduleEvent } from "../../data/mockData";
import Modal from "../Modal";
import EventForm from "./EventForm";
import EventDetail from "./EventDetail";

moment.locale("ko");
const localizer = momentLocalizer(moment);

// 현재 로그인한 사용자를 가정합니다.
const CURRENT_USER_ID = "모임장";

/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #fff;
  }
`;

const AddEventBtn = styled.button`
  background-color: #5865f2;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

const CalendarWrapper = styled.div`
  background-color: #1e2129;
  padding: 16px;
  border-radius: 8px;
  color: #d1d5db;

  /* ─ react-big-calendar overrides (scoped) ─ */
  .rbc-toolbar {
    margin-bottom: 16px;
  }
  .rbc-toolbar button {
    background-color: #3a3f4c;
    border: 1px solid #4a5568;
    color: #e0e0e0;
  }
  .rbc-toolbar button:hover,
  .rbc-toolbar button:focus {
    background-color: #4b5563;
  }
  .rbc-toolbar button.rbc-active {
    background-color: #5865f2;
  }

  .rbc-header {
    border-bottom: 1px solid #3e414f;
    padding: 8px 0;
  }

  .rbc-day-bg {
    border-left: 1px solid #3e414f;
  }

  /* ✅ dayPropGetter에서 주는 클래스명 */
  .rbc-day-bg.selected-day {
    background-color: rgba(88, 101, 242, 0.2);
  }
  /* 혹시 내부 선택 스타일을 쓸 때를 대비 */
  .rbc-day-bg.selected-slot {
    background-color: rgba(88, 101, 242, 0.2);
  }

  .rbc-month-view {
    border: 1px solid #3e414f;
  }
  .rbc-month-row {
    border-top: 1px solid #3e414f;
  }
  .rbc-today {
    background-color: rgba(88, 101, 242, 0.1);
  }
  .rbc-event {
    background-color: #5865f2;
    border: none;
    border-radius: 4px;
  }
`;

const StyledCalendar = styled(Calendar as any)`
  height: 600px;
`;

const MonthlyList = styled.div`
  margin-top: 32px;

  h3 {
    font-size: 18px;
    margin-bottom: 16px;
    border-left: 3px solid #5865f2;
    padding-left: 8px;
    color: #fff;
  }

  p {
    margin: 0;
    color: #d1d5db;
  }
`;

const MonthlyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #1e2129;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 8px;
`;
const MonthlyDate = styled.div`
  font-weight: bold;
  color: #a0a0a0;
  width: 80px;
`;
const MonthlyTitle = styled.div`
  flex-grow: 1;
  font-weight: 500;
  color: #e5e7eb;
`;
const MonthlyTime = styled.div`
  font-size: 13px;
  color: #8c92a7;
`;

const Schedule: React.FC = () => {
    const [events, setEvents] = useState<ScheduleEvent[]>(FAKE_EVENTS);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
    const [editingEvent, setEditingEvent] = useState<ScheduleEvent | null>(null);

    const handleSelectSlot = (slotInfo: { start: Date; action: "select" | "click" | "doubleClick" }) => {
        if (slotInfo.action === "doubleClick") {
            openFormModal(slotInfo.start);
        } else {
            setSelectedDate(slotInfo.start);
        }
    };

    const handleSelectEvent = (event: ScheduleEvent) => {
        setSelectedEvent(event);
        setIsDetailModalOpen(true);
    };

    const handleFormSubmit = (eventData: Omit<ScheduleEvent, "id" | "authorId">) => {
        if (editingEvent) {
            setEvents(prev => prev.map(e => (e.id === editingEvent.id ? { ...editingEvent, ...eventData } : e)));
        } else {
            const newEvent: ScheduleEvent = { id: Date.now(), authorId: CURRENT_USER_ID, ...eventData };
            setEvents(prev => [...prev, newEvent]);
        }
        closeFormModal();
    };

    const handleDeleteEvent = () => {
        if (!selectedEvent) return;
        if (window.confirm("정말로 일정을 삭제하시겠습니까?")) {
            setEvents(prev => prev.filter(e => e.id !== selectedEvent.id));
            setIsDetailModalOpen(false);
        }
    };

    const handleEditEvent = () => {
        if (!selectedEvent) return;
        setEditingEvent(selectedEvent);
        setIsDetailModalOpen(false);
        setIsFormModalOpen(true);
    };

    const openFormModal = (date?: Date) => {
        setEditingEvent(null);
        setSelectedDate(date || new Date());
        setIsFormModalOpen(true);
    };
    const closeFormModal = () => {
        setIsFormModalOpen(false);
        setEditingEvent(null);
    };

    const monthlyEvents = useMemo(
        () =>
            events
                .filter(event => moment(event.start).isSame(currentDate, "month"))
                .sort((a, b) => a.start.getTime() - b.start.getTime()),
        [events, currentDate]
    );

    const dayPropGetter = useCallback(
        (date: Date) => ({
            className: moment(date).isSame(selectedDate, "day") ? "selected-day" : "",
        }),
        [selectedDate]
    );

    return (
        <Container>
            <Header>
                <h2>🗓️ 일정관리</h2>
                <AddEventBtn onClick={() => openFormModal()}>일정 등록</AddEventBtn>
            </Header>

            <CalendarWrapper>
                <StyledCalendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    selectable
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectEvent}
                    dayPropGetter={dayPropGetter}
                    messages={{ next: "다음", previous: "이전", today: "오늘", month: "월", week: "주", day: "일" }}
                    onNavigate={date => setCurrentDate(date)}
                />
            </CalendarWrapper>

            <MonthlyList>
                <h3>{moment(currentDate).format("YYYY년 M월")} 일정 목록</h3>
                {monthlyEvents.length > 0 ? (
                    monthlyEvents.map(event => (
                        <MonthlyItem key={event.id}>
                            <MonthlyDate>{moment(event.start).format("D일 (ddd)")}</MonthlyDate>
                            <MonthlyTitle>{event.title}</MonthlyTitle>
                            <MonthlyTime>
                                {moment(event.start).format("HH:mm")} - {moment(event.end).format("HH:mm")}
                            </MonthlyTime>
                        </MonthlyItem>
                    ))
                ) : (
                    <p>이번 달에는 등록된 일정이 없습니다.</p>
                )}
            </MonthlyList>

            <Modal isOpen={isFormModalOpen} onClose={closeFormModal}>
                <EventForm onSubmit={handleFormSubmit} initialData={editingEvent || undefined} />
            </Modal>

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
        </Container>
    );
};

export default Schedule;
