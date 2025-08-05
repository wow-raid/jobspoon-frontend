import React from 'react';
import {MemoryRouter, Routes, Route, BrowserRouter} from 'react-router-dom';

import StudyListPage from './pages/StudyListPage';
import StudyDetailPage from './pages/StudyDetailPage';

import './styles/App.css';
import SuccessPage from "./pages/SuccessPage.tsx";
import MyApplicationsPage from "./pages/MyApplicationsPage.tsx";

function App() {
    return (
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<StudyListPage />} />
                    <Route path="/study/:id" element={<StudyDetailPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/my-applications" element={<MyApplicationsPage />} />
                </Routes>
            </div>
    );
}

export default App;