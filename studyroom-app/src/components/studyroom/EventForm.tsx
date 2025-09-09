import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Schedule} from "../../types/study";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface EventFormProps {
    onSubmit: (eventData: { title: string; description: string; start: Date; end: Date; }) => void;
    initialData?: Schedule;
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h3 {
    text-align: center;
    margin: 0 0 10px 0;
    color: ${({ theme }) => theme.fg};
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.fg};
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.fg};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent ?? theme.primary};
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.35);
  }
`;

const SubmitBtn = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: ${({ theme }) => theme.accent ?? theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.accentHover ?? theme.primaryHover};
  }
`;

const TextArea = styled.textarea`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.fg};
  font-size: 14px;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent ?? theme.primary};
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.35);
  }
`;

// 추가
const StyledDatePicker = styled(DatePicker)`
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.fg};
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent ?? theme.primary};
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.35);
  }
`;

// 추가
const GlobalDatePickerStyle = styled.div`
  .react-datepicker {
    font-family: 'Pretendard', sans-serif; /* 폰트 설정 */
    background-color: ${({ theme }) => theme.surface}; /* 배경색 */
    border: 1px solid ${({ theme }) => theme.border}; /* 테두리 */
    color: ${({ theme }) => theme.fg}; /* 기본 글자색 */
    border-radius: 8px;
    overflow: hidden; /* 모서리 부드럽게 처리 */
  }

  .react-datepicker__header {
    background-color: ${({ theme }) => theme.surfaceHover}; /* 헤더 배경 */
    border-bottom: 1px solid ${({ theme }) => theme.border};
    color: ${({ theme }) => theme.fg};
  }

  .react-datepicker__current-month,
  .react-datepicker__day-name,
  .react-datepicker__time-name {
    color: ${({ theme }) => theme.fg};
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--keyboard-selected {
    background-color: ${({ theme }) => theme.accent ?? theme.primary}; /* 선택된 날짜 */
    color: #fff;
  }

  .react-datepicker__day--today {
    background-color: ${({ theme }) => `${(theme.accent ?? theme.primary)}1A`}; /* 오늘 날짜 */
    color: ${({ theme }) => theme.fg};
  }

  .react-datepicker__day--highlighted {
    background-color: ${({ theme }) => theme.accent ?? theme.primary};
    color: #fff;
  }

  .react-datepicker__day--outside-month {
    color: ${({ theme }) => theme.subtle}; /* 다른 달 날짜 */
  }

  .react-datepicker__navigation--previous,
  .react-datepicker__navigation--next {
    border-color: ${({ theme }) => theme.fg}; /* 이전/다음 버튼 화살표 색상 */
  }

  .react-datepicker__triangle {
    border-bottom-color: ${({ theme }) => theme.surface} !important; /* 팝업 위 삼각형 */
  }

  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::before,
  .react-datepicker-popper[data-placement^="bottom"] .react-datepicker__triangle::after {
    border-bottom-color: ${({ theme }) => theme.border} !important; /* 삼각형 테두리 */
  }

  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item--selected {
    background-color: ${({ theme }) => theme.accent ?? theme.primary}; /* 선택된 시간 */
    color: #fff;
  }

  .react-datepicker__time-container .react-datepicker__time .react-datepicker__time-box ul.react-datepicker__time-list li.react-datepicker__time-list-item:hover {
    background-color: ${({ theme }) => theme.surfaceHover}; /* 시간 hover */
    color: ${({ theme }) => theme.fg};
  }
`;

const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("")
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description || "")
            setStart(new Date(initialData.startTime));
            setEnd(new Date(initialData.endTime));
        } else {
            setTitle("");
            setDescription("");
            setStart(null);
            setEnd(null);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !start || !end) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
        onSubmit({ title, description, start: start, end: end });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3>{initialData ? "일정 수정" : "새 일정 등록"}</h3>

            <Group>
                <Label>일정 제목</Label>
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Group>

            <Group>
                <Label>설명 (선택)</Label>
                <TextArea value={description} onChange={(e) => setDescription(e.target.value)} />
            </Group>

            <Group>
                <Label>시작 시간</Label>
                <StyledDatePicker
                    selected={start}
                    onChange={(date: Date) => setStart(date)}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                    locale="ko"
                    calendarContainer={GlobalDatePickerStyle}
                />
            </Group>

            <Group>
                <Label>종료 시간</Label>
                <StyledDatePicker
                    selected={end}
                    onChange={(date: Date) => setEnd(date)}
                    showTimeSelect
                    dateFormat="yyyy-MM-dd HH:mm"
                    locale="ko"
                    minDate={start}
                    calendarContainer={GlobalDatePickerStyle}
                />
            </Group>

            <SubmitBtn type="submit">
                {initialData ? "수정 완료" : "등록하기"}
            </SubmitBtn>
        </Form>
    );
};

export default EventForm;
