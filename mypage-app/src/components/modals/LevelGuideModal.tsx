import React from "react";
import styled from "styled-components";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function LevelGuideModal({ isOpen, onClose }: Props) {
    if (!isOpen) return null;

    return (
        <Overlay>
            <Modal>
                <Header>
                    <h2>레벨 가이드</h2>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </Header>
                <Content>
                    <p>📌 레벨은 활동 경험치(Exp)를 통해 올라갑니다.</p>
                    <ul>
                        <li>레벨업에 필요한 경험치 = <strong>현재 레벨 × 100</strong></li>
                        <li>예: Lv.1 → 100 Exp, Lv.2 → 200 Exp</li>
                        <li>경험치는 출석, 문제풀이, 글쓰기, 면접 참여 등으로 획득합니다.</li>
                        <li>레벨이 올라갈수록 경험치 바 색상이 변화합니다.</li>
                    </ul>
                    <Note>
                        레벨업을 통해 더 많은 기능과 보상을 이용할 수 있습니다.
                    </Note>
                </Content>
                <Footer>
                    <ConfirmButton onClick={onClose}>확인</ConfirmButton>
                </Footer>
            </Modal>
        </Overlay>
    );
}

/* styled-components */
const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const Modal = styled.div`
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 420px;
    max-width: 90%;
    max-height: 80vh;
    overflow-y: auto;
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
    text-align: left;   /* 👉 좌측 정렬 */

    ul {
        margin: 8px 0;
        padding-left: 18px;
    }

    li {
        margin-bottom: 6px;
    }
`;

const Note = styled.p`
  margin-top: 10px;
  font-size: 13px;
  color: #555;
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

    transition: background 0.2s ease-in-out;
    &:hover {
        background: rgb(37, 99, 235);
    }
`;
