import React, { useState, useEffect } from 'react';
import '../styles/FilterBar.css';

export interface FilterValues {
    searchTerm: string;
    location: string;
    job: string;
    showRecruitingOnly: boolean;
}

const REGIONS = [
    '전체', '온라인', '서울', '경기', '인천', '강원',
    '충북', '충남', '대전', '세종', '전북', '전남', '광주',
    '경북', '경남', '대구', '울산', '부산', '제주'
];

const DEV_JOBS = [
    '전체', '프론트엔드', '백엔드', '풀스택', '모바일', 'iOS',
    '안드로이드', 'AI/ML', '데이터', 'DevOps', 'QA', '보안', 'PM', '디자이너'
];

interface FilterBarProps {
    onFilterChange: (filters: FilterValues) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('전체');
    const [job, setJob] = useState('전체');
    const [showRecruitingOnly, setShowRecruitingOnly] = useState(false);

    useEffect(() => {
        onFilterChange({ searchTerm, location, job, showRecruitingOnly });
    }, [searchTerm, location, job, showRecruitingOnly, onFilterChange]);

    return (
        <div className="filter-container">
            <input
                type="text"
                placeholder="스터디 제목으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <select value={location} onChange={(e) => setLocation(e.target.value)}>
                {REGIONS.map(region => (
                    <option key={region} value={region}>
                        {region === '전체' ? '지역 (전체)' : region}
                    </option>
                ))}
            </select>

            <select value={job} onChange={(e) => setJob(e.target.value)}>
                {DEV_JOBS.map(jobTitle => (
                    <option key={jobTitle} value={jobTitle}>
                        {jobTitle === '전체' ? '직무 (전체)' : jobTitle}
                    </option>
                ))}
            </select>

            <label className="checkbox-label">
                <input
                    type="checkbox"
                    checked={showRecruitingOnly}
                    onChange={(e) => setShowRecruitingOnly(e.target.checked)}
                />
                모집 중인 스터디만 보기
            </label>
        </div>
    );
};

export default FilterBar;