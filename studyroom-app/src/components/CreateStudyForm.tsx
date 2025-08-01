import React, { useState } from 'react';
import FormField from "./FormField";
import TagInput from "./TagInput";
import {REGIONS, DEV_JOBS, SKILL} from "../types/filter";
import '../styles/CreateStudyForm.css';

const JOB_OPTIONS = DEV_JOBS;
const REGION_OPTIONS = REGIONS;

interface FormData {
    title: string;
    description: string;
    category: string;
    location: string;
    maxMembers: number;
    roles: string[];
    requirements: string;
    tags: string[];
}

const CreateStudyForm: React.FC = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '프로그래밍',
        job: 'JOB_OPTIONS[0]',
        location: 'REGION_OPTIONS[0]',
        maxMembers: 2,
        roles: [],
        requirements: '',
        tags: [],
    });

    const [rolesError, setRolesError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'maxMembers' ? parseInt(value, 10) : value,
        }));
    };

    const handleTagsChange = (fieldName: 'roles' | 'tags', newTags: string[]) => {
        setFormData(prev => ({ ...prev, [fieldName]: newTags }));
        if (fieldName === 'roles' && newTags.length > 0) {
            setRolesError(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if( formData.roles.length === 0 ){
            setRolesError('모집 직무를 1개 이상 선택해주세요.');
            return;
        }

        setRolesError(null);

        const submissionData = {
        };
        console.log(submissionData);
        alert('스터디가 생성되었습니다!');
    };

    return (
        <form onSubmit={handleSubmit} className="create-study-form">
            <h2 className="form-title">새 스터디 생성</h2>

            <div className="form-section">
                <h3 className="form-section-title">필수 정보</h3>
                <FormField id="title"
                           name="title"
                           label="스터디 제목"
                           value={formData.title}
                           onChange={handleChange}
                           required />
                <FormField id="description"
                           name="description"
                           label="스터디 설명"
                           value={formData.description}
                           onChange={handleChange}
                           as="textarea"
                           rows={5}
                           required />
                <div className="form-row">
                    <FormField id="location"
                               name="location"
                               label="지역"
                               value={formData.location}
                               onChange={handleChange}
                               as="select"
                               options={REGION_OPTIONS} />
                    <FormField id="maxMembers"
                               name="maxMembers"
                               label="최대 인원"
                               placeholder="최소 2인이상"
                               value={formData.maxMembers}
                               onChange={handleChange}
                               type="number" min="2" max="16" required />
                </div>
                <TagInput
                    label="모집 직무"
                    availableTags={DEV_JOBS}
                    selectedTags={formData.roles}
                    onTagsChange={(newTags) => handleTagsChange('roles', newTags)} />
                {rolesError && <p className="error-message">{rolesError}</p>}
            </div>
            <div className="form-section">
                <h3 className="form-section-title">선택 정보</h3>
                <FormField id="requirements"
                           name="requirements"
                           label="요구 조건"
                           value={formData.requirements}
                           onChange={handleChange}
                           placeholder="쉼표(,)로 구분하여 입력" />
                <TagInput
                    label="기술 스택"
                    availableTags={SKILL}
                    selectedTags={formData.tags}
                    onTagsChange={(newTags) => handleTagsChange('tags', newTags)}
                />
            </div>

            <div className="form-actions">
                <button type="submit" className="submit-btn">생성하기</button>
            </div>
        </form>
    );
};

export default CreateStudyForm;