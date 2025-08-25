// MyStudiesPage.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { StudyRoom } from "../types/study";
import { FAKE_STUDY_ROOMS } from "../data/mockData";
import JoinedStudyRoomList from "../components/JoinedStudyRoomList.tsx";

const Page = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2rem;
  text-align: center;
  margin-bottom: 40px;
  color: #fff;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const EmptyBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 80px 20px;
  background-color: #2c2f3b;
  border-radius: 8px;
  border: 1px dashed #4a4e59;

  p {
    font-size: 16px;
    color: #8c92a7;
    margin: 0;
  }
`;

const MY_STUDY_IDS = [2, 5, 8, 10, 16, 19];

const MyStudiesPage: React.FC = () => {
    const [myStudies, setMyStudies] = useState<StudyRoom[]>([]);

    useEffect(() => {
        const joinedStudies = FAKE_STUDY_ROOMS.filter((room) =>
            MY_STUDY_IDS.includes(room.id)
        );
        setMyStudies(joinedStudies);
    }, []);

    return (
        <Page>
            <Title>참여중인 면접스터디 목록</Title>

            {myStudies.length > 0 ? (
                <ListContainer>
                    {myStudies.map((room) => (
                        <JoinedStudyRoomList key={room.id} room={room} />
                    ))}
                </ListContainer>
            ) : (
                <EmptyBox>
                    <p>참여 중인 면접스터디 모임이 없습니다.</p>
                </EmptyBox>
            )}
        </Page>
    );
};

export default MyStudiesPage;
