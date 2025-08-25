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

// 1) 리모트 전용 스코프 래퍼
const AppShell = styled.div.attrs({ 'data-app': 'studyroom' })`
  min-height: 100vh;
  /* 호스트에서 노출한 CSS 변수 우선 사용, 없으면 로컬 theme 값 사용 */
  background: var(--host-bg, ${({ theme }) => theme.bg});
  color: var(--host-fg, ${({ theme }) => theme.fg});
  transition: background-color .2s ease, color .2s ease;
`;

// 2) 기존 .app-container 규칙 대체 (스코프 안에서만!)
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
`;

// 3) 컴포넌트/3rd-party에 필요한 공통 리셋이 있으면 스코프를 강제한다
const ScopedGlobal = createGlobalStyle`
  [data-app="studyroom"] * { box-sizing: border-box; }
  [data-app="studyroom"] a { color: inherit; text-decoration: none; }
`;

// 4) 로컬 테마 토큰 (호스트 변수 없을 때 fallback)
const lightTheme = { bg: '#ffffff', fg: '#111111' };
const darkTheme = { bg: '#181924', fg: '#ffffff' };

// 5) theme-bridge 구독 훅
function useBridgeTheme(): BridgeTheme {
    const [mode, setMode] = useState<BridgeTheme>(() => getTheme());
    useEffect(() => onThemeChange(setMode), []);
    return mode;
}

const App: React.FC = () => {
    const mode = useBridgeTheme();

    return (
        <ThemeProvider theme={mode === 'dark' ? darkTheme : lightTheme}>
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
