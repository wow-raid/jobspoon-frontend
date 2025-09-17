// StudyDetailPage.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { StudyRoom, StudyApplication } from '../types/study';
import axiosInstance from "../api/axiosInstance";
import { FAKE_STUDY_ROOMS } from '../data/mockData';
import StudyDetailView, {ApplyBtn} from '../components/StudyDetailView';
import Modal from '../components/Modal';
import ApplicationForm from '../components/ApplicationForm';
import CreateStudyForm from "../components/CreateStudyForm";        // 생성폼을 재사용함
import { useAuth } from "../hooks/useAuth";

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

const PendingButton = styled(ActionButton)`
  background-color: #f59e0b; /* 주황색 계열 */
  color: #fff;
  &:hover:not(:disabled) { background-color: #d97706; }
`;

const ApprovedButton = styled(ActionButton)`
  background-color: #10b981; /* 녹색 계열 */
  color: #fff;
  &:hover:not(:disabled) { background-color: #059669; }
`;

const DisabledButton = styled(ActionButton)`
  background-color: ${({ theme }) => theme.muted};
  color: ${({ theme }) => theme.subtle};
  cursor: not-allowed;
`;

const CancelButton = styled(ActionButton)`
  background-color: transparent;
  color: ${({ theme }) => theme.subtle};
  border: 1px solid ${({ theme }) => theme.border};
  margin-top: 8px; /* 다른 버튼과 함께 나올 때 간격 */

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.surfaceHover};
    border-color: ${({ theme }) => theme.subtle};
  }
`;

const ButtonWrapper = styled.div`
`;


const StudyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { currentUserId } = useAuth();
    const [study, setStudy] = useState<StudyRoom | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);  // 수정 모달

    // ✅ 2. 신청 상태와 ID를 저장할 state 추가
    const [application, setApplication] = useState<StudyApplication | null>(null);

    // 👇 2. useEffect를 API 호출 로직으로 변경
    useEffect(() => {
        const fetchAllData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                // ✅ 3. 스터디 상세 정보와 내 지원 상태를 동시에 조회
                const [studyResponse, applicationResponse] = await Promise.all([
                    axiosInstance.get(`/study-rooms/${id}`),
                    axiosInstance.get(`/study-rooms/${id}/my-application`) // 백엔드에 추가된 API
                ]);
                setStudy(studyResponse.data);
                setApplication(applicationResponse.data);
            } catch (error) {
                console.error("데이터를 불러오는데 실패했습니다:", error);
                setStudy(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [id]);

    const handleUpdateSuccess = (updateStudy: StudyRoom) => {
        setStudy(updateStudy);
        setIsEditModalOpen(false);
        alert('스터디모임 정보가 성공적으로 수정되었습니다.');
    }

    const handleApplicationSubmit = async (message: string) => {
        if (!study || !currentUserId) return;
        try {
            await axiosInstance.post('/study-applications', {
                studyRoomId: study.id,
                applicantId: currentUserId,
                message: message,
            });
            navigate('/success', { state: { title: study.title } });
        } catch (error) {
            console.error("스터디 참가 신청에 실패했습니다:", error);
            alert("참가 신청 중 오류가 발생했습니다. 이미 신청했거나, 모임장일 수 있습니다.");
        }
    };

    const handleCancelApplication = async () => {
        if (!application?.applicationId) return;

        if (window.confirm("정말로 신청을 취소하시겠습니까?")) {
            try {
                await axiosInstance.delete(`/study-applications/${application.applicationId}`);
                alert("신청이 취소되었습니다.");
                // 상태를 '미신청'으로 변경하여 버튼을 다시 '참가 신청하기'로 바꿈
                setApplication({ applicationId: null, status: 'NOT_APPLIED' });
            } catch (error) {
                console.error("신청 취소에 실패했습니다:", error);
                alert("처리 중 오류가 발생했습니다.");
            }
        }
    };

    if (loading) return <div>로딩 중...</div>;
    if (!study) return <div>스터디 정보를 찾을 수 없습니다.</div>;

    console.log('isOwner 비교 전 값 확인:', {
        '로그인된 사용자 ID': currentUserId,
        '스터디 생성자 ID': study.hostId
    });

    const isOwner = currentUserId !== null && study.hostId === currentUserId;

    // ✅ 5. 상태에 따라 다른 버튼을 보여주는 렌더링 함수
    const renderActionButton = () => {
        if (isOwner) {
            return <ApplyBtn onClick={() => setIsEditModalOpen(true)}>정보 수정하기</ApplyBtn>;
        }

        if (study.status === 'COMPLETED') {
            return <DisabledButton disabled>모집이 완료되었습니다</DisabledButton>;
        }
        if (study.status === 'CLOSED') {
            return <DisabledButton disabled>폐쇄된 스터디입니다</DisabledButton>;
        }

        switch (application?.status) {
            case 'PENDING':
                return (
                    <ButtonWrapper>
                        <PendingButton onClick={() => navigate('/studies/my-applications')}>
                            참가 신청 중 (내역 보기)
                        </PendingButton>
                        <CancelButton onClick={handleCancelApplication}>
                            신청 취소하기
                        </CancelButton>
                    </ButtonWrapper>
                );
            case 'APPROVED':
                return (
                    <ApprovedButton onClick={() => navigate(`/studies/joined-study/${study.id}`)}>
                        모임으로 이동
                    </ApprovedButton>
                );
            case 'REJECTED':
                return <DisabledButton disabled>거절됨</DisabledButton>;

            case 'NOT_APPLIED':
            default:
                return <ApplyBtn onClick={() => setIsApplyModalOpen(true)}>참가 신청하기</ApplyBtn>;
        }
    };

    return (
        <PageContainer>
            <StudyDetailView
                room={study}
                // StudyDetailView가 버튼을 children으로 받도록 구조를 변경했다고 가정합니다.
            >
                {/* ✅ 6. 버튼 렌더링 함수 호출 */}
                <div style={{ marginTop: '24px' }}>
                    {renderActionButton()}
                </div>
            </StudyDetailView>

            {isApplyModalOpen && study && (
                <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)}>
                    <ApplicationForm
                        studyTitle={study.title}
                        onSubmit={handleApplicationSubmit}
                        onClose={() => setIsApplyModalOpen(false)}
                    />
                </Modal>
            )}

            {isEditModalOpen && study && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
                    <CreateStudyForm
                        isEditMode={true}
                        initialData={study}
                        onSuccess={handleUpdateSuccess}
                    />
                </Modal>
            )}
        </PageContainer>
    );
};

export default StudyDetailPage;
