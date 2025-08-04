import { StudyRoom } from '../types/study';

export const FAKE_STUDY_ROOMS: StudyRoom[] = [
    // 프론트엔드
    { id: 1, status: 'recruiting', location: '서울', job: '프론트엔드', category: '프론트엔드', title: 'React 신입 스터디', host: '리액트초보', postedAt: '3시간 전', roles: ['스터디원 3명'], requirements: ['HTML/CSS 기본'], tags: ['#React', '#신입'], currentMembers: 1, maxMembers: 4, description: 'React 기초부터 함께 공부하실 분들을 찾습니다.' },
    { id: 2, status: 'recruiting', location: '온라인', job: '프론트엔드', category: '프론트엔드', title: 'Next.js 실전 프로젝트', host: 'Next고수', postedAt: '1일 전', roles: ['팀원 2명'], requirements: ['React 경험자'], tags: ['#NextJS', '#실전'], currentMembers: 2, maxMembers: 4, description: 'Next.js를 사용하여 실제 서비스를 만들어보는 프로젝트입니다.' },
    { id: 3, status: 'closed', location: '경기', job: '프론트엔드', category: '프론트엔드', title: 'Vue.js 스터디 (마감)', host: '뷰장인', postedAt: '3일 전', roles: ['스터디원 4명'], requirements: ['JavaScript 중급'], tags: ['#VueJS', '#마감'], currentMembers: 5, maxMembers: 5, description: '모집이 마감되었습니다.' },
    { id: 4, status: 'recruiting', location: '서울', job: '프론트엔드', category: '프론트엔드', title: 'TypeScript 심화 스터디', host: '타입스크립터', postedAt: '5일 전', roles: ['멤버 2명'], requirements: ['TypeScript 사용 경험'], tags: ['#TypeScript', '#심화'], currentMembers: 3, maxMembers: 5, description: 'TypeScript의 고급 기능과 실무 적용법을 다룹니다.' },
    { id: 5, status: 'recruiting', location: '부산', job: '프론트엔드', category: '프론트엔드', title: '웹 성능 최적화', host: '최적화맨', postedAt: '6일 전', roles: ['스터디원 3명'], requirements: ['프론트엔드 개발 경험'], tags: ['#성능', '#최적화'], currentMembers: 1, maxMembers: 4, description: 'Lighthouse 점수를 올리며 웹 성능을 개선합니다.' },

    // 백엔드
    { id: 6, status: 'recruiting', location: '온라인', job: '백엔드', category: '백엔드', title: 'Spring Boot 기초부터', host: '스프링새싹', postedAt: '2시간 전', roles: ['신입 3명'], requirements: ['Java 기초'], tags: ['#SpringBoot', '#Java'], currentMembers: 2, maxMembers: 5, description: 'Spring Boot를 처음 접하는 분들을 위한 스터디입니다.' },
    { id: 7, status: 'recruiting', location: '서울', job: '백엔드', category: '백엔드', title: 'Node.js & Express 프로젝트', host: '노드마스터', postedAt: '2일 전', roles: ['백엔드 개발자 2명'], requirements: ['JavaScript/TypeScript'], tags: ['#NodeJS', '#Express'], currentMembers: 1, maxMembers: 3, description: 'Node.js로 API 서버를 구축하는 프로젝트입니다.' },
    { id: 8, status: 'closed', location: '온라인', job: '백엔드', category: '백엔드', title: '대용량 트래픽 처리 설계', host: '설계고수', postedAt: '4일 전', roles: ['경력자 3명'], requirements: ['백엔드 3년 이상'], tags: ['#MSA', '#설계'], currentMembers: 4, maxMembers: 4, description: '대용량 시스템 설계에 대해 토론하고 공부합니다.' },
    { id: 9, status: 'recruiting', location: '경기', job: '백엔드', category: '백엔드', title: 'Django로 만드는 웹 서비스', host: '장고러버', postedAt: '1주 전', roles: ['스터디원 2명'], requirements: ['Python 기본'], tags: ['#Django', '#Python'], currentMembers: 2, maxMembers: 4, description: 'Python과 Django로 나만의 웹 서비스를 만들어봅니다.' },
    { id: 10, status: 'recruiting', location: '대구', job: '백엔드', category: '백엔드', title: 'JPA/QueryDSL 정복하기', host: '쿼리장인', postedAt: '8일 전', roles: ['멤버 3명'], requirements: ['Spring 경험'], tags: ['#JPA', '#QueryDSL'], currentMembers: 1, maxMembers: 4, description: 'JPA와 QueryDSL의 동작 원리를 깊게 학습합니다.' },

    // 모바일 (Android/iOS)
    { id: 11, status: 'recruiting', location: '서울', job: '안드로이드', category: '모바일', title: '코틀린으로 앱 만들기', host: '안드초보', postedAt: '1일 전', roles: ['스터디원 2명'], requirements: ['열정'], tags: ['#Android', '#Kotlin'], currentMembers: 1, maxMembers: 3, description: '코틀린을 사용하여 간단한 안드로이드 앱을 만들어봅니다.' },
    { id: 12, status: 'recruiting', location: '온라인', job: 'iOS', category: '모바일', title: 'SwiftUI 사이드 프로젝트', host: '애플팬', postedAt: '3일 전', roles: ['iOS 개발자 1명'], requirements: ['Swift 경험'], tags: ['#iOS', '#SwiftUI'], currentMembers: 2, maxMembers: 3, description: 'SwiftUI로 함께 사이드 프로젝트를 진행합니다.' },
    { id: 13, status: 'closed', location: '경기', job: '안드로이드', category: '모바일', title: 'Jetpack Compose 스터디', host: '컴포저', postedAt: '1주 전', roles: ['멤버 3명'], requirements: ['안드로이드 경험'], tags: ['#Compose', '#마감'], currentMembers: 4, maxMembers: 4, description: 'Jetpack Compose의 기본부터 심화까지 다룹니다.' },
    { id: 14, status: 'recruiting', location: '온라인', job: 'iOS', category: '모바일', title: 'RxSwift 스터디', host: '반응형프로그래머', postedAt: '9일 전', roles: ['스터디원 2명'], requirements: ['iOS 개발 경험'], tags: ['#RxSwift', '#iOS'], currentMembers: 1, maxMembers: 3, description: 'RxSwift를 활용한 반응형 프로그래밍을 학습합니다.' },

    // 기타 (DevOps/CS/AI)
    { id: 15, status: 'recruiting', location: '온라인', job: 'DevOps', category: '기타', title: 'Docker & Kubernetes 기초', host: '데브옵스꿈나무', postedAt: '4일 전', roles: ['스터디원 3명'], requirements: ['Linux 기본'], tags: ['#Docker', '#Kubernetes'], currentMembers: 2, maxMembers: 5, description: 'Docker와 Kubernetes의 기초 개념을 익힙니다.' },
    { id: 16, status: 'closed', location: '서울', job: 'CS', category: 'CS', title: '네트워크 스터디 (완료)', host: '네트워크박사', postedAt: '1주 전', roles: ['참가자 5명'], requirements: ['컴퓨터 전공자'], tags: ['#네트워크', '#CS'], currentMembers: 6, maxMembers: 6, description: '컴퓨터 네트워크의 핵심 개념을 공부합니다.' },
    { id: 17, status: 'recruiting', location: '온라인', job: 'AI', category: 'AI', title: 'PyTorch 논문 구현', host: 'AI연구원', postedAt: '6일 전', roles: ['연구원 2명'], requirements: ['PyTorch 경험'], tags: ['#AI', '#PyTorch'], currentMembers: 1, maxMembers: 3, description: '최신 AI 논문을 함께 읽고 코드로 구현합니다.' },
    { id: 18, status: 'recruiting', location: '경기', job: 'DevOps', category: '기타', title: 'CI/CD 파이프라인 구축', host: '젠킨스맨', postedAt: '10일 전', roles: ['멤버 2명'], requirements: ['개발 경험'], tags: ['#CI/CD', '#Jenkins'], currentMembers: 2, maxMembers: 4, description: 'Jenkins를 활용하여 CI/CD 파이프라인을 구축합니다.' },
    { id: 19, status: 'closed', location: '온라인', job: 'AI', category: 'AI', title: '머신러닝 기초 (마감)', host: '머신러너', postedAt: '18일 전', roles: ['참가자 5명'], requirements: ['Python'], tags: ['#머신러닝', '#AI'], currentMembers: 6, maxMembers: 6, description: '머신러닝의 기본 개념과 알고리즘을 학습합니다.' },
    { id: 20, status: 'recruiting', location: '온라인', job: 'CS', category: 'CS', title: '자료구조 & 알고리즘', host: '알고리즘정복', postedAt: '20일 전', roles: ['스터디원 4명'], requirements: ['프로그래밍 언어 1개 이상'], tags: ['#자료구조', '#알고리즘'], currentMembers: 1, maxMembers: 5, description: '코딩 테스트의 기반이 되는 자료구조와 알고리즘을 공부합니다.' },
];

export const MY_APPLICATIONS = [
    { id: 1, studyTitle: 'React 신입 스터디', status: 'pending', appliedAt: '1일 전' },
    { id: 2, studyTitle: 'Spring Boot 기초부터', status: 'approved', appliedAt: '3일 전' },
    { id: 3, studyTitle: 'JPA/QueryDSL 정복하기', status: 'rejected', appliedAt: '5일 전' },
    { id: 4, studyTitle: '웹 성능 최적화', status: 'pending', appliedAt: '1주 전' },
    { id: 5, studyTitle: 'Next.js 실전 프로젝트', status: 'approved', appliedAt: '2일 전' },
    { id: 6, studyTitle: 'Vue.js 스터디', status: 'rejected', appliedAt: '4일 전' },
    { id: 7, studyTitle: 'TypeScript 심화 스터디', status: 'pending', appliedAt: '6일 전' },
    { id: 8, studyTitle: 'Node.js & Express 프로젝트', status: 'approved', appliedAt: '1주 전' },
    { id: 9, studyTitle: '대용량 트래픽 처리 설계', status: 'pending', appliedAt: '10일 전' },
    { id: 10, studyTitle: 'Django로 만드는 웹 서비스', status: 'rejected', appliedAt: '11일 전' },
    { id: 11, studyTitle: '코틀린으로 앱 만들기', status: 'approved', appliedAt: '12일 전' },
    { id: 12, studyTitle: 'SwiftUI 사이드 프로젝트', status: 'pending', appliedAt: '2주 전' },
    { id: 13, studyTitle: 'Jetpack Compose 스터디', status: 'rejected', appliedAt: '2주 전' },
    { id: 14, studyTitle: 'RxSwift 스터디', status: 'approved', appliedAt: '3주 전' },
    { id: 15, studyTitle: 'Docker & Kubernetes 기초', status: 'pending', appliedAt: '1일 전' },
    { id: 16, studyTitle: '네트워크 스터디', status: 'approved', appliedAt: '5일 전' },
    { id: 17, studyTitle: 'PyTorch 논문 구현', status: 'rejected', appliedAt: '8일 전' },
    { id: 18, studyTitle: 'CI/CD 파이프라인 구축', status: 'pending', appliedAt: '9일 전' },
    { id: 19, studyTitle: '머신러닝 기초', status: 'approved', appliedAt: '2주 전' },
    { id: 20, studyTitle: '자료구조 & 알고리즘', status: 'pending', appliedAt: '4일 전' },
];