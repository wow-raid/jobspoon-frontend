import styled from "styled-components";
import { NavLink, useOutletContext } from "react-router-dom";
import {useCallback, useEffect, useState} from "react";
import {Schedule} from "../../types/study";
import axiosInstance from "../../api/axiosInstance";

type AttendanceStatus = 'PENDING' | 'ATTENDED' | 'ABSENT';

interface Attendance {
    studyMemberId: number;
    nickname: string;
    status: AttendanceStatus;
}

interface StudyRoomContext {
    studyId: string;
    userRole: 'LEADER' | 'MEMBER';
}

// 탭 네비게이션 스타일 컴포넌트
const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.surface};
    padding: 12px 20px;
    border-radius: 8px;
    margin-bottom: 24px; // ✅ [추가] 하단 컨텐츠와 간격
`;

const TabList = styled.nav`
  display: flex;
  gap: 8px;
`;

const TabLink = styled(NavLink)`
  padding: 10px 16px;
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.subtle};
  text-decoration: none;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.fg};
  }

  &.active {
    color: ${({ theme }) => theme.accent ?? theme.primary};
    border-bottom-color: ${({ theme }) => theme.accent ?? theme.primary};
  }
`;

// styled component
const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

const Header = styled.h2`
    margin: 0;
    font-size: 20px;
    color: ${({ theme }) => theme.fg};
`;

const ScheduleSelector = styled.select`
    padding: 10px;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.inputBorder};
    background-color: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.fg};
    font-size: 16px;
`;

const AttendanceTable = styled.div`
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 8px;
    overflow: hidden;
`;

const TableRow = styled.div`
    display: flex;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.border};
    &:last-child {
        border-bottom: none;
    }
`;

const TableHeader = styled(TableRow)`
    background-color: ${({ theme }) => theme.surfaceHover};
    font-weight: bold;
`;

const Cell = styled.div`
    padding: 12px 16px;
    flex-basis: 0;
`;

const NicknameCell = styled(Cell)`
    flex-grow: 2;
`;

const StatusCell = styled(Cell)`
    flex-grow: 1;
    text-align: center;
`;

const ActionCell = styled(Cell)`
    flex-grow: 2;
    display: flex;
    justify-content: center;
    gap: 8px;
`;

const RadioLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
`;

const SaveButton = styled.button`
    align-self: flex-end;
    padding: 10px 20px;
    background-color: ${({ theme }) => theme.accent};
    color: white;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    &:hover {
        background-color: ${({theme}) => theme.accentHover};
    }
`;

// component
const AttendanceManagement: React.FC = () => {
    const { studyId, userRole } = useOutletContext<StudyRoomContext>();
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [selectedScheduleId, setSelectedScheduleId] = useState<string>('');
    const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // 1. 스터디의 모든 일정 목록을 불러오는 함수
    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axiosInstance.get(`/study-rooms/${studyId}/schedules`);
                setSchedules(response.data);
                if (response.data.length > 0) {
                    setSelectedScheduleId(response.data[0].id.toString());
                }
            } catch (error) {
                console.error("일정 목록 로딩 실패:", error);
            }
        };
        fetchSchedules();
    }, [studyId]);

    // 2. 선택된 일정의 출석 현황을 불러오는 함수
    const fetchAttendance = useCallback(async () => {
        if (!selectedScheduleId) return;
        setIsLoading(true);
        try {
            const response = await axiosInstance.get(`/schedules/${selectedScheduleId}/attendance`);
            setAttendanceList(response.data);
        } catch (error) {
            console.error("출석 현황 로딩 실패:", error);
            setAttendanceList([]);
        } finally {
            setIsLoading(false);
        }
    }, [selectedScheduleId]);

    useEffect(() => {
        fetchAttendance();
    }, [fetchAttendance]);

    // 3. 리더가 멤버의 출석 상태를 변경하는 핸들러
    const handleStatusChange = (memberId: number, newStatus: AttendanceStatus) => {
        setAttendanceList(prevList =>
            prevList.map(item =>
                item.studyMemberId === memberId ? { ...item, status: newStatus } : item
            )
        );
    };

    // 4. 변경된 출석 상태를 서버에 저장하는 함수
    const handleConfirmAttendance = async () => {
        if (!selectedScheduleId) return;
        try {
            const payload = attendanceList.map(({ studyMemberId, status }) => ({
                studyMemberId,
                status,
            }));
            await axiosInstance.patch(`/schedules/${selectedScheduleId}/attendance`, payload);
            alert("출석 정보가 성공적으로 업데이트되었습니다.");
            fetchAttendance(); // 최신 정보 다시 불러오기
        } catch (error) {
            console.error("출석 정보 업데이트 실패:", error);
            alert("업데이트 중 오류가 발생했습니다.");
        }
    };

    return (
        <div>
            <Header>출석 관리</Header>

            <NavContainer>
                <TabList>
                    <TabLink to={`/studies/joined-study/${studyId}`} end>공지사항</TabLink>
                    <TabLink to={`/studies/joined-study/${studyId}/schedule`}>일정관리</TabLink>
                    <TabLink to={`/studies/joined-study/${studyId}/interview`}>모의면접</TabLink>
                    <TabLink to={`/studies/joined-study/${studyId}/members`}>참여인원</TabLink>
                    {userRole === 'LEADER' && (
                        <>
                            <TabLink to={`/studies/joined-study/${studyId}/applications`}>신청 관리</TabLink>
                            <TabLink to={`/studies/joined-study/${studyId}/attendance`}>출석 관리</TabLink>
                        </>
                    )}
                </TabList>
            </NavContainer>

        <Container>
            <ScheduleSelector
                value={selectedScheduleId}
                onChange={(e) => setSelectedScheduleId(e.target.value)}
                >
                <option value="">-- 일정 선택 --</option>
                {schedules.map(schedule => (
                    <option key={schedule.id} value={schedule.id}>
                        {schedule.title} ({new Date(schedule.start).toLocaleDateString()})
                    </option>
                ))}
            </ScheduleSelector>

            <AttendanceTable>
                <TableHeader>
                    <NicknameCell> 닉네임 </NicknameCell>
                    <StatusCell> 멤버 체크 상태 </StatusCell>
                    <ActionCell> 최종 처리 </ActionCell>
                </TableHeader>
                {isLoading ? (

                    <div>로딩 중....</div>
                ) : (
                    attendanceList.map(item => (
                        <TableRow key={item.studyMemberId}>
                            <NicknameCell> {item.nickname} </NicknameCell>
                            <StatusCell> {item.status === 'PENDING' ? '참석' : item.status} </StatusCell>
                            <ActionCell>
                                <RadioLabel>
                                    <input type="radio" name={`status-${item.studyMemberId}`} checked={item.status === 'ATTENDED'} onChange={() => handleStatusChange(item.studyMemberId, 'ATTENDED')} />
                                    출석
                                </RadioLabel>
                                <RadioLabel>
                                    <input type="radio" name={`status-${item.studyMemberId}`} checked={item.status === 'ABSENT'} onChange={() => handleStatusChange(item.studyMemberId, 'ABSENT')} />
                                    결석
                                </RadioLabel>
                            </ActionCell>
                        </TableRow>
                    ))
                )}
            </AttendanceTable>

            <SaveButton onClick={handleConfirmAttendance}>
                변경사항 저장
            </SaveButton>
        </Container>
        </div>
    );
};

export default AttendanceManagement;