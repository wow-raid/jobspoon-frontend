// AnnouncementDetail.tsx
import React from 'react';
import styled from 'styled-components';
import { Announcement} from "../../types/study";

interface CurrentUser {
    role: string | null;
    id: number | null;
}

interface AnnouncementDetailProps {
    announcement: Announcement;
    onEdit: () => void;       // 수정 버튼 클릭 핸들러
    onDelete: () => void;     // 삭제 버튼 클릭 핸들러
    currentUser: CurrentUser; // 현재 유저 정보
    onMarkAsRead: () => void; // 읽음 확인 핸들러
}

/* ─ styled-components (scoped) ─ */
const Container = styled.div`
  padding: 16px;
`;

const Header = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  padding-bottom: 16px;
  margin-bottom: 20px;

  h2 {
    margin: 0 0 8px 0;
    font-size: 22px;
    color: ${({ theme }) => theme.fg};
  }
`;

const Meta = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.subtle};
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
`;

const Content = styled.div``;

const ContentText = styled.p`
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
  margin: 0;
  color: ${({ theme }) => theme.fg};
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
`;

const Btn = styled.button`
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #fff;
`;

const EditBtn = styled(Btn)`
  background-color: ${({ theme }) => theme.surfaceHover};

  &:hover {
    filter: brightness(1.05);
  }
`;

const DeleteBtn = styled(Btn)`
  background-color: ${({ theme }) => theme.danger ?? '#ff6b6b'};

  &:hover { background-color: ${({ theme }) => theme.dangerHover ?? '#f05252'}; }
`;

const ReadLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.fg};

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: ${({ theme }) => theme.accent ?? theme.primary};
  }
`;

const ReadByList = styled.div`
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};

  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: ${({ theme }) => theme.subtle};
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.fg};
  }

  li {
    padding: 4px 0;
  }

  p {
    font-size: 14px;
    color: ${({ theme }) => theme.subtle};
    margin: 0;
  }
`;

/* ─ Component ─ */
const AnnouncementDetail: React.FC<AnnouncementDetailProps> = ({
    announcement,
    onEdit,
    onDelete,
    currentUser,
    onMarkAsRead,
}) => {
    const hasRead = currentUser.id !== null && announcement.readBy?.includes(currentUser.id);

    return (
        <Container>
            <Header>
                <h2>{announcement.isPinned && '📌 '} {announcement.title}</h2>
                <Meta>
                    <span>작성자: {announcement.author.nickname}</span>
                    <span>작성일: {new Date(announcement.createdAt).toLocaleString()}</span>
                </Meta>
            </Header>

            <Content>
                <ContentText>{announcement.content}</ContentText>
            </Content>

            <Actions>
                {currentUser.role === 'LEADER' ? (
                    <>
                        <EditBtn onClick={onEdit}>수정</EditBtn>
                        <DeleteBtn onClick={onDelete}>삭제</DeleteBtn>
                    </>
                ) : (
                    <ReadLabel>
                        <input
                            type="checkbox"
                            checked={!!hasRead}
                            onChange={onMarkAsRead}
                            disabled={!!hasRead}
                        />
                        {hasRead ? '✔ 확인했습니다.' : '내용을 확인했습니다.'}
                    </ReadLabel>
                )}
            </Actions>

            {currentUser.role === 'LEADER' && (
                <ReadByList>
                    <h4>읽은 사람 ({announcement.readBy?.length || 0}명)</h4>
                    {announcement.readBy && announcement.readBy.length > 0 ? (
                        <ul>
                            {announcement.readBy.map((user) => (
                                <li key={user}>{user}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>아직 읽은 사람이 없습니다.</p>
                    )}
                </ReadByList>
            )}
        </Container>
    );
};

export default AnnouncementDetail;
