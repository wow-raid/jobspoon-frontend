// SuccessPage.tsx
import React from 'react';
import styled from 'styled-components';
import { useLocation, Link } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  min-height: 60vh;
`;

const Icon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #ffffff;
  margin: 0 0 16px 0;
`;

const Message = styled.p`
  font-size: 1.1rem;
  color: #d1d5db;
  margin-bottom: 32px;
`;

const HomeButton = styled(Link)`
  background-color: #6366f1;
  color: #ffffff;
  text-decoration: none;
  border: none;
  border-radius: 8px;
  padding: 12px 32px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #4f46e5;
  }
`;

const SuccessPage: React.FC = () => {
    const location = useLocation() as { state?: { title?: string } };
    const studyTitle = location.state?.title ?? '스터디';

    return (
        <Container>
            <Icon>✅</Icon>
            <Title>참가 신청 완료!</Title>
            <Message>
                <strong>'{studyTitle}'</strong> 스터디 참가 신청이 정상적으로 완료되었습니다.
            </Message>
            <HomeButton to="/">홈으로 돌아가기</HomeButton>
        </Container>
    );
};

export default SuccessPage;
