// studyroom-app/src/App.tsx
import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { getTheme, onThemeChange, type Theme as BridgeTheme } from '@jobspoon/theme-bridge';

import StudyListPage from './pages/StudyListPage';
import StudyDetailPage from './pages/StudyDetailPage';
import SuccessPage from "./pages/SuccessPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import MyStudiesPage from "./pages/MyStudiesPage";
import JoinedStudyRoom from "./pages/JoinedStudyRoom";
import Announcements from "./components/studyroom/Announcements";
import Schedule from "./components/studyroom/Schedule";
import TestInterview from "./components/studyroom/TestInterview";
import Participants from "./components/studyroom/Participants";

/** ===== Theme tokens =====
 * 필요한 토큰만 최소 정의. 부족하면 여기만 추가하면 됨.
 */
const lightTheme = {
    bg: '#ffffff',
    fg: '#111111',
    surface: '#ffffff',
    surfaceAlt: '#D9D9D954',
    surfaceHover: '#f2f4f7',
    border: '#e5e7eb',
    muted: '#6b7280',
    subtle: '#9ca3af',
    primary: '#5865f2',
    primaryHover: '#4752c4',
    tagBg: '#eef2ff',
    overlay: 'rgba(0,0,0,0.45)',
    inputBg: '#ffffff',
    inputBorder: '#d1d5db',
    inputPlaceholder: '#9ca3af',
    badgeRecruitingBg: 'rgba(5,150,105,0.15)',
    badgeRecruitingFg: '#059669',
    badgeClosedBg: 'rgba(107,114,128,0.15)',
    badgeClosedFg: '#6b7280',
};

const darkTheme = {
    bg: '#181924',
    fg: '#ffffff',
    surface: '#2c2f3b',
    surfaceAlt: '#24262d',
    surfaceHover: '#343846',
    border: '#3e414f',
    muted: '#8c92a7',
    subtle: '#a0a0a0',
    primary: '#5865f2',
    primaryHover: '#6a75f7',
    tagBg: '#3e414f',
    overlay: 'rgba(0,0,0,0.7)',
    inputBg: '#1e2129',
    inputBorder: '#4a5568',
    inputPlaceholder: '#9aa3b2',
    badgeRecruitingBg: 'rgba(4,199,114,0.2)',
    badgeRecruitingFg: '#04c772',
    badgeClosedBg: 'rgba(135,142,153,0.2)',
    badgeClosedFg: '#878e99',
};

// 1) 리모트 전용 스코프 래퍼
const AppShell = styled.div.attrs({ 'data-app': 'studyroom' })`
  min-height: 100vh;
  background: var(--host-bg, ${({ theme }) => theme.bg});
  color: var(--host-fg, ${({ theme }) => theme.fg});
  transition: background-color .2s ease, color .2s ease;
`;

// 2) 기존 .app-container 규칙 대체 (스코프 안에서만)
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

// 3) 컴포넌트/3rd-party에 필요한 공통 리셋이 있으면 스코프를 강제
const ScopedGlobal = createGlobalStyle`
  [data-app="studyroom"] * { box-sizing: border-box; }
  [data-app="studyroom"] a { color: inherit; text-decoration: none; }
`;

// bridge 구독 훅
function useBridgeTheme(): BridgeTheme {
    const [mode, setMode] = useState<BridgeTheme>(() => getTheme());
    useEffect(() => onThemeChange(setMode), []);
    return mode;
}

const App: React.FC = () => {
    const mode = useBridgeTheme();
    const theme = mode === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeProvider theme={theme}>
            <AppShell>
                <ScopedGlobal />
                <Container>
                    <Routes>
                        <Route path="/" element={<StudyListPage />} />
                        <Route path="/study/:id" element={<StudyDetailPage />} />
                        <Route path="/success" element={<SuccessPage />} />
                        <Route path="/my-applications" element={<MyApplicationsPage />} />
                        <Route path="/my-studies" element={<MyStudiesPage />} />
                        <Route path="/joined-study/:id" element={<JoinedStudyRoom />}>
                            <Route index element={<Announcements />} />
                            <Route path="schedule" element={<Schedule />} />
                            <Route path="interview" element={<TestInterview />} />
                            <Route path="members" element={<Participants />} />
                        </Route>
                    </Routes>
                </Container>
            </AppShell>
        </ThemeProvider>
    );
};

export default App;
