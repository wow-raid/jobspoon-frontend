import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

type Props = {
    schedule: any | null;
    onClose: () => void;
};

export default function ScheduleDetailPanel({ schedule, onClose }: Props) {
    const navigate = useNavigate();

    const handleMoveToStudyRoom = () => {
        if (!schedule?.studyRoomId) return;
        navigate(`/studyroom/${schedule.studyRoomId}`);
    };

    return (
        <AnimatePresence>
            {schedule && (
                <>
                    {/* 반투명 배경 (살짝만 어둡게 유지) */}
                    <Dim onClick={onClose} />

                    <Panel
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 70, damping: 15 }}
                    >
                        <Header>
                            <h3>{schedule.studyRoomTitle}</h3>
                            <CloseBtn onClick={onClose}>×</CloseBtn>
                        </Header>

                        <Content>
                            <h2>{schedule.title}</h2>
                            <p>{schedule.description}</p>
                            <Time>
                                🕒{" "}
                                {new Date(schedule.start).toLocaleString("ko-KR", {
                                    month: "long",
                                    day: "numeric",
                                    weekday: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                                <br />~{" "}
                                {new Date(schedule.end).toLocaleString("ko-KR", {
                                    month: "long",
                                    day: "numeric",
                                    weekday: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Time>
                        </Content>

                        <ButtonArea>
                            <MoveButton onClick={handleMoveToStudyRoom}>
                                스터디룸으로 이동하기 →
                            </MoveButton>
                        </ButtonArea>
                    </Panel>
                </>
            )}
        </AnimatePresence>
    );
}

/* ================== styled-components ================== */
const Dim = styled.div`
    position: absolute; /* 🔹 전체 fixed 대신 캘린더 내부 기준 */
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.1); /* 🔹 너무 어둡지 않게 */
    z-index: 20;
`;

const Panel = styled(motion.div)`
    position: absolute;
    top: 0;
    right: 0;
    width: 360px; /* 🔹 전체보다 살짝 좁게 */
    height: 100%;
    background: #ffffff;
    border-left: 1px solid #e5e7eb;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.05);
    border-radius: 16px 0 0 16px; /* 🔹 오른쪽 둥근 모서리 */
    display: flex;
    flex-direction: column;
    padding: 24px;
    z-index: 25;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 12px;
`;

const CloseBtn = styled.button`
    font-size: 26px;
    font-weight: 400;
    background: #f3f4f6;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    color: #374151;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    &:hover {
        background: #e5e7eb;
        transform: scale(1.1);
    }
`;

const Content = styled.div`
    margin-top: 16px;
    flex: 1;
    overflow-y: auto;

    h2 {
        font-size: 18px;
        font-weight: 700;
        color: #1f2937;
        margin-bottom: 8px;
    }

    p {
        font-size: 14px;
        line-height: 1.5;
        color: #374151;
        margin-bottom: 12px;
    }
`;

const Time = styled.div`
    font-size: 13px;
    color: #6b7280;
`;

const ButtonArea = styled.div`
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
    margin-top: auto;
`;

const MoveButton = styled.button`
    width: 100%;
    padding: 12px;
    background: #3b82f6;
    color: white;
    font-weight: 600;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
    &:hover {
        background: #2563eb;
    }
`;
