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
];

export interface Application {
    id: number;
    studyId: number;
    studyTitle: string;
    status: string;
    appliedAt: string;
}

// === 내 신청 내역 데이터 (20개) ===
export const MY_APPLICATIONS: Application[] = [
    { id: 1, studyId: 1, studyTitle: 'React 19 최신 기능 스터디', status: 'pending', appliedAt: '방금 전' },
    { id: 2, studyId: 2, studyTitle: 'TypeScript 기반 실전 프로젝트', status: 'approved', appliedAt: '1일 전' },
    { id: 3, studyId: 3, studyTitle: 'Vue.js 스터디 (마감)', status: 'rejected', appliedAt: '2일 전' },
    { id: 4, studyId: 4, studyTitle: '웹 성능 최적화 Deep Dive', status: 'pending', appliedAt: '3일 전' },
    { id: 5, studyId: 5, studyTitle: 'Next.js 앱 라우터 마스터', status: 'approved', appliedAt: '4일 전' },
    { id: 6, studyId: 6, studyTitle: 'Kotlin & Spring Boot MSA', status: 'pending', appliedAt: '1시간 전' },
    { id: 7, studyId: 7, studyTitle: '대용량 트래픽 처리 설계 (마감)', status: 'rejected', appliedAt: '3일 전' },
    { id: 8, studyId: 8, studyTitle: 'Node.js 클린 아키텍처', status: 'approved', appliedAt: '5일 전' },
    { id: 9, studyId: 9, studyTitle: '실용적인 Go 언어 스터디', status: 'pending', appliedAt: '6일 전' },
    { id: 10, studyId: 10, studyTitle: 'NestJS 기반 API 서버 개발', status: 'approved', appliedAt: '1주 전' },
    { id: 11, studyId: 11, studyTitle: 'Jetpack Compose 실전', status: 'rejected', appliedAt: '2일 전' },
    { id: 12, studyId: 12, studyTitle: 'SwiftUI 동시성 프로그래밍', status: 'pending', appliedAt: '4일 전' },
    { id: 13, studyId: 13, studyTitle: 'Flutter 앱 만들기 (마감)', status: 'approved', appliedAt: '1주 전' },
    { id: 14, studyId: 14, studyTitle: 'React Native 프로젝트', status: 'pending', appliedAt: '10일 전' },
    { id: 15, studyId: 15, studyTitle: 'Terraform으로 IaC 구축하기', status: 'rejected', appliedAt: '3일 전' },
    { id: 16, studyId: 16, studyTitle: 'CS 전공 면접 스터디', status: 'approved', appliedAt: '4일 전' },
    { id: 17, studyId: 17, studyTitle: 'LLM 기반 서비스 개발', status: 'pending', appliedAt: '5일 전' },
    { id: 18, studyId: 18, studyTitle: 'CI/CD 파이프라인 구축 (마감)', status: 'rejected', appliedAt: '1주 전' },
    { id: 19, studyId: 19, studyTitle: 'SQL 쿼리 스터디', status: 'approved', appliedAt: '2일 전' },
    { id: 20, studyId: 20, studyTitle: '코딩 테스트 알고리즘', status: 'pending', appliedAt: '1일 전' },
];

export interface Announcement {
    id: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
}

export const FAKE_ANNOUNCEMENTS: Announcement[] = [
    { id: 1, title: '첫 스터디 일정 안내', content: '첫 스터디는 8월 15일 저녁 8시에 온라인으로 진행됩니다. 참여 링크는 시작 10분 전에 공유하겠습니다.', author: '모임장', createdAt: '2일 전' },
    { id: 2, title: '스터디 규칙 안내', content: '서로 존중하는 분위기에서 진행했으면 합니다. 불참 시에는 최소 하루 전에 꼭 알려주세요.', author: '모임장', createdAt: '3일 전' },
    { id: 3, title: '자료 공유 폴더 안내', content: '스터디 관련 자료는 구글 드라이브에 공유할 예정입니다. 모두에게 편집 권한을 부여했으니 자유롭게 자료를 올려주세요.', author: '모임장', createdAt: '5일 전' },
];