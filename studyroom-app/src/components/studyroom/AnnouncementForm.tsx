// AnnouncementForm.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface AnnouncementFormProps {
    onSubmit: (formData: { title: string; content: string }) => void;
    initialData?: { title: string; content: string };
    isEditing?: boolean;
}

/* ─ styled-components (scoped) ─ */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h3`
  text-align: center;
  font-size: 20px;
  margin: 0;
  color: ${({ theme }) => theme.fg};
`;

const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  color: ${({ theme }) => theme.fg};
`;

const TextInput = styled.input`
  padding: 10px;
  border-radius: 6px;
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

const TextArea = styled.textarea`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.fg};
  font-size: 14px;
  min-height: 160px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.accent ?? theme.primary};
    box-shadow: 0 0 0 2px rgba(88,101,242,0.35);
  }
`;

const SubmitBtn = styled.button`
  background-color: ${({ theme }) => theme.accent ?? theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover { background-color: ${({ theme }) => theme.accentHover ?? theme.primaryHover}; }
`;

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({ onSubmit, initialData, isEditing = false }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.content);
        } else {
            setTitle("");
            setContent("");
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }
        onSubmit({ title, content });
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Title>{isEditing ? '공지사항 수정' : '새 공지사항 작성'}</Title>

            <Group>
                <Label htmlFor="announcement-title">제목</Label>
                <TextInput
                    id="announcement-title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력해주세요."
                    required
                />
            </Group>

            <Group>
                <Label htmlFor="announcement-content">내용</Label>
                <TextArea
                    id="announcement-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="내용을 입력해주세요."
                    required
                />
            </Group>

            <SubmitBtn type="submit">{isEditing ? '수정하기' : '등록하기'}</SubmitBtn>
        </Form>
    );
};

export default AnnouncementForm;
