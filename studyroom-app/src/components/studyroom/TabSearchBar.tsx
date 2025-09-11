import React from 'react';
import styled from 'styled-components';

const SearchInput = styled.input`
  width: 280px;
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

interface TabSearchBarProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

const TabSearchBar: React.FC<TabSearchBarProps> = ({
                                                       searchTerm,
                                                       onSearchChange,
                                                       placeholder,
                                                   }) => {
    return (
        <SearchInput
            type="text"
            value={searchTerm}
            onChange={onSearchChange}
            placeholder={placeholder || '검색...'}
            aria-label="Search"
        />
    );
};

export default TabSearchBar;