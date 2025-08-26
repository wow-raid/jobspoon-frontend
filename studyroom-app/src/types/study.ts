export interface StudyRoom {
    id: number;
    title: string;
    description: string;
    maxMembers: number;
    status: 'RECRUITING' | 'CLOSED';
    location: string;
    studyLevel: string;
    recruitingRoles: string[];
    skillStack: string[];
    createdAt: string;
    host?: { // host 정보는 객체일 수 있으므로 optional object로 정의
        nickname: string;
    };
    // 아래 필드들은 백엔드 응답에 맞춰 제거하거나 수정
    // job?: string;
    // category?: string;
    // postedAt?: string;
    // currentMembers?: number;
}