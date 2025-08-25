// Modal.tsx
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Content = styled.div`
  position: relative;
  background-color: #2c2f3b;
  border-radius: 8px;
  padding: 24px;
  width: 550px;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  outline: none; /* ref로 포커스 받을 때 외곽선 제거 */

  &:focus {
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.4);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  color: #8c92a7;
  border: none;
  font-size: 24px;
  cursor: pointer;

  &:hover {
    color: #c2c6d3;
  }
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        // ESC로 닫기
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);

        // 바디 스크롤 잠금
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        // 포커스 이동
        contentRef.current?.focus();

        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <Overlay onClick={onClose}>
            <Content
                ref={contentRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                onClick={(e) => e.stopPropagation()}
            >
                <CloseButton aria-label="닫기" onClick={onClose}>
                    &times;
                </CloseButton>
                {children}
            </Content>
        </Overlay>
    );
};

export default Modal;
