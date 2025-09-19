// Announcements.tsx
import React, {useMemo, useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import axiosInstance from "../../api/axiosInstance";
import { Announcement } from "../../types/study";
import Modal from '../Modal';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementDetail from './AnnouncementDetail';
import { useAuth } from "../../hooks/useAuth";
import {NavLink, useOutletContext, useParams} from "react-router-dom";
import TabSearchBar from "./TabSearchBar";

interface StudyRoomContext {
    studyId: string;
    userRole: 'LEADER' | 'MEMBER' | null;
    studyStatus: 'RECRUITING' | 'COMPLETED' | 'CLOSED';
    handleLeaveOrClose: () => void;
}

/* --- NEW: Tab Navigation styled-components --- */
const NavContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid ${({ theme }) => theme.border};

    background-color: ${({ theme }) => theme.surface};
    padding: 12px 20px;
    border-radius: 8px;
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
/* --- End of Tab Navigation --- */


const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px 24px 8px;

    h2 {
        margin: 0;
        font-size: 20px;
        color: ${({ theme }) => theme.fg};

        span {
            font-size: 16px;
            font-weight: 500;
            color: ${({theme}) => theme.subtle};
            margin-left: 8px;
        }
    }
`;

const WriteBtn = styled.button`
  background-color: ${({ theme }) => theme.accent ?? theme.primary};
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  &:hover { background-color: ${({ theme }) => theme.accentHover ?? theme.primaryHover}; }
`;

const SearchInput = styled.input`
    width: 280px; /* 너비 조정 */
    padding: 8px 12px; /* 패딩 조정 */
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.inputBorder};
    background-color: ${({ theme }) => theme.inputBg};
    color: ${({ theme }) => theme.fg};
    font-size: 14px;
    box-sizing: border-box;
    &::placeholder { color: ${({ theme }) => theme.inputPlaceholder}; }

    &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.accent ?? theme.primary};
        box-shadow: 0 0 0 2px rgba(88,101,242,0.35);
    }
`;

const ListWrapper = styled.div`
  margin-top: 24px;
  background-color: ${({ theme }) => theme.surface};
  border-radius: 8px;
  padding: 24px;
  min-height: 300px;
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
`;

const Item = styled.div<{ $clickable?: boolean; $pinned?: boolean }>`
    background-color: ${({ theme, $pinned }) =>
            $pinned ? (theme.tagBg ?? theme.surfaceHover) : theme.surface };
    padding: 16px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: all 0.2s ease-in-out;
    overflow: hidden;

    display: flex;
    align-items: center;
    gap: 16px;

    ${({ theme, $pinned }) => ($pinned ? `border-left: 3px solid ${theme.accent ?? theme.primary};` : '')}
    ${({ $clickable }) => ($clickable ? 'cursor: pointer;' : '')}

    &:hover {
        ${({ theme, $clickable }) =>
                $clickable
                        ? `background-color: ${theme.surfaceHover}; transform: scale(1.01); border-color: ${theme.accent ?? theme.primary};`
                        : ''}
`;

const ItemMainContent = styled.div`
  flex-grow: 1;
  min-width: 0; /* 텍스트 ellipsis 위해 */
`;

const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
`;

const ItemTitle = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.fg};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const ItemMeta = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.subtle};
  flex-shrink: 0;
`;

const PinButton = styled.button<{ $pinned?: boolean }>`
    background-color: ${({ theme, $pinned }) => ($pinned ? (theme.accent ?? theme.primary) : theme.surfaceHover)};
    color: ${({ theme }) => theme.subtle};
    border: none;
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    flex-shrink: 0;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme, $pinned }) =>
                $pinned ? (theme.accentHover ?? theme.primaryHover) : theme.surfaceHover};
    }
`;

const Announcements: React.FC = () => {
    const { id: studyRoomId } = useParams<{ id: string }>();
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { userId } = useAuth();
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const [isLoadingDetail, setIsLoadingDetail] = useState(false)
    const { studyId, userRole, studyStatus, handleLeaveOrClose } = useOutletContext<StudyRoomContext>();

    const fetchAnnouncements = useCallback(async () => {
        if (!studyRoomId) return;
        try {
            const response = await axiosInstance.get(`/study-rooms/${studyRoomId}/announcements`);
            setAnnouncements(response.data);
        } catch (error) {
            console.error("공지사항 목록 로딩 실패:", error);
        }
    }, [studyRoomId]);

    const fetchUserRole = useCallback(async () => {
        if (!studyRoomId) return;
        try {
            const response = await axiosInstance.get(`/study-rooms/${studyRoomId}/role`);
            setCurrentUserRole(response.data);
        } catch (error) {
            console.error("스터디룸 역할 정보 로딩 실패:", error);
        }
    }, [studyRoomId]);

    useEffect(() => {
        if (studyRoomId) {
            fetchAnnouncements();
            fetchUserRole();
        }
    }, [studyRoomId, fetchAnnouncements, fetchUserRole]);

    // ✅ 2. 폼 제출 시 (새 글 / 수정) API 호출
    const handleFormSubmit = async (formData: { title: string; content: string }) => {
        if (!studyRoomId) return;
        try {
            if (editingAnnouncement) {
                await axiosInstance.put(`/study-rooms/${studyRoomId}/announcements/${editingAnnouncement.id}`, formData);
            } else {
                await axiosInstance.post(`/study-rooms/${studyRoomId}/announcements`, formData);
            }
            fetchAnnouncements();
            closeFormModal();
        } catch (error) {
            console.error("공지사항 저장 실패:", error);
            alert("공지사항 저장 중 오류가 발생했습니다.");
        }
    };

    // ✅ 2. handleViewDetail 함수를 API를 호출하는 비동기 함수로 수정
    const handleViewDetail = async (announcement: Announcement) => {
        // 먼저 목록의 기본 정보로 모달을 빠르게 엽니다.
        setSelectedAnnouncement(announcement);
        setIsDetailModalOpen(true);
        setIsLoadingDetail(true); // 로딩 시작

        try {
            // 상세 정보 API를 호출하여 'content'가 포함된 완전한 데이터를 가져옵니다.
            const response = await axiosInstance.get(
                `/study-rooms/${studyRoomId}/announcements/${announcement.id}`
            );
            // API 응답으로 state를 업데이트하여 화면을 갱신합니다.
            setSelectedAnnouncement(response.data);
        } catch (error) {
            console.error("공지사항 상세 정보를 불러오는데 실패했습니다:", error);
            alert("상세 정보를 불러오는 중 오류가 발생했습니다.");
            setIsDetailModalOpen(false); // 오류 발생 시 모달 닫기
        } finally {
            setIsLoadingDetail(false); // 로딩 종료 (성공/실패 모든 경우)
        }
    };

    const handlePinToggle = async (id: number) => { // async 추가
        try {
            // ✅ [추가] 백엔드에 변경 사항을 저장하도록 PATCH API 호출
            await axiosInstance.patch(`/study-rooms/${studyRoomId}/announcements/${id}/pin`);

            // API 호출이 성공하면 화면 상태를 변경
            setAnnouncements(prev =>
                prev.map(item => (item.id === id ? { ...item, isPinned: !item.isPinned } : item))
            );
        } catch (error) {
            console.error("고정 상태 변경에 실패했습니다:", error);
            alert("상태 변경 중 오류가 발생했습니다.");
        }
    };

    const openWriteModal = () => {
        setEditingAnnouncement(null);
        setIsWriteModalOpen(true);
    };

    const handleEditClick = () => {
        if (!selectedAnnouncement) return;
        setEditingAnnouncement(selectedAnnouncement);
        setIsDetailModalOpen(false);
        setIsWriteModalOpen(true);
    };

    const closeFormModal = () => {
        setIsWriteModalOpen(false);
        setEditingAnnouncement(null);
    };

    const handleDelete = async () => {
        if (!selectedAnnouncement) return;
        if (window.confirm('공지사항을 삭제하시겠습니까?')) {
            try {
                // ✅ 2. 백엔드에 삭제를 요청하는 DELETE API 호출
                await axiosInstance.delete(
                    `/study-rooms/${studyRoomId}/announcements/${selectedAnnouncement.id}`
                );
                // ✅ 3. API 호출이 성공하면 화면 상태를 업데이트하여 목록에서 제거
                setAnnouncements(prev => prev.filter(item => item.id !== selectedAnnouncement.id));
                setIsDetailModalOpen(false);
                setSelectedAnnouncement(null);

                alert("공지사항이 삭제되었습니다.");

            } catch (error) {
                console.error("공지사항 삭제에 실패했습니다:", error);
                alert("삭제 처리 중 오류가 발생했습니다.");
            }
        }
    };

    const handleMarkAsRead = async (announcementId: number) => {
        if (!studyRoomId || !userId) return;
        try {
            await axiosInstance.post(`/study-rooms/${studyRoomId}/announcements/${announcementId}/read`);
            const updateReadStatus = (item: Announcement) => {
                const newReadBy = [...(item.readBy || []), userId];
                return { ...item, readBy: newReadBy };
            };
            setAnnouncements(prev => prev.map(item => item.id === announcementId ? updateReadStatus(item) : item));
            setSelectedAnnouncement(prev => (prev ? updateReadStatus(prev) : null));
        } catch (error) {
            console.error("읽음 처리 중 오류 발생:", error);
        }
    };

    const displayedAnnouncements = useMemo(() => {
        return [...announcements]
            .sort((a, b) => {
                if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [announcements, searchTerm]);

    return (
        <Container>
            <Header>
                <h2>📢공지사항<span>({announcements.length})</span></h2>
                {currentUserRole === 'LEADER' && studyStatus !== 'CLOSED' &&
                    <WriteBtn onClick={openWriteModal}>글쓰기</WriteBtn>}
            </Header>

            <NavContainer>
                <TabList>
                    <TabLink to={`/studies/joined-study/${studyId}`} end>공지사항</TabLink>
                    <TabLink to={`/studies/joined-study/${studyId}/schedule`}>일정관리</TabLink>
                    <TabLink to={`/studies/joined-study/${studyId}/interview`}>모의면접</TabLink>
                    <TabLink to={`/studies/joined-study/${studyId}/members`}>참여인원</TabLink>
                    {userRole === 'LEADER' && (
                        <>
                        <TabLink to={`/studies/joined-study/${studyId}/applications`}>신청관리</TabLink>
                        <TabLink to={`/studies/joined-study/${studyId}/attendance`}>출석관리</TabLink>
                        </>
                    )}
                </TabList>
                <TabSearchBar
                    searchTerm={searchTerm}
                    onSearchChange={e => setSearchTerm(e.target.value)}
                    placeholder="공지사항 제목으로 검색..."
                />
            </NavContainer>

            <ListWrapper>
            <List>
                {displayedAnnouncements.length > 0 ? displayedAnnouncements.map(item => (
                    <Item key={item.id} $clickable $pinned={item.isPinned}>
                        <ItemMainContent onClick={() => handleViewDetail(item)}>
                            <ItemHeader>
                                <ItemTitle>{item.isPinned && '📌 '} {item.title}</ItemTitle>
                                <ItemMeta>{item.author.nickname} · {new Date(item.createdAt).toLocaleDateString()}</ItemMeta>
                            </ItemHeader>
                        </ItemMainContent>

                        {currentUserRole === 'LEADER' && studyStatus !== 'CLOSED' && (
                            <PinButton
                                $pinned={item.isPinned}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePinToggle(item.id);
                                }}
                                aria-pressed={item.isPinned}
                            >
                                {item.isPinned ? '고정 해제' : '상단 고정'}
                            </PinButton>
                        )}
                    </Item>
                )) : <p>작성된 공지사항이 없습니다.</p>}
            </List>
            </ListWrapper>

            <Modal isOpen={isWriteModalOpen} onClose={closeFormModal}>
                <AnnouncementForm
                    onSubmit={handleFormSubmit}
                    initialData={editingAnnouncement ? { title: editingAnnouncement.title, content: editingAnnouncement.content } : undefined}
                    isEditing={!!editingAnnouncement}
                />
            </Modal>

            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
                {isLoadingDetail ? (
                    <div>로딩 중...</div>
                ) : (
                    selectedAnnouncement && (
                        <AnnouncementDetail
                            announcement={selectedAnnouncement}

                            onEdit={studyStatus !== 'CLOSED' ? handleEditClick : undefined}
                            onDelete={studyStatus !== 'CLOSED' ? handleDelete : undefined}
                            currentUser={{ role: userRole, id: userId }}
                            onMarkAsRead={() => handleMarkAsRead(selectedAnnouncement.id)}
                        />
                    )
                )}
            </Modal>
        </Container>
    );
};

export default Announcements;
