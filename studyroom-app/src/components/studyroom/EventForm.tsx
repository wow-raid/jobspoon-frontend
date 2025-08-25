// EventForm.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ScheduleEvent } from "../../data/mockData.ts";

interface EventFormProps {
    onSubmit: (eventData: Omit<ScheduleEvent, "id" | "authorId">) => void;
    initialData?: ScheduleEvent; // 날짜를 더블클릭 했을 때 전달받을 초기 날짜
}

/* ─ styled-components (scoped) ─ */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;

  h3 {
    text-align: center;
    margin: 0 0 10px 0;
    color: #fff;
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
  color: #d1d5db;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #4a5568;
  background-color: #1f2937;
  color: #ffffff;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #5865f2;
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.35);
  }
`;

const SubmitBtn = styled.button`
  margin-top: 10px;
  padding: 10px;
  background-color: #5865f2;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    filter: brightness(0.95);
  }
`;

const EventForm: React.FC<EventFormProps> = ({ onSubmit, initialData }) => {
    const [title, setTitle] = useState("");
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setStart(initialData.start);
            setEnd(initialData.end);
        } else {
            setTitle("");
            setStart(null);
            setEnd(null);
        }
    }, [initialData]);

    const toLocalInputValue = (d: Date) => {
        // datetime-local은 로컬 기준 문자열(YYYY-MM-DDTHH:mm)이 필요
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
        return local.toISOString().slice(0, 16);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !start || !end) {
            alert("모든 필드를 입력해주세요.");
            return;
        }
        onSubmit({ title, start, end });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3>{initialData ? "일정 수정" : "새 일정 등록"}</h3>

            <Group className="form-group">
                <Label>일정 등록</Label>
                <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Group>

            <Group className="form-group">
                <Label>시작 시간</Label>
                <Input
                    type="datetime-local"
                    value={start ? toLocalInputValue(start) : ""}
                    onChange={(e) => setStart(new Date(e.target.value))}
                    required
                />
            </Group>

            <Group className="form-group">
                <Label>종료 시간</Label>
                <Input
                    type="datetime-local"
                    value={end ? toLocalInputValue(end) : ""}
                    onChange={(e) => setEnd(new Date(e.target.value))}
                    required
                />
            </Group>

            <SubmitBtn type="submit">
                {initialData ? "수정 완료" : "등록하기"}
            </SubmitBtn>
        </Form>
    );
};

export default EventForm;
