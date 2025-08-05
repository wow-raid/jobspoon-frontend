import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

// 페이지 컴포넌트 import
import AiInterview from '../src/ai-interview/pages/ai-interview.vue';
import AiInterviewLLM from '../src/ai-interview/pages/llm-test/ai-interview-llm.vue';
import AiInterviewAnswerResult from '../src/ai-interview/pages/result/ai-interview-answer-result.vue';

const routes: Array<RouteRecordRaw> = [
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

const router = createRouter({
    history: createWebHistory("/vue-ai-interview"), // hash 모드면 createWebHashHistory()
    routes,
});

export default router;
