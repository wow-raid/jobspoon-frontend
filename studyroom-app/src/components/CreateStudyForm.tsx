//CreateStudyForm.tsx
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import FormField from "./FormField";
import TagInput from "./TagInput";
import { LOCATION, DEV_JOBS, SKILL, STUDY_LEVELS } from "../types/filter";
import {StudyRoom} from "../types/study.ts";
import axiosInstance from "../api/axiosInstance";

// 옵션 상수
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
    initialData?: StudyRoom | null; // 👈 수정할 데이터를 받을 prop 추가
}

/* ───────────────── styled-components ───────────────── */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
  padding-right: 10px;

  /* FormField 내부에서 쓰는 .form-group 스코프 처리 */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .form-group label {
    font-weight: 600;
    color: #d1d5db;
    font-size: 14px;
  }
  .form-group input,
  .form-group textarea,
  .form-group select {
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #4a5568;
    background-color: #1f2937;
    color: #d1d5db;
    font-size: 14px;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .form-group input:focus,
  .form-group textarea:focus,
  .form-group select:focus {
    outline: none;
    border-color: #5865f2;
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.4);
  }
`;

const Title = styled.h2`
  text-align: center;
  color: #ffffff;
  font-size: 20px;
  margin: 0 0 10px 0;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-top: 1px solid #3e414f;
  padding-top: 20px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #a0a0a0;
  margin: 0;
`;

const Row = styled.div`
  display: flex;
  gap: 16px;

  /* 내부 FormField의 .form-group이 양쪽 칸을 채우도록 */
  .form-group {
    flex: 1;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: center;
`;

const SubmitBtn = styled.button`
  background-color: #5865f2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 24px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 13px;
  margin: -8px 0 0 4px;
`;

/* ───────────────── Component ───────────────── */
const CreateStudyForm: React.FC<CreateStudyFormProps> = ({
              onSuccess,
              isEditMode = false,
              initialData
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

    // 👇 1. 수정 모드일 때 폼 데이터를 initialData로 채우는 로직 추가
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
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
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
                // --- 수정 모드 ---
                if (!initialData?.id) {
                    alert("수정할 스터디 정보가 올바르지 않습니다.");
                    return;
                }
                const response = await axiosInstance.put(`/study-rooms/${initialData.id}`, apiRequestData);

                // PUT 요청은 보통 200 OK를 반환합니다.
                if (response.status === 200) {
                    onSuccess(response.data);
                }
            } else {
                // --- 생성 모드 ---
                const response = await axiosInstance.post('/study-rooms', apiRequestData);

                // POST 요청은 201 Created를 반환합니다.
                if (response.status === 201) {
                    onSuccess(response.data);
                }
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

                <FormField
                    id="title"
                    name="title"
                    label="스터디 제목"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <FormField
                    id="description"
                    name="description"
                    label="스터디 설명"
                    value={formData.description}
                    onChange={handleChange}
                    as="textarea"
                    rows={5}
                    required
                />

                <Row>
                    <FormField
                        id="location"
                        name="location"
                        label="지역"
                        value={formData.location}  // <- value로 변경
                        onChange={handleChange}
                        as="select"
                        options={LOCATION_OPTIONS}
                    />

                    <FormField
                        id="studyLevel"
                        name="studyLevel"
                        label="경력 수준"
                        value={formData.studyLevel}
                        onChange={handleChange}
                        as="select"
                        options={LEVEL_OPTIONS}
                    />

                    <FormField
                        id="maxMembers"
                        name="maxMembers"
                        label="최대 인원"
                        placeholder="최소 2인이상"
                        value={formData.maxMembers}
                        onChange={handleChange}
                        type="number"
                        min="2"
                        max="16"
                        required
                    />
                </Row>

                <TagInput
                    label="모집 직무"
                    availableTags={DEV_JOBS}
                    selectedTags={formData.recruitingRoles}
                    onTagsChange={(newTags) => handleTagsChange("recruitingRoles", newTags)}
                />
                {rolesError && <ErrorMessage>{rolesError}</ErrorMessage>}
            </Section>

            <Section>
                <SectionTitle>선택 정보</SectionTitle>

                <TagInput
                    label="기술 스택"
                    availableTags={SKILL}
                    selectedTags={formData.skillStack}
                    onTagsChange={(newTags) => handleTagsChange("skillStack", newTags)}
                />
            </Section>

            <Actions>
                <SubmitBtn type="submit">{isEditMode ? '수정 완료' : '생성하기'}</SubmitBtn>
            </Actions>
        </Form>
    );
};

export default CreateStudyForm;
