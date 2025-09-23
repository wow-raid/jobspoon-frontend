{/* 크레딧 사용처 안내 모달 */}

import React from "react";
import styled from "styled-components";

interface CreditUsageModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreditUsageModal({ isOpen, onClose }: CreditUsageModalProps) {
    return (
        <Overlay isOpen={isOpen}>
            <ModalBox isOpen={isOpen}>
                <Header>
                    <h3>크레딧 사용 안내</h3>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </Header>

                <Content>
                    <ul>
                        <li><strong>AI 모의면접</strong>: 5 크레딧 / 1회</li>
                        <li><strong>문제풀이</strong>: 2 크레딧 / 1문제</li>
                        <li><strong>스터디룸 개설</strong>: 10 크레딧 / 1회</li>
                    </ul>
                    <p>※ 크레딧은 결제일 기준 6개월간 유효합니다.</p>
                </Content>

                <Footer>
                    <ConfirmButton onClick={onClose}>확인</ConfirmButton>
                </Footer>
            </ModalBox>
        </Overlay>
    );
}

/* ============= styled-components ============= */
const Overlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    inset: 0;
    background: ${({ isOpen }) => (isOpen ? "rgba(0, 0, 0, 0.4)" : "transparent")};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;

    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
    transition: all 0.3s ease-in-out;
`;

const ModalBox = styled.div<{ isOpen: boolean }>`
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 2px 10px rgba(0,0,0,0.15);

    transform: ${({ isOpen }) => (isOpen ? "scale(1)" : "scale(0.95)")};
    transition: all 0.3s ease-in-out;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
    }
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
`;

const Content = styled.div`
    margin: 16px 0;

    ul {
        margin: 0 0 12px;
        padding-left: 20px;
        font-size: 14px;
        color: rgb(55, 65, 81);
    }

    p {
        font-size: 13px;
        color: rgb(107, 114, 128);
    }
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ConfirmButton = styled.button`
    padding: 8px 16px;
    font-size: 14px;
    background: rgb(59,130,246);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;

    transition: background 0.2s ease-in-out;
    &:hover {
        background: rgb(37,99,235);
    }
`;
