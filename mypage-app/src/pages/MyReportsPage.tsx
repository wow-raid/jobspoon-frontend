import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { fetchMyReports, CreateReportResponse } from "../api/reportApi";
import { notifyError } from "../utils/toast";
import { useNavigate } from "react-router-dom";
import { FaDove } from "react-icons/fa";

/* ====================== 메인 컴포넌트 ====================== */
export default function MyReportsPage() {
    const [reports, setReports] = useState<CreateReportResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    /* ===== 신고 내역 불러오기 ===== */
    const loadReports = async () => {
        setLoading(true);
        try {
            const data = await fetchMyReports();
            setReports(data);
        } catch (err) {
            console.error(err);
            setError("신고 내역을 불러오는 중 오류가 발생했습니다.");
            notifyError("신고 내역 불러오기 실패 ❌");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReports();
    }, []);

    /* ===== 상태 분기 ===== */
    if (loading) return <StateBox>불러오는 중...</StateBox>;
    if (error) return <StateBox color="#EF4444">{error}</StateBox>;
    if (reports.length === 0)
        return <EmptyState onGoContact={() => navigate("/mypage/inquiry")} />;

    return (
        <Section>
            <Header>
                <Title>신고 내역</Title>
                <Desc>내가 신고한 사용자와 진행 상태를 확인할 수 있습니다.</Desc>
            </Header>

            <ReportTable>
                <TableHeader>
                    <div>신고 대상</div>
                    <div>사유</div>
                    <div>상태</div>
                    <div style={{ textAlign: "right" }}>신고일</div>
                </TableHeader>

                {reports.map((r) => (
                    <TableRow key={r.id}>
                        <Cell>{r.reportedUserNickname}</Cell>
                        <Category>{translateCategory(r.category)}</Category>
                        <Status color={statusColor(r.status)}>
                            {statusLabel(r.status)}
                        </Status>
                        <DateCell>
                            {new Date(r.createdAt).toLocaleDateString("ko-KR")}
                        </DateCell>
                    </TableRow>
                ))}
            </ReportTable>
        </Section>
    );
}

/* ====================== Helper 함수 ====================== */
function statusLabel(status: string) {
    const map: Record<string, string> = {
        PENDING: "처리 대기",
        IN_PROGRESS: "검토 중",
        RESOLVED: "완료",
    };
    return map[status] || status;
}

function statusColor(status: string) {
    const colors: Record<string, string> = {
        PENDING: "#A1A1AA",
        IN_PROGRESS: "#2563EB",
        RESOLVED: "#10B981",
    };
    return colors[status] || "#9CA3AF";
}

function translateCategory(category: string) {
    const map: Record<string, string> = {
        SPAM: "스팸/광고",
        HARASSMENT: "욕설/비방",
        INAPPROPRIATE_CONTENT: "부적절한 콘텐츠",
        OFF_TOPIC: "스터디 목적 외 활동",
        ETC: "기타",
    };
    return map[category] || category;
}

/* ====================== Empty 상태 ====================== */
function EmptyState({ onGoContact }: { onGoContact: () => void }) {
    return (
        <Section>
            <Header>
                <Title>신고 내역</Title>
                <Desc>내가 신고한 사용자와 진행 상태를 확인할 수 있습니다.</Desc>
            </Header>

            <EmptyCard>
                <IconBox>
                    <FaDove />
                </IconBox>
                <CardTitle>신고 내역이 없습니다</CardTitle>
                <CardBody>
                    <p>
                        아직 신고하신 내역이 없어요.
                        <br /> 불편사항이 있다면 언제든 알려주세요.
                    </p>
                    <ContactButton onClick={onGoContact}>문의하기로 이동</ContactButton>
                </CardBody>
            </EmptyCard>
        </Section>
    );
}

/* ====================== Styled Components ====================== */
const fadeUp = keyframes`
  from {
    opacity: 0;
    margin-top: 16px;
  }
  to {
    opacity: 1;
    margin-top: 0;
  }
`;

const Section = styled.section`
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 20px;
    animation: ${fadeUp} 0.6s ease both;
`;

const Header = styled.div`
    margin-bottom: 8px;
`;

const Title = styled.h2`
    font-size: 20px;
    font-weight: 700;
    color: #111827;
`;

const Desc = styled.p`
    font-size: 14px;
    color: #6b7280;
    margin-top: 4px;
`;

const ReportTable = styled.div`
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    overflow: hidden;
    background: #fff;
    margin-top: 12px;
    animation: ${fadeUp} 0.6s ease both;
`;

const TableHeader = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 1.2fr 1fr 1fr;
    align-items: center;
    text-align: center;
    padding: 18px 24px;
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    font-weight: 600;
    font-size: 14px;
    color: #374151;
`;

const TableRow = styled.div`
    display: grid;
    grid-template-columns: 1.2fr 1.2fr 1fr 1fr;
    align-items: center;
    text-align: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f1f3f5;
    transition: background 0.15s ease;

    &:hover {
        background: #f9fafb;
    }

    &:last-child {
        border-bottom: none;
    }
`;

const Cell = styled.div`
    font-size: 14px;
    color: #374151;
    line-height: 1.6;
`;

const Category = styled(Cell)`
    color: #2563eb;
    font-weight: 500;
`;

const Status = styled.span<{ color: string }>`
    font-size: 13px;
    font-weight: 600;
    color: ${({ color }) => color};
    background: ${({ color }) => `${color}15`};
    border-radius: 8px;
    padding: 5px 10px;
`;

const DateCell = styled(Cell)`
    color: #9ca3af;
    font-size: 13px;
    text-align: right;
`;

const StateBox = styled.div<{ color?: string }>`
    text-align: center;
    padding: 60px 0;
    color: ${({ color }) => color || "#6b7280"};
    font-size: 14px;
`;

/* ====================== Empty 스타일 ====================== */
const EmptyCard = styled.div`
    border: 1px solid #e5e7eb;
    border-radius: 16px;
    padding: 60px 32px;
    background: linear-gradient(180deg, #f9fafb 0%, #ffffff 100%);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.05);
    text-align: center;
    animation: fadeUp 0.6s ease both;
    transition: all 0.3s ease;
    animation: ${fadeUp} 0.6s ease both;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(37, 99, 235, 0.08);
    }
`;

const IconBox = styled.div`
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(37, 99, 235, 0.1); /* 동일한 연한 블루 */
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 10px auto; /* 멤버십 카드와 동일한 위/아래 간격 */

    svg {
        color: #2563eb; /* 동일한 진한 블루 */
        font-size: 28px; /* 동일한 아이콘 크기 */
    }
`;

const CardTitle = styled.h3`
    font-size: 18px;
    font-weight: 700;
    color: #1e3a8a;
    margin-bottom: 8px;
`;

const CardBody = styled.div`
    font-size: 15px;
    line-height: 1.8;
    color: #374151;
    text-align: center;

    p {
        margin: 0 0 20px 0;
    }
`;

const ContactButton = styled.button`
    background: #2563eb;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s ease;
    margin-top: 20px;

    &:hover {
        background: #1d4ed8;
    }
`;
