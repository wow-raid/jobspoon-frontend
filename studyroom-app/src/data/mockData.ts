import { StudyRoom } from '../types/study';

export const FAKE_STUDY_ROOMS: StudyRoom[] = [
    // 프론트엔드 (5개)
    { id: 1, status: 'recruiting', location: '온라인', job: '프론트엔드', category: '프론트엔드', title: 'React 19 최신 기능 스터디', host: 'ReactDev', postedAt: '방금 전', roles: ['주니어', '시니어'], requirements: ['React 경험'], tags: ['#React19', '#Concurrent'], currentMembers: 2, maxMembers: 5, description: 'React의 최신 Concurrent Features와 서버 컴포넌트를 함께 학습합니다.' },
    { id: 2, status: 'recruiting', location: '서울', job: '프론트엔드', category: '프론트엔드', title: 'TypeScript 기반 실전 프로젝트', host: '타입마스터', postedAt: '3일 전', roles: ['프론트엔드 개발자'], requirements: ['TypeScript 기본'], tags: ['#TypeScript', '#실전'], currentMembers: 3, maxMembers: 4, description: '타입스크립트를 사용하여 실무 수준의 프로젝트를 진행합니다.' },
    { id: 3, status: 'closed', location: '경기', job: '프론트엔드', category: '프론트엔드', title: 'Vue.js 스터디 (마감)', host: '뷰장인', postedAt: '1주 전', roles: ['스터디원'], requirements: ['JavaScript 중급'], tags: ['#VueJS', '#마감'], currentMembers: 5, maxMembers: 5, description: 'Vue.js Composition API 심화 스터디입니다. 모집이 마감되었습니다.' },
    { id: 4, status: 'recruiting', location: '온라인', job: '프론트엔드', category: '프론트엔드', title: '웹 성능 최적화 Deep Dive', host: '성능개선', postedAt: '2주 전', roles: ['프론트엔드 개발자'], requirements: ['성능 측정 경험'], tags: ['#WebPerf', '#CoreWebVitals'], currentMembers: 1, maxMembers: 4, description: '웹사이트의 로딩 속도와 렌더링 성능을 극한으로 끌어올리는 방법을 연구합니다.' },
    { id: 5, status: 'recruiting', location: '부산', job: '프론트엔드', category: '프론트엔드', title: 'Next.js 앱 라우터 마스터', host: 'Next고수', postedAt: '1달 전', roles: ['팀원'], requirements: ['React 경험자'], tags: ['#NextJS', '#AppRouter'], currentMembers: 2, maxMembers: 4, description: 'Next.js의 앱 라우터를 중심으로 프로젝트를 구성하고 배포까지 경험합니다.' },

    // 백엔드 (5개)
    { id: 6, status: 'recruiting', location: '온라인', job: '백엔드', category: '백엔드', title: 'Kotlin & Spring Boot MSA', host: '코틀린러버', postedAt: '2시간 전', roles: ['백엔드 개발자'], requirements: ['Spring 경험'], tags: ['#Kotlin', '#MSA'], currentMembers: 1, maxMembers: 4, description: 'Kotlin과 Spring Cloud를 활용한 마이크로서비스 아키텍처를 학습합니다.' },
    { id: 7, status: 'closed', location: '서울', job: '백엔드', category: '백엔드', title: '대용량 트래픽 처리 설계 (마감)', host: '설계고수', postedAt: '4일 전', roles: ['경력자'], requirements: ['백엔드 3년 이상'], tags: ['#분산시스템', '#설계'], currentMembers: 4, maxMembers: 4, description: '대규모 사용자를 감당할 수 있는 시스템 설계에 대해 토론합니다.' },
    { id: 8, status: 'recruiting', location: '경기', job: '백엔드', category: '백엔드', title: 'Node.js 클린 아키텍처', host: '노드마스터', postedAt: '1주 전', roles: ['백엔드 개발자'], requirements: ['Node.js 경험'], tags: ['#NodeJS', '#클린아키텍처'], currentMembers: 2, maxMembers: 4, description: '헥사고날 아키텍처를 적용하여 유지보수성이 높은 서버를 구축합니다.' },
    { id: 9, status: 'recruiting', location: '온라인', job: '백엔드', category: '백엔드', title: '실용적인 Go 언어 스터디', host: '고퍼', postedAt: '2주 전', roles: ['서버 개발자'], requirements: ['프로그래밍 경험'], tags: ['#Go', '#Golang'], currentMembers: 1, maxMembers: 5, description: 'Go 언어의 기본 문법부터 동시성 프로그래밍까지 학습합니다.' },
    { id: 10, status: 'recruiting', location: '대구', job: '백엔드', category: '백엔드', title: 'NestJS 기반 API 서버 개발', host: '둥지개발자', postedAt: '3주 전', roles: ['백엔드 개발자'], requirements: ['TypeScript 경험'], tags: ['#NestJS', '#TypeScript'], currentMembers: 3, maxMembers: 5, description: 'NestJS 프레임워크를 사용하여 효율적인 API 서버를 만들어봅니다.' },

    // 모바일 (4개)
    { id: 11, status: 'recruiting', location: '서울', job: '안드로이드', category: '모바일', title: 'Jetpack Compose 실전', host: '안드대장', postedAt: '5일 전', roles: ['안드로이드 개발자'], requirements: ['Kotlin 경험'], tags: ['#Android', '#Compose'], currentMembers: 1, maxMembers: 3, description: 'Jetpack Compose를 활용하여 선언형 UI 개발을 마스터합니다.' },
    { id: 12, status: 'recruiting', location: '온라인', job: 'iOS', category: '모바일', title: 'SwiftUI 동시성 프로그래밍', host: '애플팬', postedAt: '1주 전', roles: ['iOS 개발자'], requirements: ['SwiftUI 경험'], tags: ['#iOS', '#SwiftConcurrency'], currentMembers: 2, maxMembers: 4, description: 'Swift의 async/await를 깊이 있게 다루는 스터디입니다.' },
    { id: 13, status: 'closed', location: '경기', job: '모바일', category: '모바일', title: 'Flutter 앱 만들기 (마감)', host: '플러터마스터', postedAt: '2주 전', roles: ['앱 개발자'], requirements: ['Dart 기초'], tags: ['#Flutter', '#마감'], currentMembers: 4, maxMembers: 4, description: 'Flutter를 사용하여 iOS/Android 앱을 동시에 개발합니다.' },
    { id: 14, status: 'recruiting', location: '온라인', job: '모바일', category: '모바일', title: 'React Native 프로젝트', host: 'RN매니아', postedAt: '1달 전', roles: ['프론트엔드', '모바일'], requirements: ['React 경험'], tags: ['#ReactNative', '#모바일'], currentMembers: 1, maxMembers: 3, description: 'React Native로 크로스플랫폼 앱을 개발할 분들을 찾습니다.' },

    // 기타 (AI/DevOps/CS) (6개)
    { id: 15, status: 'recruiting', location: '온라인', job: 'DevOps', category: '기타', title: 'Terraform으로 IaC 구축하기', host: '인프라엔지니어', postedAt: '6일 전', roles: ['DevOps', '백엔드'], requirements: ['AWS 기본 지식'], tags: ['#Terraform', '#IaC'], currentMembers: 2, maxMembers: 5, description: 'Terraform을 이용해 인프라를 코드로 관리하는 방법을 배웁니다.' },
    { id: 16, status: 'recruiting', location: '서울', job: 'CS', category: 'CS', title: 'CS 전공 면접 스터디', host: '면접왕', postedAt: '1주 전', roles: ['취준생'], requirements: ['컴퓨터 공학 전공자'], tags: ['#CS', '#면접'], currentMembers: 4, maxMembers: 6, description: '주요 CS 지식을 정리하고 모의 면접을 진행합니다.' },
    { id: 17, status: 'recruiting', location: '온라인', job: 'AI', category: 'AI', title: 'LLM 기반 서비스 개발', host: 'AI연구원', postedAt: '10일 전', roles: ['AI 엔지니어', '백엔드'], requirements: ['Python', 'API 사용 경험'], tags: ['#LLM', '#GenerativeAI'], currentMembers: 1, maxMembers: 3, description: 'OpenAI API 등을 활용하여 실제 동작하는 서비스를 만들어봅니다.' },
    { id: 18, status: 'closed', location: '경기', job: 'DevOps', category: '기타', title: 'CI/CD 파이프라인 구축 (마감)', host: '젠킨스맨', postedAt: '1달 전', roles: ['개발자'], requirements: ['Git 사용 경험'], tags: ['#CI/CD', '#Jenkins'], currentMembers: 4, maxMembers: 4, description: 'Jenkins와 Github Actions를 이용한 자동 배포 파이프라인을 구축합니다.' },
    { id: 19, status: 'recruiting', location: '온라인', job: '데이터', category: '데이터', title: 'SQL 쿼리 스터디', host: 'DB마스터', postedAt: '2일 전', roles: ['데이터 분석가', '백엔드'], requirements: ['데이터에 대한 관심'], tags: ['#SQL', '#데이터베이스'], currentMembers: 3, maxMembers: 6, description: '복잡한 SQL 쿼리 작성 능력을 향상시키는 스터디입니다.' },
    { id: 20, status: 'recruiting', location: '온라인', job: 'CS', category: 'CS', title: '코딩 테스트 알고리즘', host: '알고리즘정복', postedAt: '1달 전', roles: ['누구나'], requirements: ['프로그래밍 언어 1개 이상'], tags: ['#알고리즘', '#코딩테스트'], currentMembers: 5, maxMembers: 10, description: '매주 정해진 문제를 풀고 코드 리뷰를 진행합니다.' },
    { id: 21, status: 'recruiting', location: '온라인', job: 'CS', category: 'CS', title: '참새테스트', host: '알고리즘정복', postedAt: '1달 전', roles: ['누구나'], requirements: ['프로그래밍 언어 1개 이상'], tags: ['#알고리즘', '#코딩테스트'], currentMembers: 5, maxMembers: 10, description: '매주 정해진 문제를 풀고 코드 리뷰를 진행합니다.' },

];

export interface Application {
    id: number;
    status: 'pending' | 'approved' | 'rejected';
    message: string;
    appliedAt: string;
    study: {
        id: number;
        title: string;
        location: string;
        recruitingRoles: string[];
    };
}

// === 내 신청 내역 데이터 (20개) ===
export const MY_APPLICATIONS: Application[] = [
    {
        id: 1,
        status: 'pending',
        message: 'React 최신 기능에 대해 깊이 있게 공부하고 싶습니다.',
        appliedAt: '방금 전',
        study: {
            id: 1,
            title: 'React 19 최신 기능 스터디',
            location: 'ONLINE',
            recruitingRoles: ['프론트엔드'],
        },
    },
    {
        id: 2,
        status: 'approved',
        message: 'TypeScript 실전 경험을 쌓고 싶습니다.',
        appliedAt: '1일 전',
        study: {
            id: 2,
            title: 'TypeScript 기반 실전 프로젝트',
            location: 'SEOUL',
            recruitingRoles: ['프론트엔드', '백엔드'],
        },
    },
    {
        id: 3,
        status: 'rejected',
        message: 'Vue.js 경험을 활용하고 싶습니다.',
        appliedAt: '2일 전',
        study: {
            id: 3,
            title: 'Vue.js 스터디 (마감)',
            location: 'GYEONGGI',
            recruitingRoles: ['프론트엔드'],
        },
    },
    {
        id: 4,
        status: 'pending',
        message: '웹 성능에 대한 심도 깊은 논의를 하고 싶습니다.',
        appliedAt: '3일 전',
        study: {
            id: 4,
            title: '웹 성능 최적화 Deep Dive',
            location: 'ONLINE',
            recruitingRoles: ['프론트엔드'],
        },
    },
    {
        id: 5,
        status: 'approved',
        message: 'Next.js의 앱 라우터 사용 경험을 공유하고 싶습니다.',
        appliedAt: '4일 전',
        study: {
            id: 5,
            title: 'Next.js 앱 라우터 마스터',
            location: 'BUSAN',
            recruitingRoles: ['프론트엔드', '풀스택'],
        },
    },
    ];

export interface Announcement {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: Date;
    pinned?: boolean; // 👈 1. 고정 상태(pinned)를 위한 optional 필드 추가
    readBy?: string[];
}

export const FAKE_ANNOUNCEMENTS: Announcement[] = [
    { id: 1, title: '첫 스터디 일정 안내', content: '첫 스터디는 8월 15일 저녁 8시에 온라인으로 진행됩니다...', author: '모임장', createdAt: new Date('2025-08-10T14:00:00Z'), pinned: true },
    { id: 2, title: '스터디 규칙 안내', content: '서로 존중하는 분위기에서 진행했으면 합니다...', author: '모임장', createdAt: new Date('2025-08-09T11:00:00Z'), pinned: true },
    { id: 3, title: '자료 공유 폴더 안내', content: '스터디 관련 자료는 구글 드라이브에 공유할 예정입니다...', author: '모임장', createdAt: new Date('2025-08-07T18:00:00Z') },
    { id: 4, title: '이번 주 스터디 주제: React Hooks 심화', content: '이번 주에는 useEffect와 useReducer에 대해 깊이 있게 다뤄보겠습니다...', author: '모임장', createdAt: new Date('2025-08-05T10:00:00Z') },
    { id: 5, title: '8월 22일 스터디 시간 변경 투표', content: '다음 주 금요일 스터디 시간을 저녁 9시로 변경하는 것에 대한 투표를 슬랙에서 진행 중입니다.', author: '모임장', createdAt: new Date('2025-08-04T20:00:00Z') },
    { id: 6, title: '프로젝트 아이디어 모집', content: '사이드 프로젝트 아이디어가 있으신 분들은 노션 페이지에 자유롭게 작성해주세요.', author: '모임장', createdAt: new Date('2025-07-29T13:00:00Z') },
    { id: 7, title: '신규 멤버 OOO님을 환영합니다!', content: '새로운 멤버로 OOO님이 합류하셨습니다. 다들 따뜻하게 맞아주세요!', author: '모임장', createdAt: new Date('2025-07-28T17:00:00Z') },
    { id: 8, title: '회고록 작성 안내', content: '첫 스프린트가 끝났습니다. KPT 방식으로 회고록을 작성하여 공유해주세요.', author: '모임장', createdAt: new Date('2025-07-22T11:00:00Z') },
    { id: 9, title: '도움되는 아티클 공유', content: '최신 프론트엔드 동향에 대한 좋은 아티클이 있어 공유합니다.', author: '모임장', createdAt: new Date('2025-07-21T16:00:00Z') },
    { id: 10, title: '[필독] 휴가철 스터디 일정', content: '휴가철 기간에는 스터디를 한 주 쉬어갑니다.', author: '모임장', createdAt: new Date('2025-07-15T09:00:00Z') },
    { id: 11, title: '코드 리뷰 규칙', content: '코드 리뷰는 PR 생성 후 2일 이내에 최소 1명 이상이 리뷰하는 것을 원칙으로 합니다.', author: '모임장', createdAt: new Date('2025-07-14T14:00:00Z') },
    { id: 12, title: '다음 주 발표자 모집', content: '다음 주 스터디에서 15분 내외로 기술 공유를 해주실 발표자를 모집합니다.', author: '모임장', createdAt: new Date('2025-07-08T19:00:00Z') },
    { id: 13, title: '서버 점검 안내 (1시간)', content: '스터디 자료가 올라가 있는 테스트 서버가 오늘 자정부터 1시간 동안 점검에 들어갑니다.', author: '모임장', createdAt: new Date('2025-07-01T23:00:00Z') },
    { id: 14, title: '스터디 진행 방식 설문조사', content: '더 나은 스터디를 위해 진행 방식에 대한 간단한 설문조사를 진행합니다.', author: '모임장', createdAt: new Date('2025-06-24T12:00:00Z') },
    { id: 15, title: '오프라인 모임 수요조사', content: '다같이 오프라인에서 한번 모이는 건 어떨까요? 가능한 날짜를 알려주세요.', author: '모임장', createdAt: new Date('2025-06-17T18:00:00Z') },
    { id: 16, title: '깃헙 레포지토리 주소', content: '우리 스터디 프로젝트의 깃헙 레포지토리 주소입니다: [링크]', author: '모임장', createdAt: new Date('2025-06-10T10:00:00Z') },
    { id: 17, title: '모르는 것 질문하는 방법', content: '질문할 때는 어떤 시도를 해봤는지 구체적으로 작성해주시면 더 좋습니다.', author: '모임장', createdAt: new Date('2025-06-03T15:00:00Z') },
    { id: 18, title: '스터디 목표 재확인', content: '우리의 초기 목표를 다시 한번 되새겨봅시다. 다들 지치지 말고 끝까지 화이팅!', author: '모임장', createdAt: new Date('2025-05-27T11:00:00Z') },
    { id: 19, title: 'VSCode 유용한 익스텐션 목록', content: '개발 효율을 높여주는 VSCode 익스텐션 목록을 공유합니다.', author: '모임장', createdAt: new Date('2025-05-20T14:00:00Z') },
    { id: 20, title: '스터디 1기 종료 및 2기 모집 안내', content: '어느덧 3개월간의 스터디가 마무리되었습니다.', author: '모임장', createdAt: new Date('2025-05-13T10:00:00Z') },
];

export interface ScheduleEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    description?: string;
    authorId: string;
}

export const FAKE_EVENTS: ScheduleEvent[] = [
    { id: 1, authorId: '모임장', title: '1차 모의면접 (CS)', start: new Date(2025, 7, 18, 10, 0, 0), end: new Date(2025, 7, 18, 12, 0, 0) },
    { id: 2, authorId: '모임장', title: '알고리즘 문제 풀이', start: new Date(2025, 7, 20, 19, 0, 0), end: new Date(2025, 7, 20, 21, 0, 0) },
    { id: 3, authorId: '참가자A', title: '프로젝트 회고', start: new Date(2025, 7, 25, 14, 0, 0), end: new Date(2025, 7, 25, 15, 30, 0) },
    { id: 4, authorId: '모임장', title: '다음 달 계획 회의', start: new Date(2025, 8, 2, 11, 0, 0), end: new Date(2025, 8, 2, 12, 0, 0) },
    { id: 5, authorId: '참가자A', title: '코드 리뷰 세션', start: new Date(2025, 7, 15, 18, 0, 0), end: new Date(2025, 7, 15, 19, 0, 0) },
    { id: 6, authorId: '모임장', title: '기술 발표 (주제: SSR)', start: new Date(2025, 7, 22, 20, 0, 0), end: new Date(2025, 7, 22, 21, 0, 0) },
    { id: 7, authorId: '모임장', title: '개인별 진행상황 공유', start: new Date(2025, 7, 29, 19, 0, 0), end: new Date(2025, 7, 29, 20, 0, 0) },
    { id: 8, authorId: '모임장', title: '2차 모의면접 (직무)', start: new Date(2025, 8, 5, 10, 0, 0), end: new Date(2025, 8, 5, 12, 0, 0) },
    { id: 9, authorId: '참가자A', title: '팀 빌딩 온라인 게임', start: new Date(2025, 8, 1, 21, 0, 0), end: new Date(2025, 8, 1, 22, 0, 0) },
    { id: 10, authorId: '모임장', title: '네트워크 기초 스터디', start: new Date(2025, 8, 8, 19, 0, 0), end: new Date(2025, 8, 8, 20, 30, 0) },
    { id: 11, authorId: '모임장', title: '프로젝트 중간 점검', start: new Date(2025, 8, 12, 15, 0, 0), end: new Date(2025, 8, 12, 16, 0, 0) },
    { id: 12, authorId: '참가자A', title: '운영체제 스터디', start: new Date(2025, 8, 15, 19, 0, 0), end: new Date(2025, 8, 15, 20, 30, 0) },
    { id: 13, authorId: '모임장', title: '추석 연휴 휴식', start: new Date(2025, 8, 17), end: new Date(2025, 8, 19) },
    { id: 14, authorId: '모임장', title: '3차 모의면접 (인성)', start: new Date(2025, 8, 22, 10, 0, 0), end: new Date(2025, 8, 22, 12, 0, 0) },
    { id: 15, authorId: '참가자A', title: '데이터베이스 스터디', start: new Date(2025, 8, 24, 19, 0, 0), end: new Date(2025, 8, 24, 20, 30, 0) },
    { id: 16, authorId: '모임장', title: '최종 프로젝트 발표 준비', start: new Date(2025, 8, 26, 14, 0, 0), end: new Date(2025, 8, 26, 17, 0, 0) },
    { id: 17, authorId: '모임장', title: '최종 발표 및 회고', start: new Date(2025, 8, 29, 19, 0, 0), end: new Date(2025, 8, 29, 21, 0, 0) },
    { id: 18, authorId: '참가자A', title: 'React 심화 개념', start: new Date(2025, 7, 27, 19, 0, 0), end: new Date(2025, 7, 27, 20, 0, 0) },
    { id: 19, authorId: '모임장', title: 'JavaScript 이벤트 루프', start: new Date(2025, 7, 28, 19, 0, 0), end: new Date(2025, 7, 28, 20, 0, 0) },
    { id: 20, authorId: '모임장', title: '오프라인 뒷풀이', start: new Date(2025, 8, 30, 19, 0, 0), end: new Date(2025, 8, 30, 22, 0, 0) },
];

export interface StudyMember {
    id: string;
    name: string;
    role: 'leader' | 'member';
    avatarUrl?: string; // 프로필 이미지 URL (optional)
}

export const FAKE_STUDY_MEMBERS: StudyMember[] = [
    { id: 'leader', name: '리액트초보', role: 'leader' },
    { id: 'memberA', name: '참가자A', role: 'member' },
    { id: 'memberB', name: '참가자B', role: 'member' },
    { id: 'memberC', name: '참가자C', role: 'member' },
];