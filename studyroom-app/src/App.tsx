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
import ApplicationManagement from "./components/studyroom/ApplicationManagement.tsx";
import AttendanceManagement from "./components/studyroom/AttendanceManagement.tsx";

/** ===== Theme tokens ===== */
const lightTheme = {
  bg: '#ffffff',
  fg: '#111111',
  surface: '#ffffff',
  surfaceAlt: '#D9D9D954',
  surfaceHover: '#f2f4f7',
  border: '#e5e7eb',
  muted: '#6b7280',
  subtle: '#9ca3af',
  primary: '#01B0F1',
  primaryHover: '#4752c4',
  tagBg: '#eef2ff',
  overlay: 'rgba(0,0,0,0.45)',
  inputBg: '#ffffff',
  inputBorder: '#d1d5db',
  inputPlaceholder: '#9ca3af',
  badgeRecruitingBg: '#01B0F1',
  badgeRecruitingFg: '#fff',
  badgeClosedBg: '#1A1A1F',
  badgeClosedFg: '#BDBDBD',
  accent: '#5865F2',
  accentHover: '#4752c4',
  danger: '#ef4444',
  dangerHover: '#dc2626',
};

const darkTheme = {
  bg: '#181924',
  fg: '#ffffff',
  surface: '#2c2f3b',
  surfaceAlt: '#2D2F3C',
  surfaceHover: '#343846',
  border: '#3e414f',
  muted: '#8c92a7',
  subtle: '#a0a0a0',
  primary: '#01B0F1',
  primaryHover: '#6a75f7',
  tagBg: '#3e414f',
  overlay: 'rgba(0,0,0,0.7)',
  inputBg: '#1e2129',
  inputBorder: '#4a5568',
  inputPlaceholder: '#9aa3b2',
  badgeRecruitingBg: '#01B0F1',
  badgeRecruitingFg: '#fff',
  badgeClosedBg: '#1A1A1F',
  badgeClosedFg: '#BDBDBD',
  accent: '#5865F2',
  accentHover: '#6a75f7',
  danger: '#ff6b6b',
  dangerHover: '#f05252',
};

// 1) 리모트 전용 스코프 래퍼
const AppShell = styled.div.attrs({ 'data-app': 'studyroom' })`
  min-height: 100vh;
  background: ${({ theme }) => theme.bg};
  color: ${({ theme }) => theme.fg};
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

/** ✅ 핵심: DOM(data-theme) → localStorage → bridge 순서로 읽고,
 *    DOM/bridge 양쪽 변경을 모두 구독해서 역전/레이스 제거
 */
function useBridgeTheme(): BridgeTheme {
  const read = (): BridgeTheme => {
    const attr = document.documentElement.getAttribute('data-theme');
    if (attr === 'light' || attr === 'dark') return attr as BridgeTheme;
    try {
      const ls = localStorage.getItem('theme');
      if (ls === 'light' || ls === 'dark') return ls as BridgeTheme;
    } catch { }
    return getTheme();
  };

  const [mode, setMode] = useState<BridgeTheme>(read);

  useEffect(() => {
    // mount 직후 한 번 더 동기화(호스트가 DOM을 늦게 세팅해도 맞춤)
    setMode(read());

    // bridge 이벤트 구독
    const off = onThemeChange((t) => {
      setMode((prev) => (prev === t ? prev : t));
    });

    // DOM의 data-theme 변화도 감시(안전망)
    const mo = new MutationObserver(() => {
      const t = read();
      setMode((prev) => (prev === t ? prev : t));
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => { off?.(); mo.disconnect(); };
  }, []);

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
              <Route path="applications" element={<ApplicationManagement />} />
              <Route path="attendance" element={<AttendanceManagement />} />
            </Route>
          </Routes>
        </Container>
      </AppShell>
    </ThemeProvider>
  );
};

export default App;
