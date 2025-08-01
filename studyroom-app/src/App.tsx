import React from 'react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

import StudyListPage from './pages/StudyListPage';
import StudyDetailPage from './pages/StudyDetailPage';
// import MyStudiesPage from './pages/MyStudiesPage';

import './styles/App.css';

function App() {
    return (
        <MemoryRouter>
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<StudyListPage />} />
                    {/*<Route path="/my-studies" element={<MyStudiesPage />} />*/}
                    <Route path="/study/:id" element={<StudyDetailPage />} />
                </Routes>
            </div>
        </MemoryRouter>
    );
}

export default App;