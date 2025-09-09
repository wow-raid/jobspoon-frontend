import React from "react";
import styled from "styled-components";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function TitleGuideModal({ isOpen, onClose }: Props) {
    if (!isOpen) return null;

    return (
        <Overlay>
            <ModalBox>
                <Header>
                    <h2>칭호 가이드</h2>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </Header>

                <Content>
                    <p>🏷️ 칭호는 특정 업적이나 이벤트를 달성하면 획득할 수 있습니다.</p>
                    <ul>
                        <li>「얼리버드」 → 오전 6시 이전 출석</li>
                        <li>「열정맨」 → 30일 연속 출석</li>
                        <li>「면접 고수」 → 모의면접 50회 완료</li>
                        <li>「커뮤니티 리더」 → 댓글/게시글 활동 우수자</li>
                    </ul>
                    <p>획득한 칭호는 <b>대표 칭호</b>로 장착할 수 있습니다.</p>
                </Content>

                <Footer>
                    <ConfirmButton onClick={onClose}>확인</ConfirmButton>
                </Footer>
            </ModalBox>
        </Overlay>
    );
}

/* ================= styled-components ================= */
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
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
