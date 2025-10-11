import styled from "styled-components";
import {useEffect, useState} from "react";
import axiosInstance from "../../api/axiosInstance";

// modal styled
const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    `;

const ModalContent = styled.div`
    background-color: ${({ theme }) => theme.surface};
    padding: 24px;
    border-radius: 8px;
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    h3 {
        margin: 0;
        color: ${({ theme }) => theme.fg};
        span {
            font-weight: normal;
            color: ${({ theme }) => theme.subtle};
        }
    }
    
    select, textarea {
        width: 100%;
        padding: 10px;
        border-radius: 6px;
        border: 1px solid ${({ theme }) => theme.border};
        background-color: ${({ theme }) => theme.surfaceHover};
        color: ${({ theme }) => theme.fg};
        font-size: 14px;
        resize: vertical;
    }
    
    textarea {
        min-height: 120px;
    }
`;

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
`;

// ✅ [추가] 버튼들의 기본 스타일을 정의합니다.
const BaseButton = styled.button`
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
`;

// ✅ [추가] 취소 버튼 스타일
const CancelButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.subtle};
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    background-color: ${({ theme }) => theme.border};
  }
`;

// ✅ [추가] 신고 제출 버튼 스타일
const SubmitButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.danger ?? '#ff6b6b'};
  color: white;

  &:hover {
    background-color: ${({ theme }) => theme.dangerHover ?? '#f05252'};
  }
`;

// component Props type
interface ParticipantsReportModalProps {
    studyId: string;
    reportedMember: {
        id: number;
        nickname: string;
    } | null;
    onClose: () => void;
}

// ParticipantsReportModal component
const ParticipantsReportModal: React.FC<ParticipantsReportModalProps> = ({ studyId, reportedMember, onClose }) => {
    const [category, setCategory] = useState('');
    const [description, setDescription] = useState('');

    // 새로운 신고 대상이 선택되면 상태 초기화
    useEffect(() => {
        setCategory('');
        setDescription('');
    }, [reportedMember]);

    if (!reportedMember) {
        return null;        // 신고 대상이 없으면 모달을 랜더링하지 않음
    }

    const handleSubmit = async () => {
        if (!category) {
            alert('신고 분류를 선택해주세요.');
            return;
        }

        try {
            await axiosInstance.post('/study-rooms/reports', {
                reportedUserId: reportedMember.id,
                studyRoomId: Number(studyId),
                category: category,
                description: description,
            });
            alert(`${reportedMember.nickname}님에 대한 신고가 접수되었습니다.`);
            onClose();      // 성공 시 모달 닫기
        } catch (error: any) {
            console.error("신고 제출 실패:", error);
            const errorMessage = error.response?.data?.message || "신고 접수에 실패했습니다.";
            alert(errorMessage);
        }
    };

    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <h3> {reportedMember.nickname} <span>님 신고하기</span></h3>

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value=""> -- 신고 분류 선택 --</option>
                    <option value="SPAM"> 스팸/광고성 메시지 </option>
                    <option value="HARASSMENT"> 욕설, 비방, 괴롭힘 </option>
                    <option value="INAPPROPRIATE_CONTENT"> 부적절한 컨텐츠 </option>
                    <option value="OFF_TOPIC"> 스터디모임 목적 외 활동 </option>
                    <option value="ETC"> 기타 </option>
                </select>

                <textarea
                    placeholder="신고 내용을 구체적으로 작성해주세요."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <ModalActions>
                    <SubmitButton onClick={handleSubmit}>신고 제출</SubmitButton>
                    <CancelButton onClick={onClose}>취소</CancelButton>

                </ModalActions>
            </ModalContent>
        </ModalOverlay>
    );
};

export default ParticipantsReportModal;
































