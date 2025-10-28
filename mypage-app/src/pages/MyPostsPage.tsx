import React from "react";
import styled, { keyframes } from "styled-components";
import { FaFolderOpen, FaPenFancy } from "react-icons/fa";

export default function MyPostsPage() {
    return (
        <Section>
            <SectionHeader>
                <SectionTitle>나의 게시물</SectionTitle>
            </SectionHeader>

            <Card>
                <CardHeader>
                    <IconBox>
                        <FaFolderOpen size={26} color={palette.accent} />
                    </IconBox>
                    <CardTitle>JobSpoon 활동 기록</CardTitle>
                    <Tag>COMING SOON</Tag>
                </CardHeader>

                <CardBody>
                    <p>
                        JobSpoon 곳곳에서 내가 남긴
                        <strong> 게시글, 댓글, 리뷰</strong>를 한눈에 관리할 수 있는 공간이에요.
                    </p>
                    <p>
                        수정하거나 삭제할 수 있는 관리 기능이 함께 추가될 예정입니다.
                    </p>
                    <p>
                        <strong>현재는 서비스 준비 중</strong>이며,
                        더 편리한 기능으로 곧 찾아올게요!
                    </p>
                </CardBody>

                <ComingSoonBox>
                    <FaPenFancy size={15} color={palette.primary} />
                    <span>게시물 관리 기능 준비 중</span>
                </ComingSoonBox>
            </Card>
        </Section>
    );
}

/* ================= 색상 팔레트 ================= */
const palette = {
    primary: "#1B8C95",
    accent: "#3AB49A",      // 포인트용 진한 민트
    mintLight: "rgba(27,140,149,0.08)", // 아주 연한 민트 배경용
    border: "#E5E7EB",      // 밝은 회색 선
    text: "#0F172A",        // 메인 텍스트
    subtext: "#6B7280",     // 서브 텍스트
    shadow: "rgba(0,0,0,0.05)", // 은은한 그림자
};

/* ================= 애니메이션 ================= */
const fadeUp = keyframes`
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
`;

const pulse = keyframes`
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 4px 12px rgba(27,140,149,0.08);
    }
    50% {
        transform: scale(1.015);
        box-shadow: 0 8px 22px rgba(27,140,149,0.18);
    }
`;

/* ================= 레이아웃 ================= */
const Section = styled.section`
    padding: 24px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: ${fadeUp} 0.6s ease both;
`;

const SectionHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const SectionTitle = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: ${palette.text};
`;

const Card = styled.div`
    border: 1px solid ${palette.border};
    border-radius: 16px;
    padding: 32px;
    background: linear-gradient(180deg, #fafafa 0%, #ffffff 100%);
    animation: ${float} 5s ease-in-out infinite, ${pulse} 4.5s ease-in-out infinite;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px ${palette.shadow};

    &:hover {
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 24px ${palette.shadow};
    }
`;

const CardHeader = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    margin-bottom: 16px;
`;

const IconBox = styled.div`
    width: 52px;
    height: 52px;
    background: ${palette.mintLight};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const CardTitle = styled.h3`
    font-size: 20px;
    font-weight: 700;
    color: ${palette.primary};
`;

const Tag = styled.span`
    font-size: 12px;
    font-weight: 600;
    color: ${palette.primary};
    background: ${palette.mintLight};
    border-radius: 8px;
    padding: 3px 10px;
    letter-spacing: 0.5px;
`;

const CardBody = styled.div`
    font-size: 15px;
    line-height: 1.8;
    color: ${palette.subtext};

    strong {
        font-weight: 600;
        color: ${palette.accent};
    }

    p + p {
        margin-top: 8px;
    }
`;

const ComingSoonBox = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    background: ${palette.mintLight};
    color: ${palette.primary};
    font-size: 14px;
    font-weight: 500;
    margin-top: 20px;
    animation: ${fadeUp} 0.6s ease both;
`;
