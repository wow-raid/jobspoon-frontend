import React, { useState, useEffect } from 'react';
import { REGIONS, DEV_JOBS } from "../types/filter";
import '../styles/FilterBar.css';

export interface FilterValues {
    searchTerm: string;
    location: string;
    job: string;
    showRecruitingOnly: boolean;
}

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