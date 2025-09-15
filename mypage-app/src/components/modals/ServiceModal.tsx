{/* 서비스 안내 중 모달 */}

import React from "react";
import styled from "styled-components";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ServiceModal({ isOpen, onClose }: ServiceModalProps) {
    return (
        <Overlay isOpen={isOpen}>
            <ModalContent isOpen={isOpen}>
                <Title>서비스 준비 중</Title>

                <Message>
                    해당 기능은 현재 준비 중입니다. <br />
                    곧 만나보실 수 있어요 😊
                </Message>

                <CloseButton onClick={onClose}>닫기</CloseButton>
            </ModalContent>
        </Overlay>
    );
}

/* ================== styled-components ================== */

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;

  background: ${({ isOpen }) => (isOpen ? "rgba(0, 0, 0, 0.5)" : "transparent")};
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: all 0.3s ease-in-out;
`;

const ModalContent = styled.div<{ isOpen: boolean }>`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 24px;
  width: 360px;
  text-align: center;

  transform: ${({ isOpen }) => (isOpen ? "scale(1)" : "scale(0.95)")};
  transition: all 0.3s ease-in-out;
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

const CloseButton = styled.button`
    padding: 10px 20px;
    background: rgb(59, 130, 246);
    border: none;          /* 기본 검정 테두리 제거 */
    color: white;
    border-radius: 6px;
    transition: background 0.2s ease-in-out;

    &:hover {
        background: rgb(37, 99, 235);
    }
`;