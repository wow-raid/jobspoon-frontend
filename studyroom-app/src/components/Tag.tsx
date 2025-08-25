// Tag.tsx
import React from "react";
import styled from "styled-components";

interface TagProps {
    text: string;
    className?: string; // 필요한 경우 외부에서 추가 스타일 덧입히기용
}

const Chip = styled.span`
  display: inline-block;
  background-color: #3e414f;
  color: #d1d5db;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const Tag: React.FC<TagProps> = ({ text, className }) => {
    return <Chip className={className}>{text}</Chip>;
};

export default Tag;
