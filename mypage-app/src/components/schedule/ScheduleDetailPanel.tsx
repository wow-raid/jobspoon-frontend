import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

type Props = {
    schedule: any | null;
    onClose: () => void;
};

export default function ScheduleDetailPanel({ schedule, onClose }: Props) {
    const navigate = useNavigate();
    const [width, setWidth] = useState(400);
    const resizing = useRef(false);

    const handleMoveToStudyRoom = () => {
        if (!schedule?.studyRoomId) return;
        navigate(`/studyroom/${schedule.studyRoomId}`);
    };

    const handleMouseDown = () => {
        resizing.current = true;
        document.body.style.cursor = "ew-resize";
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!resizing.current) return;
        const newWidth = window.innerWidth - e.clientX;
        setWidth(Math.min(Math.max(newWidth, 320), 800));
    };

    const handleMouseUp = () => {
        resizing.current = false;
        document.body.style.cursor = "default";
    };

    useEffect(() => {
        if (schedule) setWidth(400);
    }, [schedule]);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, []);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    if (!schedule) return null; // (안전 가드 추가)

    const isStudy = schedule.type === "study"; // 타입 구분 추가

    return (
        <AnimatePresence>
            {schedule && (
                <>
                    <Dim onClick={onClose} />
                    <Panel
                        as={motion.div}
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 70, damping: 15 }}
                        style={{ width }}
                    >
                        <Header $type={schedule.type}>
                            <h3>
                                {schedule.title}
                            </h3>
                            <CloseBtn onClick={onClose}>×</CloseBtn>
                        </Header>

                        <Content>
                            {schedule.description && (
                                <p className="desc">{schedule.description}</p>
                            )}

                            <Time>
                                🕒{" "}
                                {new Date(schedule.start).toLocaleString("ko-KR", {
                                    month: "long",
                                    day: "numeric",
                                    weekday: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}{" "}
                                ~{" "}
                                {new Date(schedule.end).toLocaleString("ko-KR", {
                                    month: "long",
                                    day: "numeric",
                                    weekday: "short",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Time>

                            {!isStudy && schedule.location && (
                                <Location>📍 {schedule.location}</Location>
                            )}
                        </Content>

                        <ButtonArea>
                            {isStudy ? (
                                <MoveButton onClick={handleMoveToStudyRoom}>
                                    스터디룸으로 이동하기 →
                                </MoveButton>
                            ) : (
                                <>
                                    <MoveButton>수정</MoveButton>
                                    <DeleteButton>삭제</DeleteButton>
                                </>
                            )}
                        </ButtonArea>

                        <ResizeHandle onMouseDown={handleMouseDown} />
                    </Panel>
                </>
            )}
        </AnimatePresence>
    );
}

/* ================== styled-components ================== */
const Dim = styled.div`
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.1);
    z-index: 20;
`;

const Panel = styled(motion.div)`
    position: absolute;
    top: 0;
    right: 0;
    height: 100%;
    background: #ffffff;
    border-left: 1px solid #e5e7eb;
    box-shadow: -4px 0 12px rgba(0, 0, 0, 0.05);
    border-radius: 16px 0 0 16px;
    display: flex;
    flex-direction: column;
    padding: 24px;
    z-index: 25;
`;

/* ✅ Header에 타입별 색상 분기 추가 */
const Header = styled.div<{ $type?: string }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 12px;
    h3 {
        font-size: 17px;
        font-weight: 700;
        color: ${({ $type }) =>
                $type === "study" ? "#047857" : "#1d4ed8"};
    }
`;

const CloseBtn = styled.button`
    font-size: 26px;
    background: #f3f4f6;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    color: #374151;
    cursor: pointer;
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

    /* ✅ 설명 스타일 추가 */
    .desc {
        font-size: 14px;
        line-height: 1.6;
        color: #374151;
        margin-bottom: 16px;
    }
`;

const Time = styled.div`
    font-size: 13px;
    color: #6b7280;
    margin-bottom: 8px;
`;

/* ✅ 장소 스타일 추가 */
const Location = styled.div`
    font-size: 13px;
    color: #6b7280;
`;

const ButtonArea = styled.div`
    border-top: 1px solid #e5e7eb;
    padding-top: 12px;
    margin-top: auto;
    display: flex;
    gap: 8px;
`;

const MoveButton = styled.button`
    flex: 1;
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

const DeleteButton = styled(MoveButton)`
    background: #ef4444;
    &:hover {
        background: #dc2626;
    }
`;

const ResizeHandle = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    cursor: ew-resize;
    background: transparent;
    &:hover {
        background: rgba(0, 0, 0, 0.05);
    }
`;
