// studyroom-app/src/components/CreateStudyForm.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FormField from "./FormField";
import TagInput from "./TagInput";
import { LOCATION, DEV_JOBS, SKILL, STUDY_LEVELS } from "../types/filter";
import { StudyRoom } from "../types/study.ts";
import axiosInstance from "../api/axiosInstance";

const JOB_OPTIONS = DEV_JOBS;
const LOCATION_OPTIONS = LOCATION;
const LEVEL_OPTIONS = STUDY_LEVELS;

interface FormData {
    title: string;
    description: string;
    location: string;
    studyLevel: string;
    maxMembers: number;
    recruitingRoles: string[];
    skillStack: string[];
}

interface CreateStudyFormProps {
    onSuccess: (studyData: StudyRoom) => void;
    isEditMode?: boolean;
    initialData?: StudyRoom | null;
}

/* ─ styled ─ */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding-right: 10px;

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .form-group label {
    font-weight: 600;
    color: ${({ theme }) => theme.subtle};
    font-size: 14px;
  }
  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 10px;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.inputBorder};
    background-color: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.fg};
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;

    &::placeholder { color: ${({ theme }) => theme.inputPlaceholder}; }
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.primary};
      box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.4);
    }
  }
`;

const Title = styled.h2`
  text-align: center;
  color: ${({ theme }) => theme.fg};
  font-size: 20px;
  margin: 0 0 10px 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
  padding-top: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.subtle};
  margin: 0;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;
  .form-group { flex: 1; }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
`;

const SubmitBtn = styled.button`
  background-color: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &:hover { background-color: ${({ theme }) => theme.primaryHover}; }
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 13px;
  margin: -8px 0 0 4px;
`;

/* ─ Component ─ */
const CreateStudyForm: React.FC<CreateStudyFormProps> = ({
    onSuccess, isEditMode = false, initialData
}) => {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        location: LOCATION_OPTIONS[0]?.value ?? "",
        studyLevel: LEVEL_OPTIONS[0] ?? "",
        maxMembers: 2,
        recruitingRoles: [],
        skillStack: [],
    });
    const [rolesError, setRolesError] = useState<string | null>(null);

    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description,
                location: initialData.location,
                studyLevel: initialData.studyLevel,
                maxMembers: initialData.maxMembers,
                recruitingRoles: initialData.recruitingRoles,
                skillStack: initialData.skillStack,
            });
        }
    }, [isEditMode, initialData]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "maxMembers" ? parseInt(value, 10) : value,
        }));
    };

    const handleTagsChange = (fieldName: "recruitingRoles" | "skillStack", newTags: string[]) => {
        setFormData((prev) => ({ ...prev, [fieldName]: newTags }));
        if (fieldName === "recruitingRoles" && newTags.length > 0) setRolesError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.recruitingRoles.length === 0) {
            setRolesError("모집 직무를 1개 이상 선택해주세요.");
            return;
        }
        setRolesError(null);

        const apiRequestData = {
            title: formData.title,
            description: formData.description,
            maxMembers: formData.maxMembers,
            location: formData.location.toUpperCase(),
            studyLevel: formData.studyLevel.toUpperCase(),
            recruitingRoles: formData.recruitingRoles,
            skillStack: formData.skillStack,
        };

        try {
            if (isEditMode) {
                // 수정모드
                if (!initialData?.id) { alert("수정할 스터디 정보가 올바르지 않습니다."); return; }
                const response = await axiosInstance.put(`/study-rooms/${initialData.id}`, apiRequestData);
                if (response.status === 200) onSuccess(response.data);
            } else {
                // 생성모드
                const response = await axiosInstance.post('/study-rooms', apiRequestData);
                if (response.status === 201) onSuccess(response.data);
            }
        } catch (error) {
            console.error("작업 처리 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다.");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Title>{isEditMode ? '스터디 정보 수정' : '새 스터디 생성'}</Title>
            <Section>
                <SectionTitle>필수 정보</SectionTitle>

                <FormField id="title" name="title" label="스터디 제목" value={formData.title} onChange={handleChange} required />

                <FormField
                    id="description" name="description" label="스터디 설명"
                    value={formData.description} onChange={handleChange}
                    as="textarea" rows={5} required
                />

                <Row>
                    <FormField
                        id="location" name="location" label="지역"
                        value={formData.location} onChange={handleChange}
                        as="select" options={LOCATION_OPTIONS}
                    />

                    <FormField
                        id="studyLevel" name="studyLevel" label="경력 수준"
                        value={formData.studyLevel} onChange={handleChange}
                        as="select" options={LEVEL_OPTIONS}
                    />

                    <FormField
                        id="maxMembers" name="maxMembers" label="최대 인원"
                        placeholder="최소 2인이상" value={formData.maxMembers}
                        onChange={handleChange} type="number" min="2" max="16" required
                    />
                </Row>

                <TagInput
                    label="모집 직무"
                    availableTags={JOB_OPTIONS}
                    selectedTags={formData.recruitingRoles}
                    onTagsChange={(tags) => handleTagsChange("recruitingRoles", tags)}
                />
                {rolesError && <ErrorMessage>{rolesError}</ErrorMessage>}
            </Section>

            <Section>
                <SectionTitle>선택 정보</SectionTitle>
                <TagInput
                    label="기술 스택"
                    availableTags={SKILL}
                    selectedTags={formData.skillStack}
                    onTagsChange={(tags) => handleTagsChange("skillStack", tags)}
                />
            </Section>

            <Actions><SubmitBtn type="submit">{isEditMode ? '수정 완료' : '생성하기'}</SubmitBtn></Actions>
        </Form>
    );
};

export default CreateStudyForm;
