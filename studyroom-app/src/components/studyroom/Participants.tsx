import React, { useState, useEffect } from 'react';
import { StudyMember, FAKE_STUDY_MEMBERS } from '../../data/mockData';
import '../../styles/Participants.css';

const Participants: React.FC = () => {
    const [members, setMembers] = useState<StudyMember[]>([]);

    useEffect(() => {
        setMembers(FAKE_STUDY_MEMBERS);
    }, []);

    // 모임장과 참가자를 분리합니다.
    const leader = members.find(m => m.role === 'leader');
    const participants = members.filter(m => m.role === 'member');

    return (
        <div className="participants-container">
            <div className="participants-header">
                <h2>👥 참여인원 <span>({members.length}명)</span></h2>
            </div>

            {/* 모임장 섹션 */}
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

            {/* 참가자 섹션 */}
            <div className="participants-section">
                <h3 className="section-title">참가자</h3>
                <div className="member-list">
                    {participants.length > 0 ? (
                        participants.map(p => (
                            <div key={p.id} className="member-item">
                                <div className="member-info">
                                    <span className="member-name">{p.name}</span>
                                </div>
                                <span className="member-role member">참가자</span>
                            </div>
                        ))
                    ) : (
                        <p className="no-members-text">아직 참여한 멤버가 없습니다.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Participants;