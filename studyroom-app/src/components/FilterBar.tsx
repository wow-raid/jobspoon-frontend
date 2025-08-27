// FilterBar.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {LOCATION, DEV_JOBS} from "../types/filter";

export interface FilterValues {
    searchTerm: string;
    location: string;
    job: string;
    showRecruitingOnly: boolean;
}

interface FilterBarProps {
    onFilterChange: (filters: FilterValues) => void;
}

/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  background-color: #2c2f3b;
  padding: 16px;
  border-radius: 8px;
`;

const BaseField = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #4a4e59;
  background-color: #1e2129;
  color: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: #9aa3b2;
  }

  &:focus {
    outline: none;
    border-color: #5865f2;
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.35);
  }
`;

const SearchInput = styled(BaseField)`
  flex-grow: 1;
  min-width: 200px;
`;

const Select = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #4a4e59;
  background-color: #1e2129;
  color: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #5865f2;
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.35);
  }
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  accent-color: #5865f2; /* 지원 브라우저에서 포인트 컬러 */
`;

/* ─ Component ─ */
const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [location, setLocation] = useState("전체");
    const [job, setJob] = useState("전체");
    const [showRecruitingOnly, setShowRecruitingOnly] = useState(false);

    useEffect(() => {
        onFilterChange({ searchTerm, location, job, showRecruitingOnly });
    }, [searchTerm, location, job, showRecruitingOnly, onFilterChange]);

    return (
        <Container>
            <SearchInput
                type="text"
                placeholder="스터디 제목으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="스터디 제목 검색"
            />

            <Select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="지역 선택"
            >
                {LOCATION.map((region) => (
                    <option key={region.value} value={region.value}>
                        {region.value === "전체" ? "지역 (전체)" : region.label}
                    </option>
                ))}
            </Select>

            <Select value={job}
                    onChange={(e) => setJob(e.target.value)}
                    aria-label="직군 선택"
            >
                {DEV_JOBS.map((job) => (
                    <option key={job} value={job}>
                        {job}
                    </option>
                ))}
            </Select>

            <CheckboxLabel>
                <Checkbox
                    checked={showRecruitingOnly}
                    onChange={(e) => setShowRecruitingOnly(e.target.checked)}
                />
                모집 중인 스터디만 보기
            </CheckboxLabel>
        </Container>
    );
};

export default FilterBar;
