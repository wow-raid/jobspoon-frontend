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
                    <Dim onClick={onClose} />
                    <Panel
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
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
                                🕒 {new Date(schedule.start).toLocaleString()}
                                <br />~ {new Date(schedule.end).toLocaleString()}
                            </Time>
                        </Content>

                        <ButtonArea>
                            <MoveButton onClick={handleMoveToStudyRoom}>
                                스터디룸으로 이동하기
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
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.25);
    z-index: 9;
`;

const Panel = styled(motion.div)`
    position: fixed;
    top: 0;
    right: 0;
    width: 380px;
    height: 100%;
    background: #fff;
    z-index: 10;
    box-shadow: -4px 0 8px rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    padding: 24px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 12px;
`;

const CloseBtn = styled.button`
    font-size: 22px;
    background: none;
    border: none;
    cursor: pointer;
    color: #9ca3af;
    transition: color 0.2s;
    &:hover {
        color: #111827;
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