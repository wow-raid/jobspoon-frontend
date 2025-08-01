import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../styles/SuccessPage.css';

const SuccessPage: React.FC = () => {
    const location = useLocation();
    const studyTitle = location.state?.title || '스터디';

    return (
        <div className="success-page-container">
            <div className="success-icon">✅</div>
            <h1 className="success-title">참가 신청 완료!</h1>
            <p className="success-message">
                <strong>'{studyTitle}'</strong> 스터디 참가 신청이 정상적으로 완료되었습니다.
            </p>
            <Link to="/" className="success-home-btn">
                홈으로 돌아가기
            </Link>
        </div>
    );
};

export default SuccessPage;