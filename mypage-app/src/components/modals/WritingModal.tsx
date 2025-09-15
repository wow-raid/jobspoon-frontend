{/* 게시글 안내 모달 */}

import React from "react";
import styled from "styled-components";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    writing: {
        reviewCount: number;
        studyroomCount: number;
        commentCount: number;
        totalCount: number;
    };
};

export default function WritingModal({ isOpen, onClose, writing }: Props) {
    if (!isOpen) return null;

    return (
        <Overlay>
            <Modal>
                <Header>
                    <h2>글 작성 상세</h2>
                    <CloseButton onClick={onClose}>×</CloseButton>
                </Header>

                <Content>
                    <h3>내 글 현황</h3>
                    <ul>
                        <li>✍️ 리뷰 작성: {writing.reviewCount}개</li>
                        <li>📚 스터디룸 개설: {writing.studyroomCount}개</li>
                        <li>💬 댓글 작성: {writing.commentCount}개</li>
                        <li>📝 총 글 작성: {writing.totalCount}개</li>
                    </ul>
                </Content>

                <Footer>
                    <ConfirmButton onClick={onClose}>확인</ConfirmButton>
                </Footer>
            </Modal>
        </Overlay>
    );
}

/* ================== styled-components ================== */

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

    h3 {
        margin-bottom: 8px;
        font-size: 15px;
        font-weight: 600;
    }

    ul {
        margin: 8px 0;
        padding-left: 18px;
    }

    li {
        margin-bottom: 6px;
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
