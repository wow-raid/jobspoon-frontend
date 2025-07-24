<template>
    <v-container class="py-16">
        <h1 class="text-h4 font-weight-bold mb-4">👨‍💼 JobStick AI 모의 면접으로 면접 준비하기!</h1>
        <p class="text-subtitle-1 mb-6">💫 AI 기술로 더 스마트하게 면접을 준비해보세요 💫</p>

        <p class="mb-4">
            <h1 class="text-h5 font-weight-bold mb-4">🙋 AI 면접 무엇이 다른가요?</h1>
            현재 취준생의 84.5%는 취업 정보 수집에 어려움을 느끼고 있으며, 어떤 정보를 준비할지
            몰라서(38.4%)가 그 주된 이유로 꼽히고 있습니다. 기존에 취업 준비를 위한 여러 플랫폼들에서는
            기업 분석과 채용 정보에 대한 다양한 데이터가 있으나 사이트 내 정보가 너무 방대하여 나에게 필요한
            정보들을 즉각적으로 획득하기 어렵다는 문제가 있었습니다.
        </p>

        <p class="mb-4">
            또한, 기존의 취업 컨설팅을 제공하는 서비스는 사용자가 원하는 시간에 실시간으로 면접을 진행하기
            어려울 뿐만 아니라, 면접관과 매칭이 성사되기까지 오랜 시간이 걸린다는 단점이 존재했습니다. 이에 
            반해 AI 기반의 면접 시스템은 사용자가 시간과 장소에 구애 받지 않고 면접 연습을 자유로유면서 유연하게
            연습할 수 있도록 도와줍니다. 특히 직무와 산업별 특성을 반영한 질문 구성과 심층 분석 기능이 함께
            제공된다면, 실전 면습에 더욱 효과적으로 대비할 수 있을 것입니다. 
        </p>

        <p class="mb-4">
            이런 개발자들의 오래된 고충과 needs에 응하고자 JobStick에서는 AI 기반의 기술 면접 대비 사이트를 
            기획했습니다. 작업을 뜻하는 Job과 젓가락을 뜻하는 Stick을 융합하여 JobStick은 말 그대로 사용자가
            원하는 직무를 콕 찝어 사용자 맞춤의 기술 면접 대비 솔루션을 제공해준다는 의미를 가지고 있습니다. 
        </p>

        <p class="mb-4">
            <h1 class="text-h5 font-weight-bold mb-4">🙋 왜 JobStick인가요?</h1>
            IT 개발직의 취준생들은 취업 정보 수집에 어려움을 느끼고 있으며, 어떤 정보를 준비해야할지 모르겠다는
            의견이 많습니다. 또한, 기존에 제공되고 있던 타사의 플랫폼에서는 개발자들에 의한, 개발자를
            위한 취업 준비 플랫폼은 없었습니다. 
        </p>

        <p class="mb-4">
            그러나 JobStick에서는 이런 개발직 취업을 희망하는 분들의 오랜 고민을 위한 해결책을 제시하고 있습니다.
            JobStick에서는 실제 개발직 면접을 진행했던 분들의 신뢰도 있는 면접 후기 데이터를 토대로 AI가 학습하여 
            사용자에게 최적화된 질문을 생성해줍니다. 
        </p>

        <p class="mb-4">
            또한 실제 면접의 분위기를 느낄 수 있도록 사용자는 카메라를 통해 실시간으로 AI의 질문에 답변을 하면 답변
            내용이 녹음됩니다. 녹음된 내용을 토대로 AI는 사용자의 답변에 대해 다음에 생성할 적합한 질문을 생성하고 
            동시에 피드백도 생성하여 사용자는 나의 강점과 약점을 생산성, 의사소통, 개발역량, 문서작성, 유연성, 의사결정력이라는
            6 가지 기준을 토대로 한 눈에 파악할 수 있습니다. 
        </p>
        
        <v-btn class="mt-6 shiny-button" @click="router.push('/')">
            ⬅️ 메인으로 돌아가기 
        </v-btn>
    </v-container>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

useHead({
    title: 'AI 모의 면접으로 개발자 취업 준비 끝내기 - JobStick',
    meta: [
        {
            name: 'description',
            content: 'AI 기반 모의 면접 플랫폼으로 실전처럼 면접을 연습하세요. 개발자 취업을 준비하는 분들을 위한 최적의 솔루션을 소개합니다.',
        },
        {
            name: 'keywords',
            content: 'AI 면접, 개발자 면접, 모의 면접, AI 모의 면접, 취업 준비, 개발자 취업, 면접 연습, AI 모의 면접 연습, JobStick, job-stick, 잡스틱',
        },
    ],
})
</script>

<style scoped>
.shiny-button {
    background: linear-gradient(90deg, #42a5f5, #1e88e5);
    color: white;
    font-weight: bold;
    border-radius: 30px;
}
</style>