import React, { useState } from "react";
import styled from "styled-components";
import FormField from "./FormField";
import TagInput from "./TagInput";
import { REGIONS, DEV_JOBS, SKILL } from "../types/filter";

// 옵션 상수
const JOB_OPTIONS = DEV_JOBS;
const REGION_OPTIONS = REGIONS;

interface FormData {
    title: string;
    description: string;
    category: string;
    job: string;
    location: string;
    maxMembers: number;
    roles: string[];
    requirements: string;
    tags: string[];
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
const CreateStudyForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        category: "프로그래밍",
        job: JOB_OPTIONS[0] ?? "",
        location: REGION_OPTIONS[0] ?? "",
        maxMembers: 2,
        roles: [],
        requirements: "",
        tags: [],
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

    const handleTagsChange = (fieldName: "roles" | "tags", newTags: string[]) => {
        setFormData((prev) => ({ ...prev, [fieldName]: newTags }));
        if (fieldName === "roles" && newTags.length > 0) setRolesError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.roles.length === 0) {
            setRolesError("모집 직무를 1개 이상 선택해주세요.");
            return;
        }
        setRolesError(null);

        const submissionData = {
            ...formData,
        };
        console.log(submissionData);
        alert("스터디가 생성되었습니다!");
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
                        value={formData.location}
                        onChange={handleChange}
                        as="select"
                        options={REGION_OPTIONS}
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
                    selectedTags={formData.roles}
                    onTagsChange={(newTags) => handleTagsChange("roles", newTags)}
                />
                {rolesError && <ErrorMessage>{rolesError}</ErrorMessage>}
            </Section>

            <Section>
                <SectionTitle>선택 정보</SectionTitle>

                <FormField
                    id="requirements"
                    name="requirements"
                    label="요구 조건"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="쉼표(,)로 구분하여 입력"
                />

                <TagInput
                    label="기술 스택"
                    availableTags={SKILL}
                    selectedTags={formData.tags}
                    onTagsChange={(newTags) => handleTagsChange("tags", newTags)}
                />
            </Section>

            <Actions>
                <SubmitBtn type="submit">생성하기</SubmitBtn>
            </Actions>
        </Form>
    );
};

export default CreateStudyForm;
