export interface StudyRoom {
    id: number;
    status: 'recruiting' | 'closed'; // 모집중 | 마감
    location: string;
    job: string;
    category: string;
    title: string;
    host: string;
    postedAt: string;
    roles: string[];
    requirements: string[];
    tags: string[];
    currentMembers: number;
    maxMembers: number;
    description?: string;
}