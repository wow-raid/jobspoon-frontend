import React from "react";
import styled from "styled-components";

interface WithdrawalConfirmModalProps {
    onClose: () => void;
    onConfirm: () => void;
}

export default function WithdrawalConfirmModal({
                                                   onClose,
                                                   onConfirm,
                                               }: WithdrawalConfirmModalProps) {
    return (
        <Overlay>
            <ModalContent>
                <Title>정말 탈퇴하시겠습니까?</Title>

                <Message>
                    탈퇴 후에는 계정과 데이터가 복구되지 않습니다. <br />
                    계속 진행하시겠습니까?
                </Message>

                <ButtonGroup>
                    <DangerButton onClick={onConfirm}>회원탈퇴</DangerButton>
                    <CancelButton onClick={onClose}>취소</CancelButton>
                </ButtonGroup>
            </ModalContent>
        </Overlay>
    );
}

/* ================== styled-components ================== */

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 50;

    background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    padding: 24px;
    width: 360px;   /* ✅ ServiceModal과 동일 */
    text-align: center;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: 700;
    margin-bottom: 12px;
    color: rgb(17, 24, 39);
`;

const Message = styled.p`
    font-size: 15px;
    color: rgb(75, 85, 99);
    margin-bottom: 20px;
    line-height: 1.6;
`;

const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  background: #e5e7eb;
  border: none;
  color: #111827;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #d1d5db;
  }
`;

const DangerButton = styled.button`
  padding: 10px 20px;
  background: #dc2626;
  border: none;
  color: white;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #b91c1c;
  }
`;
