// LinkEditForm.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface LinkEditFormProps {
    channelName: string;
    initialUrl: string;
    onSubmit: (newUrl: string) => void;
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
  font-weight: 500;
  color: #d1d5db;
`;

const Input = styled.input`
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #4a5568;
  background-color: #1f2937;
  color: #ffffff;
  font-size: 14px;

  &::placeholder {
    color: #9aa3b2;
  }

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

const LinkEditForm: React.FC<LinkEditFormProps> = ({ channelName, initialUrl, onSubmit }) => {
    const [url, setUrl] = useState("");

    useEffect(() => {
        setUrl(initialUrl);
    }, [initialUrl]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(url);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h3>{channelName} 링크 수정</h3>

            <Group className="form-group">
                <Label htmlFor="channel-url">URL</Label>
                <Input
                    id="channel-url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://..."
                    required
                />
            </Group>

            <SubmitBtn type="submit">저장하기</SubmitBtn>
        </Form>
    );
};

export default LinkEditForm;
