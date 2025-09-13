// studyroom-app/src/components/FilterBar.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { LOCATION, DEV_JOBS } from "../types/filter";
import TabSearchBar from "./studyroom/TabSearchBar";

export interface FilterValues {
  searchTerm: string;
  location: string;
  job: string;
  showRecruitingOnly: boolean;
}

interface FilterBarProps {
    onFilterChange: (filters: FilterValues) => void;
    showRecruitingFilter?: boolean;
    searchPlaceholder?: string;
}

/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  background-color: ${({ theme }) => theme.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.border};
  padding: 16px;
  border-radius: 8px;
`;

const BaseField = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.fg};
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder { color: ${({ theme }) => theme.inputPlaceholder}; }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.35);
  }
`;

const Select = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  background-color: ${({ theme }) => theme.inputBg};
  color: ${({ theme }) => theme.fg};
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.35);
  }
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
  color: ${({ theme }) => theme.fg};
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  accent-color: ${({ theme }) => theme.primary};
`;

const FilterBar: React.FC<FilterBarProps> = ({
    onFilterChange,
    showRecruitingFilter = true,
    searchPlaceholder = "스터디 제목으로 검색",
}) => {
    // 👇 1. 상태를 하나의 객체로 통합하고, 모든 필드를 포함시킵니다.
    const [filters, setFilters] = useState<FilterValues>({
        searchTerm: "",
        location: "전체",
        job: "전체",
        showRecruitingOnly: false,
    });

    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

    const handleValueChange = (
        field: keyof FilterValues,
        value: string
    ) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

  return (
    <Container>
        <TabSearchBar
            searchTerm={filters.searchTerm}
            onSearchChange={(e) => handleValueChange("searchTerm", e.target.value)}
            placeholder={searchPlaceholder}
        />

        <Select
            value={filters.location}
            onChange={(e) => handleValueChange("location", e.target.value)}
            aria-label="지역 선택"
        >
        {LOCATION.map((region) => (
          <option key={region.value} value={region.value}>
            {region.value === "전체" ? "지역 (전체)" : region.label}
          </option>
        ))}
      </Select>

        <Select
            value={filters.job}
            onChange={(e) => handleValueChange("job", e.target.value)}
            aria-label="직군 선택"
        >
            {DEV_JOBS.map((j) => (
                <option key={j} value={j}>{j}</option>
            ))}
        </Select>

        {showRecruitingFilter && (
            <CheckboxLabel>
                <Checkbox
                    checked={filters.showRecruitingOnly}
                    onChange={(e) => handleValueChange("showRecruitingOnly", e.target.checked)}
                />
                모집 중인 스터디만 보기
            </CheckboxLabel>
        )}
    </Container>
  );
};

export default FilterBar;
