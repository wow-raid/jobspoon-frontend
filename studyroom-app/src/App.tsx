import React from 'react';
import { Routes, Route, BrowserRouter} from 'react-router-dom';

import StudyListPage from './pages/StudyListPage';
import StudyDetailPage from './pages/StudyDetailPage';

import './styles/App.css';
import SuccessPage from "./pages/SuccessPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import MyStudiesPage from "./pages/MyStudiesPage";
import JoinedStudyRoom from "./pages/JoinedStudyRoom";
import Announcements from "./components/studyroom/Announcements";
import Schedule from "./components/studyroom/Schedule";
import TestInterview from "./components/studyroom/TestInterview.tsx";

const App: React.FC = () => {
    return (
            <div className="app-container">
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

                    </Route>
                </Routes>
            </div>
    );
}

export default App;