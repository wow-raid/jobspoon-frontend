import React from "react";
import styled from "styled-components";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function RankGuideModal({ isOpen, onClose }: Props) {
    if (!isOpen) return null;

    return (
        <Overlay>
            <Modal>
                <Header>
                    <h2>랭크 가이드</h2>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </Header>
                <Content>
                    <p>🏅 랭크는 활동에 따라 자동으로 상승합니다.</p>
                    <ul>
                        <li>브론즈 → 기본 시작 랭크</li>
                        <li>실버 → 출석률, 문제풀이, 인터뷰 등 일정 기준 달성 시</li>
                        <li>골드 → 높은 활동 점수 유지</li>
                        <li>플래티넘 이상 → 특별 활동/누적 기준</li>
                    </ul>
                    <p>획득한 랭크는 <b>대표 랭크</b>로 장착할 수 있습니다.</p>
                </Content>
                <Footer>
                    <ConfirmButton onClick={onClose}>확인</ConfirmButton>
                </Footer>
            </Modal>
        </Overlay>
    );
}

/* ================= styled-components ================= */
const Overlay = styled.div`
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    background: rgba(0,0,0,0.4);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000;
`;

const Modal = styled.div`
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 400px;
    max-width: 90%;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    h2 {
        font-size: 18px;
        font-weight: 700;
        margin: 0;
    }
`;

const CloseButton = styled.button`
    font-size: 20px;
    border: none;
    background: transparent;
    cursor: pointer;
`;

const Content = styled.div`
    font-size: 14px;
    line-height: 1.6;

    ul {
        margin: 8px 0;
        padding-left: 18px;
    }

    li {
        margin-bottom: 4px;
    }
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const ConfirmButton = styled.button`
    padding: 8px 16px;
    background: rgb(59, 130, 246);
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;

    &:hover {
        background: rgb(37, 99, 235);
    }
`;
