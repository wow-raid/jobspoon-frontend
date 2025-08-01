import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import StudyListPage from './pages/StudyListPage';
import './styles/App.css';

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <StudyListPage />
            </div>
        </BrowserRouter>
    );
}

export default App;