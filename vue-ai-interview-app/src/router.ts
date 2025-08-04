import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// 페이지 컴포넌트 import
import AiInterview from './pages/ai-interview.vue';
import AiInterviewLLM from './pages/llm-test/ai-interview-llm.vue';
import AiInterviewAnswerResult from './pages/result/ai-interview-answer-result.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/ai-test',
        component: AiInterview,
    },
    {
        path: '/ai-interview/llm-test',
        component: AiInterviewLLM,
    },
    {
        path: '/ai-interview/result',
        component: AiInterviewAnswerResult,
    },
    // 필요하다면 기타 라우트 추가
];

export const router = createRouter({
    history: createWebHistory(), // hash 모드면 createWebHashHistory()
    routes,
});
