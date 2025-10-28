// TrustScoreCriteriaModal.tsx
import React, {useEffect} from "react";
import styled from "styled-components";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

export default function TrustScoreCriteriaModal({ isOpen, onClose }: Props) {
    // ✅ ESC 키로 닫기
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <Overlay isOpen={isOpen} onClick={onClose}>
            <ModalBox isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
                <Header>
                    <h2>활동 점수 산정 기준</h2>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </Header>

                <Content>
                    <p>🛡️ 활동 점수는 다음 여섯 가지 항목으로 구성됩니다.</p>
                    <CardList>
                        <Card>
                            <Title>🗓️ 출석률</Title>
                            <Point>최대 25점</Point>
                            <Desc>이번 달 출석률에 따라 점수 반영 (100% = 25점)</Desc>
                            <Note>성실성 지표</Note>
                        </Card>
                        <Card>
                            <Title>🎤 모의면접</Title>
                            <Point>최대 15점</Point>
                            <Desc>이번 달 완료한 모의면접 횟수 기준</Desc>
                            <Note>실전 대비 지표</Note>
                        </Card>
                        <Card>
                            <Title>🧩 문제풀이</Title>
                            <Point>최대 15점</Point>
                            <Desc>이번 달 풀이한 문제 수 기준</Desc>
                            <Note>학습 꾸준함</Note>
                        </Card>
                        <Card>
                            <Title>✍️ 게시글 작성</Title>
                            <Point>최대 15점</Point>
                            <Desc>이번 달 작성한 게시글 수 기준</Desc>
                            <Note>지식 공유 기여</Note>
                        </Card>
                        <Card>
                            <Title>👥 스터디룸 개설</Title>
                            <Point>최대 15점</Point>
                            <Desc>이번 달 개설한 스터디룸 수 기준</Desc>
                            <Note>커뮤니티 리더십</Note>
                        </Card>
                        <Card>
                            <Title>💬 댓글 작성</Title>
                            <Point>최대 15점</Point>
                            <Desc>이번 달 작성한 댓글 수 기준</Desc>
                            <Note>커뮤니티 참여</Note>
                        </Card>
                    </CardList>

                    <p>총점은 최대 100점이며, 활동에 따라 월별로 갱신됩니다.</p>
                </Content>

                <Footer>
                    <ConfirmButton onClick={onClose}>확인</ConfirmButton>
                </Footer>
            </ModalBox>
        </Overlay>
    );
}

/* ================= styled-components ================= */

const Overlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;

    background: ${({ isOpen }) => (isOpen ? "rgba(0,0,0,0.4)" : "transparent")};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
    transition: all 0.35s ease-in-out;
`;

const ModalBox = styled.div<{ isOpen: boolean }>`
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 600px;
    max-width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transform: ${({ isOpen }) => (isOpen ? "scale(1)" : "scale(0.95)")};
    opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
    transition: all 0.35s ease-in-out;
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

/* ---------- 내부 카드 ---------- */
const CardList = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
    margin-top: 12px;
`;

const Card = styled.div`
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 10px 12px;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const Title = styled.h4`
    font-size: 15px;
    font-weight: 600;
    margin: 0 0 4px;
`;

const Point = styled.p`
    font-size: 13px;
    font-weight: 500;
    color: #2563eb;
    margin: 0 0 4px;
`;

const Desc = styled.p`
    font-size: 13px;
    margin: 0 0 2px;
`;

const Note = styled.p`
    font-size: 12px;
    color: #6b7280;
    margin: 0;
`;
