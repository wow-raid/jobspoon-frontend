// studyroom-app/src/components/Modal.tsx
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
  background-color: ${({ theme }) => theme.overlay};
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Content = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.fg};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  padding: 24px;
  width: 550px;
  max-width: 90%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  outline: none;

  &:focus {
    box-shadow: 0 0 0 2px ${({ theme }) => theme.primary};
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  color: ${({ theme }) => theme.muted};
  border: none;
  font-size: 24px;
  cursor: pointer;

  &:hover { color: ${({ theme }) => theme.fg}; }
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

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
        <CloseButton aria-label="닫기" onClick={onClose}>&times;</CloseButton>
        {children}
      </Content>
    </Overlay>
  );
};

export default Modal;
