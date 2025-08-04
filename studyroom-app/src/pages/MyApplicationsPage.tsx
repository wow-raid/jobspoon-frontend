import React, { useState, useMemo } from 'react';
import ApplicationCard from "../components/ApplicationCard";
import { MY_APPLICATIONS } from "../data/mockData";
import '../styles/MyapplicationsPage.css';

type ApplicationStatus = 'all' | 'pending' | 'approve' | 'rejected';

const MyApplicationsPage: React.FC = () => {
    const [applications, setApplications] = useState(MY_APPLICATIONS);

    const [filter, setFilter] = useState<ApplicationStatus>('all');

    const handleCancel = (id: number) => {
        if (window.confirm("정말로 신청을 취소하시겠습니까?")) {
            setApplications(prev => prev.filter(app => app.id !== id));
        }
    }

    const filteredApplications = useMemo(() => {
        if (filter === 'all') {
            return applications;
        }
            return applications.filter(app => app.status === filter);
        }, [applications, filter]);

        const filterTags: { key: ApplicationStatus; text: string }[] = [
            { key: 'all', text: '전체' },
            { key: 'pending', text: '대기중' },
            { key: 'approved', text: '수락됨' },
            { key: 'rejected', text: '거절됨' },
        ];

    return (
        <div className="my-applications-page">
            <h1 className="page-title">내 스터디 신청 내역</h1>

            <div className="filter-tags-container">
                {filterTags.map(tag => (
                    <button
                        key={tag.key}
                        className={`filter-tag ${filter === tag.key ? 'active' : ''}`}
                    onClick={() => setFilter(tag.key)}
                    >
                        {tag.text}
                    </button>
                ))}
            </div>
            <div className="applications-grid">
                {filteredApplications.map(app => (
                    <ApplicationCard
                        key={app.id}
                        application={app}
                        onCancel={handleCancel}
                    />
                ))}
            </div>
        </div>
    );
};

export default MyApplicationsPage;