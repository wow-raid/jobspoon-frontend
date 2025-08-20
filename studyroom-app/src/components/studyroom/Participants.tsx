import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { StudyMember, FAKE_STUDY_MEMBERS } from '../../data/mockData';
import '../../styles/Participants.css';

// 부모로부터 받을 context의 타입을 정의합니다.
interface StudyRoomContext {
    userRole: 'leader' | 'member';
    onLeaveOrClose: () => void;
}

const Participants: React.FC = () => {
    const { userRole, onLeaveOrClose } = useOutletContext<StudyRoomContext>();
    const [members, setMembers] = useState<StudyMember[]>([]);

    useEffect(() => {
        setMembers(FAKE_STUDY_MEMBERS);
    }, []);

    const handleKickMember = (memberId: string, memberName: string) => {
        if (window.confirm(`정말로 '${memberName}'님을 강퇴하시겠습니까?`)) {
            setMembers(prev => prev.filter(m => m.id !== memberId));
            console.log(`${memberId} 강퇴됨`);
        }
    };

    const leader = members.find(m => m.role === 'leader');
    const participants = members.filter(m => m.role === 'member');

    return (
        <div className="participants-container">
            <div className="participants-header">
                <h2>👥 참여인원 <span>({members.length}명)</span></h2>
            </div>

            <div className="participants-section">
                <h3 className="section-title">모임장</h3>
                {leader && (
                    <div className="member-item">
                        <div className="member-info">
                            <span className="member-name">{leader.name}</span>
                        </div>
                        <span className="member-role leader">모임장</span>
                    </div>
                )}
            </div>

            <div className="participants-section">
                <h3 className="section-title">참가자</h3>
                <div className="member-list">
                    {participants.length > 0 ? (
                        participants.map(p => (
                            <div key={p.id} className="member-item">
                                <div className="member-info">
                                    <span className="member-name">{p.name}</span>
                                </div>
                                <div className="member-actions">
                                    <span className="member-role member">참가자</span>
                                    {userRole === 'leader' && (
                                        <button className="kick-button" onClick={() => handleKickMember(p.id, p.name)}>
                                            강퇴하기
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-members-text">아직 참여한 멤버가 없습니다.</p>
                    )}
                </div>
            </div>

            <footer className="room-footer">
                <button className="leave-button" onClick={onLeaveOrClose}>
                    {userRole === 'leader' ? '스터디 폐쇄하기' : '탈퇴하기'}
                </button>
            </footer>
        </div>
    );
};

export default Participants;