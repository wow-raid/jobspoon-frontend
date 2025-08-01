import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import StudyListPage from './pages/StudyListPage';
import StudyDetailPage from './pages/StudyDetailPage';

import './styles/App.css';
import SuccessPage from "./pages/SuccessPage.tsx";

function App() {
    return (
        <MemoryRouter>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<StudyListPage />} />
                    <Route path="/study/:id" element={<StudyDetailPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                </Routes>
            </div>
        </MemoryRouter>
    );
}

export default App;