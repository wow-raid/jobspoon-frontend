import React, { useState } from "react";
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
    studyLevel: string; // level -> studyLevel
    maxMembers: number;
    recruitingRoles: string[]; // roles -> recruitingRoles
    skillStack: string[]; // tags -> skillStack
}

interface CreateStudyFormProps {
    onSuccess: (newStudy: StudyRoom) => void;
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
const CreateStudyForm: React.FC<CreateStudyFormProps> = ({onSuccess}) => {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        location: LOCATION_OPTIONS[0]?.value ?? "", // 👈 .value로 정확히 초기값 설정
        studyLevel: LEVEL_OPTIONS[0] ?? "", // studyLevel 초기값 설정
        maxMembers: 2,
        recruitingRoles: [],
        skillStack: [],
    });
    const [rolesError, setRolesError] = useState<string | null>(null);

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

        const selectedLocationObject = LOCATION_OPTIONS.find(opt => opt.label === formData.location);

        const apiRequestData = {
            title: formData.title,
            description: formData.description,
            maxMembers: formData.maxMembers,
            location: selectedLocationObject?.value || 'ONLINE', // 찾은 객체의 value를 사용
            studyLevel: formData.studyLevel.toUpperCase(),
            recruitingRoles: formData.recruitingRoles,
            skillStack: formData.skillStack,
        };

        try {
            const response = await axiosInstance.post('/study-rooms', apiRequestData);

            if (response.status === 201) { // 생성 성공 확인
                // 👇 백엔드 응답 대신, 우리가 보낸 데이터를 기반으로 새 스터디 객체를 만듭니다.
                const newStudy: StudyRoom = {
                    ...formData,
                    id: Date.now(), // 임시 ID, 실제로는 Location 헤더에서 파싱해야 함
                    status: 'RECRUITING',
                    createdAt: new Date().toISOString(),
                    // host, currentMembers 등은 목록 조회 시 받아오므로 여기서 필요 X
                };

                onSuccess(newStudy); // 리스트 업데이트 및 모달 닫기
                alert("스터디 모임이 성공적으로 생성되었습니다.");
            }
        } catch (error) {
            console.error("스터디모임 생성에 실패했습니다:", error);
            alert("스터디모임 생성 중 오류가 발생했습니다.");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Title>새 스터디 생성</Title>

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
                <SubmitBtn type="submit">생성하기</SubmitBtn>
            </Actions>
        </Form>
    );
};

export default CreateStudyForm;
