import React, {useMemo, useState, useCallback, useEffect} from "react";
import styled from "styled-components";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Modal from "../Modal";
import EventForm from "./EventForm";
import EventDetail from "./EventDetail";
import { useOutletContext } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Schedule } from "../../types/study"
import axiosInstance from "../../api/axiosInstance";

moment.locale("ko");
const localizer = momentLocalizer(moment);

interface ScheduleContext {
  studyId: string;
  userRole: "LEADER" | "MEMBER";
}

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
  cursor: pointer; /* ✅ 커서 모양 변경 */
  transition: background-color 0.2s; /* ✅ 부드러운 효과 */

  &:hover {
    background-color: ${({ theme }) => theme.surfaceHover}; /* ✅ 마우스 올렸을 때 배경색 변경 */
  }
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
  const { studyId, userRole } = useOutletContext<ScheduleContext>();
  const { currentUserId } = useAuth();

  const [events, setEvents] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<Schedule | null>(null);
  const [editingEvent, setEditingEvent] = useState<Schedule | null>(null);

  // ✅ [추가] 일정 목록을 불러오는 함수
  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/study-rooms/${studyId}/schedules`);
      const formattedEvents = response.data.map((event: any) => ({
        ...event,
        start: new Date(event.startTime),
        end: new Date(event.endTime),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("일정 목록을 불러오는데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  }, [studyId]);

  // ✅ [추가] 컴포넌트가 처음 렌더링될 때 일정 목록을 불러옴
  useEffect(() => {
    if (studyId) {
      fetchSchedules();
    }
  }, [studyId, fetchSchedules]);

  const handleSelectEvent = (event: Schedule) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  };

  const handleSelectSlot = (slotInfo: { start: Date; action: "select" | "click" | "doubleClick" }) => {
    if (slotInfo.action === "doubleClick") {
      openFormModal(slotInfo.start);
    } else {
      setSelectedDate(slotInfo.start);
    }
  };

  // ✅ [수정] 일정 생성/수정 함수
  const handleFormSubmit = async (eventData: { title: string; description: string; start: Date; end: Date }) => {
    const requestData = {
      title: eventData.title,
      description: eventData.description,
      startTime: eventData.start.toISOString(), // 서버가 인식할 수 있는 ISO 문자열로 변환
      endTime: eventData.end.toISOString(),
    };

    try {
      if (editingEvent) {
        await axiosInstance.put(`/study-rooms/${studyId}/schedules/${editingEvent.id}`, requestData);
        alert("일정이 성공적으로 수정되었습니다."); // 메시지 변경
      } else {
        // 생성 로직
        await axiosInstance.post(`/study-rooms/${studyId}/schedules`, requestData);
        alert("일정이 성공적으로 등록되었습니다.");
      }
      closeFormModal();
      fetchSchedules();
    } catch (error) {
      console.error("일정 저장에 실패했습니다:", error);
      alert("일정 저장 중 오류가 발생했습니다.");
    }
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

  const openFormModal = () => {
    setEditingEvent(null);
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

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Container>
      <Header>
        <h2>🗓️ 일정관리</h2>
        {(userRole === "LEADER" || userRole === "MEMBER") && (
            <AddEventBtn onClick={openFormModal}>일정 등록</AddEventBtn>
        )}
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
                <MonthlyItem
                    key={event.id}
                    onClick={() => handleSelectEvent(event)} // ✅ onClick 이벤트 추가
                >
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
                currentUser={{ id: currentUserId, role: userRole }}
                onEdit={handleEditEvent}
                onDelete={handleDeleteEvent}
            />
        )}
      </Modal>
    </Container>
  );
};

export default Schedule;
