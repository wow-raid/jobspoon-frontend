<script lang="ts">
  import { onMount } from "svelte";

  type Review = {
    id: string;
    rating: 1 | 2 | 3 | 4 | 5;
    text: string;
    date: string; // ISO
    author?: string;
  };

  // 로컬 저장소 키 (백엔드 없는 동작용)
  export let storageKey = "review-widget:v1";

  // 입력 상태
  let rating: 0 | 1 | 2 | 3 | 4 | 5 = 0;
  let hover = 0;
  let text = "";
  let submitting = false;

  // 데이터
  let reviews: Review[] = [];

  // 요약 계산
  $: total = reviews.length;
  $: avg = total
    ? +(reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)
    : 0;

  // 분포 (1~5)
  $: counts = [0, 0, 0, 0, 0, 0] as number[]; // index = 별점
  $: (() => {
    counts = [0, 0, 0, 0, 0, 0];
    for (const r of reviews) counts[r.rating] += 1;
  })();

  // 초기 로드 (로컬)
  onMount(() => {
    try {
      const raw =
        typeof window !== "undefined" && localStorage.getItem(storageKey);
      if (raw) {
        const parsed: Review[] = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          reviews = parsed.filter((r) => r && r.rating >= 1 && r.rating <= 5);
        }
      }
    } catch (e) {
      console.warn("[Review] localStorage load skipped:", e);
    }

    // --- 백엔드에서 평균/분포/목록을 가져오고 싶다면 이 주석을 참고 ---
    /*
    (async function loadFromServer() {
      try {
        const res = await fetch("/api/reviews?resourceId=your-id");
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json() as { reviews: Review[] };
        reviews = data.reviews;
      } catch (e) {
        console.error("[Review] fetch failed:", e);
      }
    })();
    */
  });

  function saveLocal() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(reviews));
    } catch (e) {
      console.warn("[Review] localStorage save skipped:", e);
    }
  }

  function formatDate(iso: string) {
    try {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, "0");
      const day = d.getDate().toString().padStart(2, "0");
      return `${y}.${m}.${day}`;
    } catch {
      return iso;
    }
  }

  async function handleSubmit() {
    if (!rating) return;
    submitting = true;

    const newReview: Review = {
      id: crypto.randomUUID(),
      rating: rating as 1 | 2 | 3 | 4 | 5,
      text: text.trim(),
      date: new Date().toISOString(),
      author: "익명",
    };

    // 낙관적 업데이트 (백엔드 없이도 동작)
    reviews = [...reviews, newReview];
    saveLocal();

    // --- 백엔드 전송은 아래 참고 (주석 해제해서 사용) ---
    /*
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: "your-id",
          rating: newReview.rating,
          text: newReview.text,
        }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      // 서버가 정답 데이터(갱신된 평균/분포/리뷰)를 돌려주면 여기서 reviews 교체
      // const data = await res.json() as { reviews: Review[] };
      // reviews = data.reviews;
    } catch (e) {
      console.error("[Review] submit failed:", e);
      // 실패 롤백 예시:
      // reviews = reviews.filter(r => r.id !== newReview.id);
    }
    */

    // 입력 초기화
    rating = 0;
    hover = 0;
    text = "";
    submitting = false;
  }

  // 평균 별표 표현: 각 칸별로 채울 비율(0~100)
  function starFillPercent(index: number, value: number) {
    const diff = value - (index - 1);
    if (diff >= 1) return 100;
    if (diff <= 0) return 0;
    return Math.round(diff * 100);
  }

  // 템플릿에서는 TS 단언 쓰지 않도록: number를 받아 내부에서 검증/단언
  function setRating(n: number) {
    if (n >= 1 && n <= 5) {
      rating = n as 1 | 2 | 3 | 4 | 5;
    }
  }
</script>

<section class="review-widget">
  <h2 class="title">평점 및 리뷰</h2>

  <div class="summary">
    <div class="avg-box">
      <div class="avg-score">{avg.toFixed(1)}</div>
      <div class="stars large" aria-label="평균 별점">
        {#each [1, 2, 3, 4, 5] as i}
          {@const pct = starFillPercent(i, avg)}
          <!-- 0~100 -->
          <svg
            class="star"
            viewBox="0 0 24 24"
            focusable="false"
            aria-hidden="true"
          >
            <defs>
              <!-- 마스크: 왼쪽에서 pct% 만큼만 보여주기 -->
              <mask id={`mask-avg-${i}`} maskUnits="userSpaceOnUse">
                <rect
                  x="0"
                  y="0"
                  width={24 * (pct / 100)}
                  height="24"
                  fill="white"
                />
              </mask>
            </defs>

            <!-- 바탕(회색) 별 -->
            <path
              class="bg"
              d="M12 2l3.09 6.26 6.9.99-5 4.87 1.18 6.88L12 17.77 5.83 21l1.18-6.88-5-4.87 6.9-.99L12 2z"
            />

            <!-- 전경(포인트색) 별: 마스크로 부분 채움 -->
            <path
              class="fg"
              d="M12 2l3.09 6.26 6.9.99-5 4.87 1.18 6.88L12 17.77 5.83 21l1.18-6.88-5-4.87 6.9-.99L12 2z"
              mask={`url(#mask-avg-${i})`}
            />
          </svg>
        {/each}
      </div>
      <div class="total">{total.toLocaleString()}개 리뷰</div>
    </div>

    <div class="bars">
      {#each [5, 4, 3, 2, 1] as s}
        <div class="bar-row">
          <span class="label">{s}</span>
          <div class="bar">
            <div
              class="fill"
              style={`width:${total ? ((counts[s] / total) * 100).toFixed(1) : 0}%`}
            ></div>
          </div>
          <span class="count">{counts[s] || 0}</span>
        </div>
      {/each}
    </div>
  </div>

  <form class="editor" on:submit|preventDefault={handleSubmit}>
    <div class="rating-input" role="radiogroup" aria-label="별점 선택">
      {#each [1, 2, 3, 4, 5] as i}
        <button
          type="button"
          class="rate-btn"
          role="radio"
          aria-checked={(rating || hover) === i}
          on:mouseenter={() => (hover = i)}
          on:mouseleave={() => (hover = 0)}
          on:click={() => setRating(i)}
          title={`${i}점`}
        >
          <div class="star-wrap">
            <svg class="star" viewBox="0 0 24 24">
              <path
                class="bg"
                d="M12 2l3.09 6.26 6.9.99-5 4.87 1.18 6.88L12 17.77 5.83 21l1.18-6.88-5-4.87 6.9-.99L12 2z"
              />
            </svg>
            <div
              class="clip"
              style={`width:${(hover || rating) >= i ? 100 : 0}%`}
            >
              <svg class="star" viewBox="0 0 24 24">
                <path
                  class="fg"
                  d="M12 2l3.09 6.26 6.9.99-5 4.87 1.18 6.88L12 17.77 5.83 21l1.18-6.88-5-4.87 6.9-.99L12 2z"
                />
              </svg>
            </div>
          </div>
        </button>
      {/each}
      <span class="rate-hint"
        >{rating ? `${rating}점` : "별을 눌러 점수를 선택하세요"}</span
      >
    </div>

    <textarea
      bind:value={text}
      placeholder="간단한 한 줄 평을 남겨주세요 (선택)"
      maxlength="300"
      rows="3"
      class="text-input"
    ></textarea>

    <div class="actions">
      <span class="char">{text.length}/300</span>
      <button class="submit" type="submit" disabled={!rating || submitting}>
        {submitting ? "등록 중..." : "리뷰 남기기"}
      </button>
    </div>
  </form>

  <ul class="review-list">
    {#each [...reviews].reverse() as r (r.id)}
      <li class="review-item">
        <div class="avatar" aria-hidden="true">
          {(r.author ?? "익명").charAt(0)}
        </div>
        <div class="content">
          <div class="meta">
            <span class="name">{r.author ?? "익명"}</span>
            <span class="dot">·</span>
            <span class="date">{formatDate(r.date)}</span>
          </div>
          <div class="stars small" aria-label={`개별 별점: ${r.rating}점`}>
            {#each [1, 2, 3, 4, 5] as i}
              <div class="star-wrap">
                <svg class="star" viewBox="0 0 24 24">
                  <path
                    class="bg"
                    d="M12 2l3.09 6.26 6.9.99-5 4.87 1.18 6.88L12 17.77 5.83 21l1.18-6.88-5-4.87 6.9-.99L12 2z"
                  />
                </svg>
                <div class="clip" style={`width:${i <= r.rating ? 100 : 0}%`}>
                  <svg class="star" viewBox="0 0 24 24">
                    <path
                      class="fg"
                      d="M12 2l3.09 6.26 6.9.99-5 4.87 1.18 6.88L12 17.77 5.83 21l1.18-6.88-5-4.87 6.9-.99L12 2z"
                    />
                  </svg>
                </div>
              </div>
            {/each}
          </div>
          {#if r.text}<p class="text">{r.text}</p>{/if}
        </div>
      </li>
    {/each}
  </ul>
</section>

<style>
  .review-widget {
    --bg: #111;
    --card: #1a1a1a;
    --muted: #a0a0a0;
    --text: #eaeaea;
    --accent: #5b8cff;
    --accent-weak: #2a3f7a;
    --bar-bg: #2a2a2a;

    color: var(--text);
    background: transparent;
    font-family:
      system-ui,
      -apple-system,
      Segoe UI,
      Roboto,
      Helvetica,
      Arial;
    max-width: 880px;
    margin: 0 auto;
    padding: 16px;
  }

  .title {
    font-size: 20px;
    font-weight: 600;
    margin: 8px 0 16px;
  }

  .summary {
    display: grid;
    grid-template-columns: 220px 1fr;
    gap: 16px;
    align-items: center;
    background: var(--card);
    border-radius: 14px;
    padding: 16px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  }

  .avg-box {
    text-align: center;
  }
  .avg-score {
    font-size: 56px;
    font-weight: 700;
    line-height: 1;
  }
  .total {
    margin-top: 6px;
    font-size: 13px;
    color: var(--muted);
  }

  .bars {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .bar-row {
    display: grid;
    grid-template-columns: 16px 1fr 48px;
    gap: 10px;
    align-items: center;
  }
  .bar-row .label {
    color: var(--muted);
    font-size: 12px;
  }
  .bar {
    height: 10px;
    background: var(--bar-bg);
    border-radius: 999px;
    overflow: hidden;
  }
  .bar .fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent) 0%, #7aa7ff 100%);
  }
  .bar-row .count {
    color: var(--muted);
    font-size: 12px;
    text-align: right;
  }

  .stars {
    display: inline-flex;
    gap: 2px;
    margin-top: 8px;
  }
  .stars.large .star-wrap {
    width: 28px;
    height: 28px;
  }
  .stars.small .star-wrap {
    width: 16px;
    height: 16px;
  }

  .star-wrap {
    position: relative;
    width: 20px;
    height: 20px;
  }
  .star {
    width: 100%;
    height: 100%;
    display: block;
  }
  .star .bg {
    fill: #3a3a3a;
  }
  .star .fg {
    fill: var(--accent);
  }
  .clip {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  .editor {
    margin-top: 18px;
    background: var(--card);
    border-radius: 14px;
    padding: 14px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  }
  .rating-input {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
  }
  .rate-btn {
    background: transparent;
    border: none;
    padding: 0;
    cursor: pointer;
  }
  .rate-btn:focus-visible {
    outline: 2px solid var(--accent);
    border-radius: 6px;
  }
  .rate-hint {
    margin-left: 8px;
    color: var(--muted);
    font-size: 13px;
  }

  .text-input {
    width: 100%;
    resize: vertical;
    border: 1px solid #333;
    background: #121212;
    color: var(--text);
    border-radius: 10px;
    padding: 10px 12px;
    margin-top: 4px;
    outline: none;
  }
  .text-input:focus {
    border-color: var(--accent);
  }

  .actions {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: flex-end;
    margin-top: 10px;
  }
  .actions .char {
    color: var(--muted);
    font-size: 12px;
  }
  .submit {
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 10px;
    padding: 8px 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .review-list {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .review-item {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 12px;
    background: var(--card);
    border-radius: 14px;
    padding: 12px;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.25);
  }
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #2a2a2a;
    display: grid;
    place-items: center;
    font-weight: 700;
    color: var(--text);
  }
  .content .meta {
    display: flex;
    gap: 6px;
    align-items: center;
    color: var(--muted);
    font-size: 12px;
    margin-bottom: 4px;
  }
  .content .text {
    margin-top: 6px;
    white-space: pre-wrap;
    word-break: break-word;
    color: var(--text);
  }

  @media (max-width: 640px) {
    .summary {
      grid-template-columns: 1fr;
    }
    .avg-box {
      order: 1;
    }
  }
</style>
