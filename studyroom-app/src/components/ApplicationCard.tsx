import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/ApplicationCard.css';

interface Application {
    id: number;
    studyId: number;
    studyTitle: string;
    status: 'pending' | 'approved' | 'rejected';
    appliedAt: string;
}

interface ApplicationCardProps {
    application: Application;
    onCancel: (id: number) => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({application, onCancel}) => {
    const {id, studyId, studyTitle, status, appliedAt} = application;

    const statusMap = {
        pending: {text: '대기중', className: 'pending'},
        approved: {text: '수락됨', className: 'approved'},
        rejected: {text: '거절됨', className: 'rejected'}
    }

    return (
        <Link to={`/study/${studyId}`} className="application-card">
            <div className="card-content">
                <h3 className="study-title">{studyTitle}</h3>
                <div className="card-meta">
                    <p className="applied-date">{appliedAt} 신청</p>
                    {status === 'pending' ? (
                        <button
                            className="cancel-button"
                            onClick={() => onCancel(id)}
                        >
                            신청 취소
                        </button>
                    ) : (
                        <button
                            className="cancel-button disabled"
                            disabled
                        >
                            취소 불가
                        </button>
                    )}
                </div>
            </div>
            <div className={`status-tag ${statusMap[status].className}`}>
                {statusMap[status].text}
            </div>
        </Link>
    );
};

export default ApplicationCard;