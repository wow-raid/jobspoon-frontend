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
    hostId: number;
    currentMembers?: number;
    // 아래 필드들은 백엔드 응답에 맞춰 제거하거나 수정
    // job?: string;
    // category?: string;
    // postedAt?: string;
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    isPinned: boolean;
    createdAt: string;
    author: {
        id: number;
        nickname: string;
    };
    readBy?: number[];
}