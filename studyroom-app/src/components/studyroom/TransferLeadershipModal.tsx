import React, { useState } from 'react';
import styled from 'styled-components';
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from 'react-router-dom';

const ModalOverlay = styled.div`
    position: fixed; top: 0; left: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    display: flex; justify-content: center; align-items: center; z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: ${({ theme }) => theme.surface};
    padding: 24px; border-radius: 8px; width: 100%; max-width: 400px;
    display: flex; flex-direction: column; gap: 20px;
    h3 { margin: 0; color: ${({ theme }) => theme.fg}; }
`;

const MemberList = styled.div`
    display: flex; flex-direction: column; gap: 12px;
    max-height: 200px; overflow-y: auto;
`;

const MemberLabel = styled.label`
    display: flex; align-items: center; gap: 12px;
    padding: 12px; border-radius: 6px; cursor: pointer;
    background-color: ${({ theme }) => theme.surfaceHover};
    border: 1px solid transparent;
    transition: all 0.2s;
    &:hover { border-color: ${({ theme }) => theme.primary}; }
    &.selected {
      border-color: ${({ theme }) => theme.primary};
      box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.4);
    }
`;

const ModalActions = styled.div`
    display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px;
`;

const BaseButton = styled.button`
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.2s;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const CancelButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.surfaceHover};
  color: ${({ theme }) => theme.subtle};
  border: 1px solid ${({ theme }) => theme.border};

  &:hover {
    background-color: ${({ theme }) => theme.border};
  }
`;

const TransferButton = styled(BaseButton)`
  background-color: ${({ theme }) => theme.accent ?? theme.primary};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.accentHover ?? theme.primaryHover};
  }
`;

interface Member {
    id: number;
    nickname: string;
}

interface TransferLeadershipModalProps {
    isOpen: boolean;
    onClose: () => void;
    studyId: string;
    participants: Member[];
}

const TransferLeadershipModal: React.FC<TransferLeadershipModalProps> = ({ isOpen, onClose, studyId, participants }) => {
    const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);
    const navigate = useNavigate();

    if (!isOpen) {
        return null;
    }

    const handleTransfer = async () => {
        if (selectedMemberId === null) {
            alert("리더를 위임할 멤버를 선택해주세요.");
            return;
        }

        const selectedMember = participants.find(p => p.id === selectedMemberId);
        if (!selectedMember) return;

        if (window.confirm(`정말로 '${selectedMember.nickname}'님에게 리더를 위임하시겠습니까?`)) {
            try {
                await axiosInstance.patch(`/study-rooms/${studyId}/transfer-leadership`, {
                    newLeaderId: selectedMemberId
                });
                alert("리더 위임이 완료되었습니다. 이제부터 일반 멤버로 활동합니다.");
                onClose();
                // 리더 권한이 바뀌었으므로, 페이지를 새로고침하여 최신 정보를 반영합니다.
                window.location.reload();
            } catch (error) {
                console.error("리더 위임 실패:", error);
                alert("리더 위임 중 오류가 발생했습니다.");
            }
        }
    };
    return (
        <ModalOverlay onClick={onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
                <h3>리더 위임하기</h3>
                <MemberList>
                    {participants.length > 0 ? (
                        participants.map(p => (
                            <MemberLabel key={p.id} className={selectedMemberId === p.id ? 'selected' : ''}>
                                <input
                                    type="radio"
                                    name="new-leader"
                                    value={p.id}
                                    checked={selectedMemberId === p.id}
                                    onChange={() => setSelectedMemberId(p.id)}
                                />
                                {p.nickname}
                            </MemberLabel>
                        ))
                    ) : (
                        <p>위임할 수 있는 참가자가 없습니다.</p>
                    )}
                </MemberList>
                <ModalActions>
                    <TransferButton onClick={handleTransfer} disabled={!selectedMemberId}>위임하기</TransferButton>
                    <CancelButton onClick={onClose}>취소</CancelButton>
                </ModalActions>
            </ModalContent>
        </ModalOverlay>
    );
};

export default TransferLeadershipModal;