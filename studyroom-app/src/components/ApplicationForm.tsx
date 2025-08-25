// ApplicationForm.tsx
import React, { useState } from "react";
import styled from "styled-components";

interface ApplicationFormProps {
    studyTitle: string;
    onSubmit: (message: string) => void;
    onClose: () => void;
}

/* ─ styled-components (scoped) ─ */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h3`
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin: 0;
`;

const Description = styled.p`
  font-size: 14px;
  color: #d1d5db;
  text-align: center;
  margin: 0 0 8px 0;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px;
  border-radius: 6px;
  border: 1px solid #4a5568;
  background-color: #1f2937;
  color: #d1d5db;
  font-size: 14px;
  resize: vertical;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #5865f2;
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.25);
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const Btn = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
`;

const CancelBtn = styled(Btn)`
  background-color: #4a5568;
  color: #e5e7eb;

  &:hover {
    background-color: #3b4454;
  }
`;

const SubmitBtn = styled(Btn)`
  background-color: #5865f2;
  color: #ffffff;

  &:hover {
    background-color: #4752c4;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

/* ─ Component ─ */
const ApplicationForm: React.FC<ApplicationFormProps> = ({ studyTitle, onSubmit, onClose }) => {
    const [message, setMessage] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            alert("내용을 입력해주세요.");
            return;
        }
        onSubmit(message);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Title>'{studyTitle}' 참가 신청</Title>
            <Description>모임장에게 자신을 간략하게 소개하고, 스터디 참여 의지를 보여주세요.</Description>

            <TextArea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="예) 안녕하세요! React 실무 경험을 쌓고 싶어 지원합니다."
                rows={7}
                required
                aria-label="신청서 내용"
            />

            <Actions>
                <CancelBtn type="button" onClick={onClose}>
                    취소
                </CancelBtn>
                <SubmitBtn type="submit" disabled={!message.trim()}>
                    신청서 제출
                </SubmitBtn>
            </Actions>
        </Form>
    );
};

export default ApplicationForm;
