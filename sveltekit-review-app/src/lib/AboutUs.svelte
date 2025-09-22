<script lang="ts">
	type Member = {
		name: string;
		role?: string;
		photo: string;
		github?: string;
		email?: string;
		linkedin?: string;
	};

	const DEFAULT_TEAM: Member[] = [
		{
			name: '임운철',
			role: 'MFE, SEO, PM',
			photo: '/images/team/hong.jpg',
			github: 'https://github.com/unchul',
			email: 'unchul87@gmail.com'
		},
		{
			name: '최현수',
			role: 'AI-Interview, CI/CD',
			photo: '/images/team/kim.jpg',
			github: 'https://github.com/username2',
			email: 'kim@example.com'
		},
		{
			name: '이승현',
			role: 'Admin',
			photo: '/images/team/lee.jpg',
			github: 'https://github.com/puppy1012',
			email: 'puppy1012@naver.com'
		},
		{
			name: '정은선',
			role: 'MyPage',
			photo: '/images/team/park.jpg',
			github: 'https://github.com/yeolmu96',
			email: 'jeonges924@gmail.com'
		},
		{
			name: '박태준',
			role: 'StudyRoom',
			photo: '/images/team/choi.jpg',
			github: 'https://github.com/Roto90-BackEnd',
			email: 'slalala90@gmail.com'
		},
		{
			name: '김정민',
			role: 'SpoonWord',
			photo: '/images/team/jung.jpg',
			github: 'https://github.com/Mur-pixel',
			email: 'broaden550@gmail.com'
		},
		{
			name: '김지한',
			role: 'Flutter Mobile',
			photo: '/images/team/mun.jpg',
			github: 'https://github.com/username7',
			email: 'mun@example.com'
		}
	];

	const DEFAULT_LEGACY: Member[] = [
		{ name: '잡스틱A', photo: '/images/legacy/1.jpg' },
		{ name: '잡스틱B', photo: '/images/legacy/2.jpg' },
		{ name: '잡스틱C', photo: '/images/legacy/3.jpg' },
		{ name: '잡스틱D', photo: '/images/legacy/4.jpg' },
		{ name: '잡스틱E', photo: '/images/legacy/5.jpg' }
	];

	export let team: Member[] = DEFAULT_TEAM;
	export let legacy: Member[] = DEFAULT_LEGACY;

	const mailto = (email?: string) => (email ? `mailto:${email}` : undefined);

	/* 카드 클릭 뒤집기 상태 */
	let flipped = new Set<number>();
	const toggleFlip = (i: number) => {
		const next = new Set(flipped);
		next.has(i) ? next.delete(i) : next.add(i);
		flipped = next;
	};
</script>

<section class="about">
	<section class="hero">
		<div class="hero__inner">
			<h1>About <span>JobSpoon</span></h1>
			<p class="subtitle">AI 인터뷰 · 면접 스터디 · 스푼워드 · 마이페이지 레벨 시스템</p>
			<nav class="quicklinks" aria-label="About Us quick links">
				<a href="#features">무엇을 할 수 있나요?</a>
				<a href="#ai-interview">AI 인터뷰</a>
				<a href="#study">면접 스터디</a>
				<a href="#spoonword">스푼워드</a>
				<a href="#mypage">마이페이지 & 레벨</a>
				<a href="#team">팀 소개</a>
				<a href="#legacy">JobStick</a>
			</nav>
		</div>
	</section>

	<section id="features" class="section">
		<h2>잡스푼에서 할 수 있는 것들</h2>
		<div class="cards">
			<article class="card">
				<h3>AI 인터뷰</h3>
				<p>직무·언어 선택 → 실전 답변 → 자동 채점/피드백.</p>
			</article>
			<article class="card">
				<h3>면접 스터디</h3>
				<p>모집/참석, 온·오프라인 운영, 출석/과제/피드백 관리.</p>
			</article>
			<article class="card">
				<h3>스푼워드</h3>
				<p>용어 저장·단어장·퀴즈/시험·반복학습으로 약점 보완.</p>
			</article>
			<article class="card">
				<h3>마이페이지</h3>
				<p>활동 지표 집계 → 성실도/레벨 업으로 동기 부여.</p>
			</article>
		</div>
	</section>

	<section id="ai-interview" class="section">
		<h2>AI 인터뷰는 이렇게 진행돼요</h2>
		<ol class="steps">
			<li><strong>세션 구성:</strong> 직무/경력/키워드·언어 선택 → 질문 세트 생성</li>
			<li><strong>응답 방식:</strong> 음성/텍스트, 시간 제한(예: 1~2분), 재응답 옵션</li>
			<li><strong>평가/피드백:</strong> 명확성·논리·심화·키워드 적합도 기반 점수와 개선 팁</li>
			<li><strong>리뷰/재학습:</strong> 오답노트·모범답안·추가 연습</li>
			<li><strong>공유/기록:</strong> 스터디 공유, 마이페이지 누적 추적</li>
		</ol>
	</section>

	<section id="study" class="section">
		<h2>면접 스터디: 모집하고, 참석하고, 성장하세요</h2>
		<div class="grid2">
			<div>
				<h3>모집</h3>
				<ul class="bullets">
					<li>모집글: 주제·진행·일정·정원</li>
					<li>온/오프라인·하이브리드, 출석 체크/과제</li>
					<li>AI 질문 뱅크로 질문 자동 생성</li>
				</ul>
			</div>
			<div>
				<h3>참석</h3>
				<ul class="bullets">
					<li>캘린더/알림, 실시간 타이머/스피치 가이드</li>
					<li>발표→피드백→리트라이 루프</li>
					<li>참석률/기여도 자동 집계(마이페이지 연동)</li>
				</ul>
			</div>
		</div>
	</section>

	<section id="spoonword" class="section">
		<h2>스푼워드: 나만의 단어장으로 약점 공략</h2>
		<div class="grid2">
			<div>
				<h3>수집</h3>
				<p>키워드 검색 → 설명/예시/연관질문을 카드로 저장, 태그로 분류</p>
			</div>
			<div>
				<h3>학습/시험</h3>
				<p>플래시카드·객관식·서술형, SRS(간격 반복)로 자동 복습 주기</p>
			</div>
		</div>
	</section>

	<section id="mypage" class="section">
		<h2>마이페이지 & 성실도/레벨 시스템</h2>
		<div class="kpis">
			<div class="kpi"><span class="num">128</span><span class="label">작성 글</span></div>
			<div class="kpi"><span class="num">23회</span><span class="label">AI 인터뷰</span></div>
			<div class="kpi"><span class="num">86점</span><span class="label">최근 인터뷰</span></div>
			<div class="kpi"><span class="num">92%</span><span class="label">참석률</span></div>
			<div class="kpi"><span class="num">41회</span><span class="label">단어 시험</span></div>
		</div>
		<p class="muted">
			* 위 값은 예시입니다. 실제로는 활동 데이터로 가중치/누적 계산 후 성실도와 레벨을 산출합니다.
		</p>
	</section>

	<section id="team" class="section">
		<h2>Team JobSpoon</h2>
		<div class="team">
			{#each team as m, i}
				<button
					class="flipcard"
					class:is-flipped={flipped.has(i)}
					aria-label={`${m.name} 정보 보기`}
					aria-pressed={flipped.has(i)}
					on:click={() => toggleFlip(i)}
				>
					<!-- 회전은 프레임만 -->
					<div class="flipcard__inner">
						<!-- 내용은 항상 정방향: 부모 회전을 상쇄 -->
						<div
							class="flipcard__content"
							style={`--counter:${flipped.has(i) ? '-180deg' : '0deg'}`}
						>
							{#if flipped.has(i)}
								<!-- 뒷면 내용 -->
								<div class="back">
									<strong>{m.name}</strong>
									{#if m.github}<a class="link" href={m.github} target="_blank" rel="noreferrer"
											>GitHub</a
										>{/if}
									{#if m.linkedin}<a class="link" href={m.linkedin} target="_blank" rel="noreferrer"
											>LinkedIn</a
										>{/if}
									{#if m.email}<a class="link" href={mailto(m.email)}>이메일</a>{/if}
								</div>
							{:else}
								<!-- 앞면 내용 -->
								<div class="front">
									<img src={m.photo} alt={`${m.name} 사진`} loading="lazy" draggable="false" />
									<div class="caption">
										<strong>{m.name}</strong>{#if m.role}<span>{m.role}</span>{/if}
									</div>
								</div>
							{/if}
						</div>
					</div>
				</button>
			{/each}
		</div>
	</section>

	<section id="legacy" class="section">
		<h2>JobStick의 유산</h2>
		<p>
			잡스푼은 <strong>잡스틱(JobStick)</strong>의 정신을 계승합니다. 함께해 주신 멤버들을
			기억합니다.
		</p>
		<div class="legacy">
			{#each legacy as m}
				<figure class="legacycard">
					<img src={m.photo} alt={`${m.name} 사진`} loading="lazy" draggable="false" />
					<figcaption>{m.name}</figcaption>
				</figure>
			{/each}
		</div>
	</section>
</section>

<style>
	/* ===== Theme base ===== */
	.about {
		--bg: #0f1115;
		--panel: #151922;
		--ink: #eaeaea;
		--ink-dim: #a0a0a0;
		--line: #2b2f41;
		--brand: #5b8cff;
		color: var(--ink);
		background: var(--bg);
		user-select: none;
		-webkit-user-select: none;
		-webkit-touch-callout: none;
		-webkit-tap-highlight-color: transparent;
	}
	.about img {
		-webkit-user-drag: none;
		user-drag: none;
	}
	.about a,
	.about button {
		cursor: pointer;
	}
	:global([data-theme='light']) :global(.about) {
		--bg: #fff;
		--panel: #f7f8fa;
		--ink: #111;
		--ink-dim: #666;
		--line: #d1d5db;
		--brand: #1d4ed8;
	}
	:global([data-theme='dark']) :global(.about) {
		--bg: #0f1115;
		--panel: #151922;
		--ink: #eaeaea;
		--ink-dim: #a0a0a0;
		--line: #2b2f41;
		--brand: #5b8cff;
	}

	/* ===== Layout ===== */
	.hero {
		padding: 56px 20px 32px;
		border-bottom: 1px solid var(--line);
		background: linear-gradient(180deg, rgba(108, 124, 255, 0.12), transparent);
	}
	.hero__inner {
		max-width: 1100px;
		margin: 0 auto;
		text-align: center;
	}
	.hero h1 {
		font-size: 36px;
		margin: 0 0 6px;
		letter-spacing: -0.02em;
	}
	.hero h1 span {
		color: var(--brand);
	}
	.subtitle {
		color: var(--ink-dim);
		margin: 0 0 18px;
	}
	.quicklinks {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		justify-content: center;
	}
	.quicklinks a {
		padding: 8px 12px;
		border: 1px solid var(--line);
		border-radius: 999px;
		text-decoration: none;
		color: var(--ink);
		background: var(--panel);
	}
	.quicklinks a:hover {
		border-color: var(--brand);
	}
	.section {
		max-width: 1100px;
		margin: 40px auto;
		padding: 0 20px;
	}
	.section h2 {
		font-size: 24px;
		margin: 0 0 12px;
	}
	.section p {
		color: var(--ink-dim);
	}
	.cards {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		gap: 14px;
	}
	.card {
		background: var(--panel);
		border-radius: 14px;
		box-shadow: inset 0 0 0 1px var(--line);
		padding: 16px;
	}
	.card h3 {
		margin: 0 0 6px;
		font-size: 18px;
	}
	.steps {
		margin: 0;
		padding-left: 20px;
		color: var(--ink-dim);
	}
	.steps li {
		margin: 8px 0;
	}
	.grid2 {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 18px;
	}
	.bullets {
		margin: 0;
		padding-left: 18px;
		color: var(--ink-dim);
	}
	.bullets li {
		margin: 8px 0;
	}
	.kpis {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 10px;
		margin-top: 10px;
	}
	.kpi {
		background: var(--panel);
		border-radius: 14px;
		box-shadow: inset 0 0 0 1px var(--line);
		padding: 14px;
		text-align: center;
	}
	.kpi .num {
		display: block;
		font-size: 20px;
		font-weight: 700;
	}
	.kpi .label {
		display: block;
		color: var(--ink-dim);
		font-size: 12px;
		margin-top: 6px;
	}
	.muted {
		color: var(--ink-dim);
		font-size: 13px;
		margin-top: 8px;
	}

	/* ===== Team cards ===== */
	.team {
		display: grid;
		grid-template-columns: repeat(7, minmax(0, 1fr));
		gap: 12px;
	}

	.flipcard {
		border: 0;
		padding: 0;
		background: none;
		perspective: 1000px;
		-webkit-perspective: 1000px;
		isolation: isolate;
		transform: translateY(0);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
	}
	.flipcard:hover,
	.flipcard:focus-visible {
		transform: translateY(-6px);
	}
	.flipcard:focus-visible {
		outline: none;
	}

	/* 프레임만 회전(애니메이션), 내용은 카운터 회전으로 정방향 유지 */
	.flipcard__inner {
		position: relative;
		width: 100%;
		aspect-ratio: 3/4;
		transform-style: preserve-3d;
		-webkit-transform-style: preserve-3d;
		border-radius: 12px;
		overflow: hidden;
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--line);
		transition:
			transform 0.6s ease,
			box-shadow 0.25s ease;
		transform: rotateY(0deg);
	}
	.flipcard.is-flipped .flipcard__inner {
		transform: rotateY(180deg);
		/* 뒷면 때 강조 */
		box-shadow:
			inset 0 0 0 1px var(--line),
			0 10px 24px rgba(0, 0, 0, 0.24),
			0 0 0 2px color-mix(in srgb, var(--brand) 45%, transparent);
	}
	@supports not (color: color-mix(in srgb, #000 50%, transparent)) {
		.flipcard.is-flipped .flipcard__inner {
			box-shadow:
				inset 0 0 0 1px var(--line),
				0 10px 24px rgba(0, 0, 0, 0.24),
				0 0 0 2px rgba(91, 140, 255, 0.45);
		}
	}

	/* 내용 컨테이너: 부모 회전을 상쇄해 글자/이미지 정방향 유지 */
	.flipcard__content {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		transform-style: preserve-3d;
		-webkit-transform-style: preserve-3d;
		/* 부모가 180deg 돌면 이 컨테이너는 -180deg로 상쇄 */
		transform: rotateY(var(--counter, 0deg));
		transition: transform 0.6s ease;
	}

	.front {
		position: absolute;
		inset: 0;
	}
	.front img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
	.caption {
		position: absolute;
		left: 8px;
		right: 8px;
		bottom: 8px;
		padding: 10px;
		border-radius: 10px;
		background: linear-gradient(0deg, rgba(0, 0, 0, 0.55), transparent);
	}
	.caption strong {
		display: block;
		font-weight: 700;
	}
	.caption span {
		color: var(--ink-dim);
		font-size: 12px;
	}

	.back {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		background: color-mix(in srgb, var(--bg) 85%, var(--panel) 15%);
		box-shadow: inset 0 0 0 2px var(--brand);
	}
	@supports not (background: color-mix(in srgb, #000 50%, #fff 50%)) {
		.back {
			background: var(--panel);
		}
	}

	.link {
		color: var(--brand);
		text-decoration: none;
		font-size: 14px;
	}
	.link:hover {
		text-decoration: underline;
	}

	/* ===== Legacy ===== */
	.legacy {
		display: grid;
		grid-template-columns: repeat(5, minmax(0, 1fr));
		gap: 12px;
	}
	.legacycard {
		margin: 0;
		border-radius: 12px;
		overflow: hidden;
		background: var(--panel);
		box-shadow: inset 0 0 0 1px var(--line);
	}
	.legacycard img {
		width: 100%;
		height: 160px;
		object-fit: cover;
		display: block;
		-webkit-user-drag: none;
		user-drag: none;
	}
	.legacycard figcaption {
		padding: 8px;
		text-align: center;
		color: var(--ink-dim);
	}

	/* ===== Responsive ===== */
	@media (max-width: 1100px) {
		.team {
			grid-template-columns: repeat(4, 1fr);
		}
		.cards {
			grid-template-columns: repeat(2, 1fr);
		}
		.kpis {
			grid-template-columns: repeat(3, 1fr);
		}
		.legacy {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media (max-width: 640px) {
		.team {
			grid-template-columns: repeat(2, 1fr);
		}
		.grid2 {
			grid-template-columns: 1fr;
		}
		.cards {
			grid-template-columns: 1fr;
		}
		.kpis {
			grid-template-columns: repeat(2, 1fr);
		}
		.legacy {
			grid-template-columns: repeat(2, 1fr);
		}
		.legacycard img {
			height: 140px;
		}
	}
</style>
