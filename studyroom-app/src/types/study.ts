export type StudyStatus = 'RECRUITING' | 'COMPLETED' | 'CLOSED';

export interface StudyRoom {
    id: number;
    title: string;
    description: string;
    maxMembers: number;
    status: StudyStatus;
    location: string;
    studyLevel: string;
    recruitingRoles: string[];
    skillStack: string[];
    createdAt: string;
    hostId: number;
    hostNickname: string;
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

export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'NOT_APPLIED';

export interface StudyApplication {
    applicationId: number | null;
    status: ApplicationStatus;
}

export interface Application {
    id: number;
    study: {
        id: number;
        title: string;
        location: string;
        recruitingRoles: string[];
    };
    status: ApplicationStatus;
    appliedAt: string;
}

export interface Schedule {
    id: number;
    authorId: number;
    authorNickname: string;
    title: string;
    description: string;
    start: Date;
    end: Date;
    startTime: string;
    endTime: string;
    myAttendanceStatus?: 'PENDING' | 'ATTENDED' | 'ABSENT';
}