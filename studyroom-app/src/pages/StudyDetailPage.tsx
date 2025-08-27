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

const PageContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const StudyDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [study, setStudy] = useState<StudyRoom | null>(null);
    const [loading, setLoading] = useState(true);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

    // 👇 2. useEffect를 API 호출 로직으로 변경
    useEffect(() => {
        const fetchStudyDetail = async () => {
            if (!id) return; // id가 없으면 실행하지 않음
            setLoading(true);
            try {
                // 백엔드에 특정 스터디의 상세 정보를 요청
                const response = await axiosInstance.get(`/study-rooms/${id}`);

                // 👇 1. 실제 응답 데이터 구조를 확인합니다.
                console.log("백엔드 응답:", response.data);

                // 👇 2. 확인된 구조에 맞춰 데이터를 꺼내 setStudy에 넣어줍니다.
                //    만약 { "studyRoom": { ... } } 형태로 온다면 아래와 같이 수정합니다.
                setStudy(response.data.studyRoom || response.data);




                // setStudy(response.data); // 받아온 데이터로 state 업데이트
            } catch (error) {
                console.error("스터디 상세 정보를 불러오는데 실패했습니다:", error);
                setStudy(null); // 에러 발생 시 study를 null로 설정
            } finally {
                setLoading(false);
            }
        };
        fetchStudyDetail();
    }, [id]); // id가 변경될 때마다 다시 데이터를 불러옴

    const handleApplicationSubmit = (message: string) => {
        console.log(`--- 스터디 참가 신청 ---`);
        console.log(`스터디 ID: ${study?.id}`);
        console.log(`신청 메시지: ${message}`);

        navigate('/success', { state: { title: study?.title } });
    };

    if (loading) return <div>로딩 중...</div>;
    if (!study) return <div>스터디 정보를 찾을 수 없습니다.</div>;

    return (
        <PageContainer>
            <StudyDetailView
                room={study}
                onApplyClick={() => setIsApplyModalOpen(true)}
                hasApplied={false}
            />

            <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)}>
                <ApplicationForm
                    studyTitle={study.title}
                    onSubmit={handleApplicationSubmit}
                    onClose={() => setIsApplyModalOpen(false)}
                />
            </Modal>
        </PageContainer>
    );
};

export default StudyDetailPage;
