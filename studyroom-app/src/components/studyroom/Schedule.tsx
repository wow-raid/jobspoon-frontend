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
    color: ${({ theme }) => theme.fg};
  }
`;

const AddEventBtn = styled.button`
  background-color: ${({ theme }) => theme.accent ?? theme.primary};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.accentHover ?? theme.primaryHover};
  }
`;

/* react-big-calendar 오버라이드 */
const CalendarWrapper = styled.div`
  background-color: ${({ theme }) => theme.surface};
  padding: 16px;
  border-radius: 8px;
  color: ${({ theme }) => theme.fg};

  .rbc-toolbar {
    margin-bottom: 16px;
    color: ${({ theme }) => theme.fg};
  }

  .rbc-toolbar button {
    background-color: ${({ theme }) => theme.surfaceHover};
    border: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.fg};
  }
  .rbc-toolbar button:hover,
  .rbc-toolbar button:focus {
    background-color: ${({ theme }) => theme.surface};
  }
  .rbc-toolbar button.rbc-active {
    background-color: ${({ theme }) => theme.accent ?? theme.primary};
    color: #fff;
  }

  .rbc-header {
    border-bottom: 1px solid ${({ theme }) => theme.border};
    padding: 8px 0;
    color: ${({ theme }) => theme.fg};
    background: transparent;
  }

  .rbc-day-bg {
    border-left: 1px solid ${({ theme }) => theme.border};
  }

  /* dayPropGetter에서 주는 클래스명 */
  .rbc-day-bg.selected-day {
    background-color: ${({ theme }) => `${(theme.accent ?? theme.primary)}33`}; /* ~20% */
  }
  .rbc-day-bg.selected-slot {
    background-color: ${({ theme }) => `${(theme.accent ?? theme.primary)}33`};
  }

  .rbc-month-view {
    border: 1px solid ${({ theme }) => theme.border};
    background: ${({ theme }) => theme.surface};
  }
  .rbc-month-row {
    border-top: 1px solid ${({ theme }) => theme.border};
  }
  .rbc-today {
    background-color: ${({ theme }) => `${(theme.accent ?? theme.primary)}1A`}; /* ~10% */
  }
  .rbc-off-range-bg {
    background: ${({ theme }) => theme.surfaceHover};
  }

  .rbc-event {
    background-color: ${({ theme }) => theme.accent ?? theme.primary};
    color: #fff;
    border: none;
    border-radius: 4px;
  }

  .rbc-time-content,
  .rbc-time-view,
  .rbc-timeslot-group {
    border-color: ${({ theme }) => theme.border};
  }
`;

const MonthlyList = styled.div`
  margin-top: 32px;

  h3 {
    font-size: 18px;
    margin-bottom: 16px;
    border-left: 3px solid ${({ theme }) => theme.accent ?? theme.primary};
    padding-left: 8px;
    color: ${({ theme }) => theme.fg};
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.fg};
  }
`;

const MonthlyItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 8px;
`;
const MonthlyDate = styled.div`
  font-weight: bold;
  color: ${({ theme }) => theme.subtle};
  width: 80px;
`;
const MonthlyTitle = styled.div`
  flex-grow: 1;
  font-weight: 500;
  color: ${({ theme }) => theme.fg};
`;
const MonthlyTime = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.subtle};
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
        <Calendar
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
          style={{ height: 600 }}
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
