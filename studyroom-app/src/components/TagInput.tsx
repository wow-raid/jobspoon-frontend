// TagInput.tsx
import React from "react";
import styled from "styled-components";

interface TagInputProps {
    label: string;
    availableTags: string[];
    selectedTags: string[];
    onTagsChange: (newTags: string[]) => void;
}

/* ─ styled-components (scoped) ─ */
const Group = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 600;
  font-size: 14px;
  color: #d1d5db;
`;

const SelectedContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #4a5568;
  background-color: #1f2937;
  min-height: 40px;
  align-items: center;
`;

const Placeholder = styled.span`
  color: #6b7280;
  font-size: 14px;
`;

const AvailableContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const BaseChip = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 13px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease;
`;

const SelectedChip = styled(BaseChip)`
  background-color: #4f46e5;
  color: #ffffff;
`;

const RemoveIcon = styled.span`
  margin-left: 6px;
  font-weight: bold;
`;

const AvailableChip = styled(BaseChip) <{ $active?: boolean }>`
  background-color: ${({ $active }) => ($active ? "#1f2937" : "#374151")};
  color: ${({ $active }) => ($active ? "#6b7280" : "#d1d5db")};
  pointer-events: ${({ $active }) => ($active ? "none" : "auto")};
  cursor: ${({ $active }) => ($active ? "default" : "pointer")};

  &:hover {
    background-color: ${({ $active }) => ($active ? "#1f2937" : "#4b5563")};
  }
`;

/* ─ Component ─ */
const TagInput: React.FC<TagInputProps> = ({
    label,
    availableTags,
    selectedTags,
    onTagsChange,
}) => {
    const toggleTag = (tag: string) => {
        const next = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag];
        onTagsChange(next);
    };

    const onChipKeyDown: React.KeyboardEventHandler<HTMLSpanElement> = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            (e.target as HTMLSpanElement).click();
        }
    };

    return (
        <Group>
            <Label>{label}</Label>

            <SelectedContainer>
                {selectedTags.length > 0 ? (
                    selectedTags.map((tag) => (
                        <SelectedChip
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            role="button"
                            tabIndex={0}
                            aria-pressed="true"
                            onKeyDown={onChipKeyDown}
                        >
                            {tag}
                            <RemoveIcon aria-hidden>&times;</RemoveIcon>
                        </SelectedChip>
                    ))
                ) : (
                    <Placeholder>아래에서 선택해주세요.</Placeholder>
                )}
            </SelectedContainer>

            <AvailableContainer>
                {availableTags.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                        <AvailableChip
                            key={tag}
                            $active={active}
                            onClick={() => !active && toggleTag(tag)}
                            role="button"
                            tabIndex={active ? -1 : 0}
                            aria-pressed={active}
                            aria-disabled={active}
                            onKeyDown={!active ? onChipKeyDown : undefined}
                        >
                            {tag}
                        </AvailableChip>
                    );
                })}
            </AvailableContainer>
        </Group>
    );
};

export default TagInput;
