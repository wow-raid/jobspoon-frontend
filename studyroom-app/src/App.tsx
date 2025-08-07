import React from 'react';
import { Routes, Route, BrowserRouter} from 'react-router-dom';

import StudyListPage from './pages/StudyListPage';
import StudyDetailPage from './pages/StudyDetailPage';

import './styles/App.css';
import SuccessPage from "./pages/SuccessPage";
import MyApplicationsPage from "./pages/MyApplicationsPage";
import MyStudiesPage from "./pages/MyStudiesPage";

const App: React.FC = () => {
    return (
            <div className="app-container">
                <Routes>
                    <Route path="/" element={<StudyListPage />} />
                    <Route path="/study/:id" element={<StudyDetailPage />} />
                    <Route path="/success" element={<SuccessPage />} />
                    <Route path="/my-applications" element={<MyApplicationsPage />} />
                    <Route path="/my-studies" element={<MyStudiesPage />} />
                </Routes>
            </div>
    );
}

export default App;