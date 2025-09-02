// StudyDetailPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { StudyRoom } from '../types/study';
import axiosInstance from "../api/axiosInstance";
import { FAKE_STUDY_ROOMS } from '../data/mockData';
import StudyDetailView from '../components/StudyDetailView';
import Modal from '../components/Modal';
import ApplicationForm from '../components/ApplicationForm';
import CreateStudyForm from "../components/CreateStudyForm";        // 생성폼을 재사용함
import { useAuth } from "../hooks/useAuth";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const StudyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUserId } = useAuth();
    const [study, setStudy] = useState<StudyRoom | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // 수정 모달

    // 👇 2. useEffect를 API 호출 로직으로 변경
    useEffect(() => {
        const fetchStudyDetail = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/study-rooms/${id}`);
                console.log("서버 응답 원본!!:", response.data);

                // 👇 백엔드 응답 데이터를 그대로 study 상태에 저장합니다.
                setStudy(response.data);
            } catch (error) {
                console.error("스터디 상세 정보를 불러오는데 실패했습니다:", error);
                setStudy(null);
            } finally {
                setLoading(false);
            }
        };
        fetchStudyDetail();
    }, [id]);

    const handleUpdateSuccess = (updateStudy: StudyRoom) => {
        setStudy(updateStudy);
        setIsEditModalOpen(false);
        alert('스터디모임 정보가 성공적으로 수정되었습니다.');
    }

    const handleApplicationSubmit = (message: string) => {
        console.log(`--- 스터디 참가 신청 ---`);
        console.log(`스터디 ID: ${study?.id}`);
        console.log(`신청 메시지: ${message}`);

        navigate('/success', { state: { title: study?.title } });
    };

    if (loading) return <div>로딩 중...</div>;
    if (!study) return <div>스터디 정보를 찾을 수 없습니다.</div>;

    console.log('isOwner 비교 전 값 확인:', {
        '로그인된 사용자 ID': currentUserId,
        '스터디 생성자 ID': study.hostId
    });

    const isOwner = currentUserId !== null && study.hostId === currentUserId;

    return (
        <PageContainer>
            {/* 상세보기 */}
            <StudyDetailView
                room={study}
                isOwner={isOwner}
                onApplyClick={() => setIsApplyModalOpen(true)}
                onEditClick={() => setIsEditModalOpen(true)}
                hasApplied={false}
            />

            {/* 참가 신청 모달 */}
            {isApplyModalOpen && study && (
                <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)}>
                    <ApplicationForm
                        studyTitle={study.title}
                        onSubmit={handleApplicationSubmit}
                        onClose={() => setIsApplyModalOpen(false)}
                    />
                </Modal>
            )}

            {/* 스터디 수정 모달 */}
            {isEditModalOpen && study && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <CreateStudyForm
                        isEditMode={true}
                        initialData={study} // 👈 study 객체를 그대로 전달
                        onSuccess={handleUpdateSuccess}
                    />
                </Modal>
            )}
        </PageContainer>
    );
};

export default StudyDetailPage;
