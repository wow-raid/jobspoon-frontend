// Announcements.tsx
import React, {useMemo, useState, useCallback, useEffect} from 'react';
import styled from 'styled-components';
import axiosInstance from "../../api/axiosInstance";
import { Announcement } from "../../types/study";
import Modal from '../Modal';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementDetail from './AnnouncementDetail';
import { useAuth } from "../../hooks/useAuth";
import { useParams } from "react-router-dom";

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 16px;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 20px;
    color: ${({ theme }) => theme.fg};
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

const SearchBar = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
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
  color: #fff;
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

    const fetchAnnouncements = useCallback(async () => {
        if (!studyRoomId) return;
        try {
            const response = await axiosInstance.get(`/study-rooms/${studyRoomId}/announcements`);
            setAnnouncements(response.data);
        } catch (error) {
            console.error("공지사항 목록을 불러오는데 실패했습니다:", error);
        }
    }, [studyRoomId]);

    const fetchUserRole = useCallback(async () => {
        if (!studyRoomId) return;
        try {
            const response = await axiosInstance.get(`/study-rooms/${studyRoomId}/role`);
            setCurrentUserRole(response.data); // "LEADER" 또는 "MEMBER" 문자열이 저장됩니다.
            console.log("Fetched user role:", response.data);
        } catch (error) {
            console.error("스터디룸 역할 정보를 불러오는데 실패했습니다:", error);
            setCurrentUserRole(null); // 에러 발생 시 null로 설정
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
            console.error("공지사항 저장에 실패했습니다:", error);
            alert("오류가 발생했습니다.");
        }
    };

    const handleViewDetail = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDetailModalOpen(true);
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

    const handleEditClick = () => {
        if (!selectedAnnouncement) return;
        setEditingAnnouncement(selectedAnnouncement);
        setIsDetailModalOpen(false);
        setIsWriteModalOpen(true);
    };

    // 2) 폼 모달 닫기 + 수정상태 초기화
    const closeFormModal = () => {
        setIsWriteModalOpen(false);
        setEditingAnnouncement(null);
    };

    const handleDelete = () => {
        if (!selectedAnnouncement) return;
        if (window.confirm('공지사항을 삭제하시겠습니까?')) {
            setAnnouncements(prev => prev.filter(item => item.id !== selectedAnnouncement.id));
            setIsDetailModalOpen(false);
            setSelectedAnnouncement(null);
        }
    };

    const handleMarkAsRead = async (announcementId: number) => {
        if (!studyRoomId || !userId) return;

        try {
            await axiosInstance.post(`/study-rooms/${studyRoomId}/announcements/${announcementId}/read`);
            setAnnouncements(prev =>
                prev.map(item => {
                    if (item.id === announcementId) {
                        const newReadBy = [...(item.readBy || []), userId];
                        return { ...item, readBy: newReadBy };
                    }
                    return item;
                })
            );
            setSelectedAnnouncement(prev => (prev ? { ...prev, readBy: [...(prev.readBy || []), userId] } : null));
        } catch (error) {
            console.error("읽음 처리 중 오류가 발생했습니다:", error);
            alert("오류가 발생했습니다.");
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
                <h2>📢 공지사항</h2>
                {currentUserRole === 'LEADER' && (
                    <WriteBtn
                        onClick={() => {
                            setEditingAnnouncement(null);
                            setIsWriteModalOpen(true);
                        }}
                    >
                        글쓰기
                    </WriteBtn>
                )}
            </Header>

            <SearchBar>
                <SearchInput
                    type="text"
                    placeholder="공지사항 제목으로 검색"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    aria-label="공지사항 검색"
                />
            </SearchBar>

            <List>
                {displayedAnnouncements.map(item => (
                    <Item key={item.id} $clickable $pinned={item.isPinned}>
                        <ItemMainContent onClick={() => handleViewDetail(item)}>
                            <ItemHeader>
                                <ItemTitle>
                                    {item.isPinned && '📌 '} {item.title}
                                </ItemTitle>
                                <ItemMeta>
                                    {item.author.nickname} · {new Date(item.createdAt).toLocaleDateString()}
                                </ItemMeta>
                            </ItemHeader>
                        </ItemMainContent>

                        {currentUserRole === 'LEADER' && (
                            <PinButton
                                $pinned={item.isPinned}
                                onClick={e => {
                                    e.stopPropagation();
                                    handlePinToggle(item.id);
                                }}
                                aria-pressed={item.isPinned}
                            >
                                {item.isPinned ? '고정 해제' : '상단 고정'}
                            </PinButton>
                        )}
                    </Item>
                ))}
            </List>

            <Modal isOpen={isWriteModalOpen} onClose={closeFormModal}>
                <AnnouncementForm
                    onSubmit={handleFormSubmit}
                    initialData={
                        editingAnnouncement
                            ? { title: editingAnnouncement.title, content: editingAnnouncement.content }
                            : undefined
                    }
                />
            </Modal>

            <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)}>
                {selectedAnnouncement && (
                    <AnnouncementDetail
                        announcement={selectedAnnouncement}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                        currentUser={{ role: currentUserRole, id: userId }}
                        onMarkAsRead={() => handleMarkAsRead(selectedAnnouncement.id)}
                    />
                )}
            </Modal>
        </Container>
    );
};

export default Announcements;
