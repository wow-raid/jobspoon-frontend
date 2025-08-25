// Announcements.tsx
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { FAKE_ANNOUNCEMENTS, Announcement } from '../../data/mockData';
import Modal from '../Modal';
import AnnouncementForm from './AnnouncementForm';
import AnnouncementDetail from './AnnouncementDetail';

// 로그인 되었다는 가정하에 버튼 유무, 읽음 유무 테스트
const CURRENT_USER_ROLE = 'leader'; // 'leader' | 'member'
const CURRENT_USER_ID = '모임장';

const Container = styled.div`
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #3e414f;
  padding-bottom: 16px;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 20px;
    color: #fff;
  }
`;

const WriteBtn = styled.button`
  background-color: #5865f2;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 14px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
`;

const SearchBar = styled.div`
  margin-bottom: 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  border-radius: 6px;
  border: 1px solid #3e414f;
  background-color: #1e2129;
  color: #d1d5db;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #5865f2;
    box-shadow: 0 0 0 2px rgba(88, 101, 242, 0.35);
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Item = styled.div<{ $clickable?: boolean; $pinned?: boolean }>`
  background-color: ${({ $pinned }) => ($pinned ? 'rgba(88, 101, 242, 0.1)' : '#1e2129')};
  padding: 16px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  overflow: hidden;

  display: flex;
  align-items: center;
  gap: 16px;

  ${({ $pinned }) => ($pinned ? 'border-left: 3px solid #5865f2;' : '')}
  ${({ $clickable }) => ($clickable ? 'cursor: pointer;' : '')}

  &:hover {
    ${({ $clickable }) => ($clickable ? 'background-color: #24262d; transform: scale(1.02); border-color: #5865f2;' : '')}
  }
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
  color: #e0e0e0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
`;

const ItemMeta = styled.span`
  font-size: 12px;
  color: #8c92a7;
  flex-shrink: 0;
`;

const PinButton = styled.button<{ $pinned?: boolean }>`
  background-color: ${({ $pinned }) => ($pinned ? '#5865f2' : '#3a3f4c')};
  color: ${({ $pinned }) => ($pinned ? '#ffffff' : '#d1d5db')};
  border: none;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  flex-shrink: 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ $pinned }) => ($pinned ? '#5865f2' : '#4b5563')};
  }
`;

const Announcements: React.FC = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>(FAKE_ANNOUNCEMENTS);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const currentUser = {
        role: CURRENT_USER_ROLE as 'leader' | 'member',
        id: CURRENT_USER_ID,
    };

    // 1) 폼 제출 (새 글 / 수정)
    const handleFormSubmit = (formData: { title: string; content: string }) => {
        if (editingAnnouncement) {
            setAnnouncements(prev =>
                prev.map(item => (item.id === editingAnnouncement.id ? { ...item, ...formData } : item)),
            );
        } else {
            const newAnnouncement: Announcement = {
                id: Date.now(),
                author: currentUser.id,
                createdAt: new Date(),
                pinned: false,
                readBy: [],
                ...formData,
            };
            setAnnouncements(prev => [newAnnouncement, ...prev]);
        }
        closeFormModal();
    };

    const handleViewDetail = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsDetailModalOpen(true);
    };

    const handlePinToggle = (id: number) => {
        setAnnouncements(prev => prev.map(item => (item.id === id ? { ...item, pinned: !item.pinned } : item)));
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

    const handleMarkAsRead = () => {
        if (!selectedAnnouncement) return;
        setAnnouncements(prev =>
            prev.map(item => {
                if (item.id === selectedAnnouncement.id && !item.readBy?.includes(currentUser.id)) {
                    const newReadBy = [...(item.readBy || []), currentUser.id];
                    setSelectedAnnouncement(prevSelected => (prevSelected ? { ...prevSelected, readBy: newReadBy } : null));
                    return { ...item, readBy: newReadBy };
                }
                return item;
            }),
        );
    };

    const displayedAnnouncements = useMemo(() => {
        return [...announcements]
            .sort((a, b) => {
                if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            })
            .filter(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [announcements, searchTerm]);

    return (
        <Container>
            <Header>
                <h2>📢 공지사항</h2>
                {currentUser.role === 'leader' && (
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
                    <Item key={item.id} $clickable $pinned={item.pinned}>
                        <ItemMainContent onClick={() => handleViewDetail(item)}>
                            <ItemHeader>
                                <ItemTitle>
                                    {item.pinned && '📌 '} {item.title}
                                </ItemTitle>
                                <ItemMeta>
                                    {item.author} · {new Date(item.createdAt).toLocaleDateString()}
                                </ItemMeta>
                            </ItemHeader>
                        </ItemMainContent>

                        {currentUser.role === 'leader' && (
                            <PinButton
                                $pinned={item.pinned}
                                onClick={e => {
                                    e.stopPropagation();
                                    handlePinToggle(item.id);
                                }}
                                aria-pressed={item.pinned}
                            >
                                {item.pinned ? '고정 해제' : '상단 고정'}
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
                        currentUser={currentUser}
                        onMarkAsRead={handleMarkAsRead}
                    />
                )}
            </Modal>
        </Container>
    );
};

export default Announcements;
