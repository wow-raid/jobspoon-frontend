import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StudyRoom } from '../types/study';
import { FAKE_STUDY_ROOMS } from '../data/mockData';
import StudyDetailView from '../components/StudyDetailView';
import Modal from '../components/Modal';
import ApplicationForm from '../components/ApplicationForm';

const StudyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [study, setStudy] = useState<StudyRoom | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        const foundStudy = FAKE_STUDY_ROOMS.find(room => String(room.id) === id);
        setStudy(foundStudy);
        setLoading(false);
    }, [id]);

    const handleApplicationSubmit = (message: string) => {
        console.log(`--- 스터디 참가 신청 ---`);
        console.log(`스터디 ID: ${study?.id}`);
        console.log(`신청 메시지: ${message}`);

        navigate('/success', { state: { title: study?.title}});
    };

    if (loading) {
        return <div>로딩 중...</div>;
    }

    if (!study) {
        return <div>스터디 정보를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="page-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <StudyDetailView
                room={study}
                onApplyClick={() => setIsApplyModalOpen(true)}
            />

            <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)}>
                <ApplicationForm
                    studyTitle={study.title}
                    onSubmit={handleApplicationSubmit}
                    onClose={() => setIsApplyModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default StudyDetailPage;