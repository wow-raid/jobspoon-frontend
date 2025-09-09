<script lang="ts">
  export const prerender = true;

  const title = 'AI 인터뷰 | 실전형 모의면접 · 답변 피드백';
  const desc  = 'AI 인터뷰 기능 소개, 장점, 시작 방법까지 한 번에. 실전형 질문, 실시간 피드백, 기록 관리 지원.';
  const url   = 'https://example.com/ai-interview';  // 배포 도메인으로 교체
  const img   = 'https://example.com/og/ai-interview.png';

  // SoftwareApplication + AggregateRating (가능하면 실제 수치로 교체)
  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'AI Interview',
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Web',
    description: desc,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'KRW' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '137' }
  };

  // FAQ 스니펫
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'AI 인터뷰는 무료인가요?',
        acceptedAnswer: { '@type': 'Answer', text: '기본 기능은 무료이며, 고급 기능은 유료입니다.' }
      },
      {
        '@type': 'Question',
        name: '실제 면접처럼 연습할 수 있나요?',
        acceptedAnswer: { '@type': 'Answer', text: '실전형 질문과 시간 제한, 후속 질문으로 실제와 유사한 환경을 제공합니다.' }
      }
    ]
  };
</script>

<svelte:head>
  <title>{title}</title>
  <meta name="description" content={desc} />
  <link rel="canonical" href={url} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={desc} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={img} />
  <meta property="og:locale" content="ko_KR" />
  <meta name="twitter:card" content="summary_large_image" />
  <!-- 네이버 소유확인은 배포 시 발급 토큰으로 -->
  <!-- <meta name="naver-site-verification" content="네이버-토큰" /> -->
  <script type="application/ld+json">{JSON.stringify(productJsonLd)}</script>
  <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
</svelte:head>

<main>
  <h1>AI 인터뷰</h1>
  <p>실전형 모의면접으로 답변을 연습하고, AI 피드백으로 빠르게 개선하세요.</p>

  <h2>주요 기능</h2>
  <ul>
    <li>직무·경험 기반 질문 생성</li>
    <li>실시간 답변 피드백 및 모범 답안</li>
    <li>답변 기록 저장 및 개선 추적</li>
  </ul>

  <p><a href="/ai-interview/guide">사용 가이드 →</a></p>
  <p><a href="/ai-interview/faq">FAQ →</a></p>

  <!-- 실제 Vue 앱 진입으로 보내는 CTA (UTM 권장) -->
  <p><a href="/app/ai-interview?utm_source=seo&utm_medium=landing">지금 시작하기 →</a></p>
</main>
