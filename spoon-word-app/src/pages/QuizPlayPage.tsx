import React from "react";
import styled from "styled-components";
import { NarrowLeft } from "../styles/layout";
import { useLocation, useNavigate } from "react-router-dom";
import SoftBlobsBackground from "../components/SoftBlobsBackground";
import http, { authHeader } from "../utils/http";

/* ====== 색/토큰 ====== */
const UI = {
    bgGrad:
        "radial-gradient(1200px 600px at 50% -120px, rgba(79,118,241,.15) 0%, rgba(62,99,224,.10) 30%, rgba(255,255,255,0) 70%)",
    panel: "#ffffff",
    line: "#e5e7eb",
    text: "#0f172a",
    sub: "#374151",
    muted: "#6b7280",
    primary: "#3E63E0",
    primarySoft: "#e6edff",

    // 정답/오답 요청 색상
    danger: "#F95D5D",
    success: "#28C8A3",
    successSoft: "#e9fcf8",
    dangerSoft: "#fee6e6",

    shadow: "0 20px 60px rgba(62,99,224,.15)",
    radius: 20,
    gradient: {
        brand: "linear-gradient(135deg, #4F76F1 0%, #3E63E0 100%)",
        brandSoft:
            "linear-gradient(135deg, rgba(79,118,241,0.12) 0%, rgba(62,99,224,0.12) 100%)",
    },
};

/* ====== 레이아웃/스타일 ====== */
const Screen = styled.div`
    min-height: 60vh;
    padding: 26px 0 46px;
`;

const Card = styled.div`
    background: ${UI.panel};
    border: 1px solid ${UI.line};
    border-radius: 24px;
    box-shadow: ${UI.shadow};
    padding: clamp(20px, 4vw, 36px);
`;

const MetaRow = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 10px;
`;

const Chip = styled.span`
    display: inline-flex;
    align-items: center;
    height: 28px;
    padding: 0 12px;
    border-radius: 999px;
    background: ${UI.primarySoft};
    color: ${UI.primary};
    font-weight: 700;
    font-size: 13px;
    letter-spacing: -0.02em;
`;

/* 문제 제목(풀이/결과 공통) */
const QTitle = styled.h2`
    margin: 0;
    font-size: clamp(17px, 2.2vw, 20px);
    font-weight: 750;
    color: ${UI.text};
    letter-spacing: -0.02em;
    line-height: 1.45;
    em {
        font-style: normal;
        color: ${UI.danger};
        font-weight: 750;
    }
`;

/* 번호 + 제목 행 (풀이/결과 공통) */
const QLine = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: start;
    gap: 8px;
    margin: 12px 0 14px;
`;

const QNumText = styled.span`
    font-size: clamp(17px, 2.2vw, 20px);
    font-weight: 750;
    color: ${UI.text};
    line-height: 1.45;
    letter-spacing: -0.02em;
`;

/* 보기들 */
const Options = styled.div`
    display: grid;
    gap: 12px;
`;

const Opt = styled.button<{ $on?: boolean; $tone?: "normal" | "ok" | "bad" }>`
    width: 100%;
    display: flex;
    align-items: center;
    gap: 14px;
    border: 1px solid ${UI.line};
    background: #fff;
    padding: 14px 14px;
    border-radius: 14px;
    cursor: ${({ $tone }) => ($tone && $tone !== "normal" ? "default" : "pointer")};
    text-align: left;
    transition: transform 0.06s ease, background-color 0.12s ease,
    border-color 0.12s ease, box-shadow 0.12s ease;

    &:hover { background: #fbfbfd; }
    &:active { transform: scale(0.99); }
    &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(62,99,224,.25); }

    /* 선택 상태(문제 풀이 중) */
    ${({ $on }) => $on && `border-color:${UI.primary}; background:#f8faff;`}

        /* 결과 색상 */
    ${({ $tone }) =>
            $tone === "ok" && `border-color:${UI.success}; background:${UI.successSoft};`}
    ${({ $tone }) =>
            $tone === "bad" && `border-color:${UI.danger}; background:${UI.dangerSoft};`}
`;

const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display: "block" }}>
        <path d="M20 7L10 17l-6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

const Hollow = styled.span`
    width: 14px; height: 14px; border-radius: 999px;
    border: 2px solid ${UI.primary}; background: rgba(255,255,255,.7); display: block;
`;

const Bullet = styled.span<{ $on?: boolean; $tone?: "normal" | "ok" | "bad" }>`
    width: 28px; height: 28px; flex: 0 0 auto;
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 999px;
    background: ${({ $on }) => ($on ? UI.gradient.brand : UI.gradient.brandSoft)};
    color: ${({ $on }) => ($on ? "#fff" : "#0f172a")};

    ${({ $tone }) => $tone === "ok" && `background:${UI.success}; color:#fff;`}
    ${({ $tone }) => $tone === "bad" && `background:${UI.danger}; color:#fff;`}

    box-shadow: inset 0 1px 0 rgba(255,255,255,.28);
`;

const OptLabel = styled.div`
    font-size: 16px;
    font-weight: 700;
    color: ${UI.text};
`;

const Footer = styled.div`
    margin-top: 26px;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
`;

const Ghost = styled.button`
    height: 35px; padding: 0 16px; border-radius: 5px; font-weight: 700;
    background: #fff; color: ${UI.primary}; border: 1px solid ${UI.primary};
    cursor: pointer; transition: background-color .15s, color .15s, border-color .15s, transform .08s;
    &:hover { background: ${UI.primarySoft}; }
    &:active { transform: translateY(1px); }
    &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(62,99,224,.25); }
    &:disabled { opacity: .6; cursor: not-allowed; }
`;

const Primary = styled.button`
    height: 35px; padding: 0 18px; border-radius: 5px; font-weight: 700; letter-spacing: -0.02em;
    background: ${UI.primary}; border: 1px solid ${UI.primary}; color: #fff; cursor: pointer;
    transition: filter .15s, transform .08s;
    &:hover { filter: brightness(0.96); }
    &:active { transform: translateY(1px); }
    &:focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(79,118,241,.25); }
    &:disabled { opacity: .7; cursor: not-allowed; }
`;

const Badge = styled.span<{ $tone: "ok" | "bad" }>`
    margin-left: auto; padding: 2px 8px; border-radius: 999px;
    font-size: 12px; font-weight: 750;
    border: 1px solid ${({ $tone }) => ($tone === "ok" ? UI.success : UI.danger)};
    background: ${({ $tone }) => ($tone === "ok" ? UI.successSoft : UI.dangerSoft)};
    color: ${({ $tone }) => ($tone === "ok" ? UI.success : UI.danger)};
`;

const CrossS = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
);

/* 결과 리스트: 기본 번호 숨김 (겹침 방지) */
const ResultList = styled.ol`
    list-style: none;
    padding-left: 0;
    margin: 0;
`;

const truthy = (v: any): boolean => {
    if (v === true || v === 1) return true;
    const s = String(v ?? "").trim().toLowerCase();
    return s === "1" || s === "true" || s === "y" || s === "yes";
};

/* ====== 타입 ====== */
type PlayState = {
    sessionId?: number;
    title?: string;
    source?: "folder" | "category" | "selected" | "retry";
};

type SessionItem = {
    questionId: number;
    questionText: string;
    choices: { id: number; text: string; isAnswer?: boolean }[];
};

/* ====== 경로 유틸 ======
   - /quiz/result, /spoon-quiz/result, /spoon-word/quiz/result, /spoon-word/spoon-quiz/result 지원 */
const RESULT_PATH_RE = /(\/spoon-word)?\/(spoon-quiz|quiz)\/result$/;
const BASE_PATH_CAPTURE_RE = /(\/spoon-word)?\/(spoon-quiz|quiz)/;

function getQuizBasePath(pathname: string): string {
    const m = pathname.match(BASE_PATH_CAPTURE_RE);
    return m ? m[0].replace(/\/$/, "") : "/quiz";
}

/* 강조(‘않는’) 하이라이트 */
function emphasizeNot(text: string) {
    return text.replace(/(않는|않다|아닌|NOT)/gi, (m) => `<em>${m}</em>`);
}

/* ===================== ResultView ===================== */
function ResultView({ title, summary, items, answers, sessionId, onClose }: any) {
    const nav = useNavigate();
    const loc = useLocation();
    const [retrying, setRetrying] = React.useState(false);
    const [reviewDetails, setReviewDetails] = React.useState<any[] | null>(null);

    if (!summary) {
        return <p style={{ padding: 24 }}>결과를 찾을 수 없어요.</p>;
    }

    const ms = Number(summary.elapsedMs ?? 0);

    // summary.details에 정답/정오 정보가 부족하면 review API 호출
    React.useEffect(() => {
        const details = summary?.details;
        const hasEnoughData =
            Array.isArray(details) &&
            details.some(
                (d: any) =>
                    d.correctChoiceId ||
                    d.answerChoiceId ||
                    typeof d.correct === "boolean"
            );

        if (hasEnoughData || !sessionId) return;

        (async () => {
            try {
                const res = await http.get(`/me/quiz/sessions/${sessionId}/review`, {
                    headers: { ...authHeader() },
                    withCredentials: true,
                });
                const reviewData = res?.data?.details ?? res?.data ?? [];
                setReviewDetails(reviewData);
            } catch {
                // 리뷰 데이터가 없어도 기존 로직으로 표시
            }
        })();
    }, [sessionId, summary?.details]);

    // details 우선순위: summary.details → reviewDetails → 빈 배열
    const effectiveDetails =
        summary?.details?.length
            ? summary.details
            : (reviewDetails ?? []);

    // questionId를 문자열 키로 변환하여 맵 생성
    const detailMap = new Map<string, any>(
        effectiveDetails.map((d: any) => [
            String(d.quizQuestionId ?? d.questionId ?? d.qid ?? d.id),
            d,
        ])
    );

    const fallbackPickedMap = new Map<string, string>(
        (answers ?? []).map((a: any) => [
            String(a.quizQuestionId ?? a.questionId ?? a.qid ?? a.id),
            String(a.selectedChoiceId ?? a.choiceId ?? a.cid ?? a.value),
        ])
    );

    // ID를 "문자열 키"로 정규화
    const idKey = (v: any): string | null => {
        if (v == null || v === "") return null;
        if (Array.isArray(v)) return idKey(v[0]);
        if (typeof v === "object") {
            return idKey(
                v.id ??
                v.choiceId ??
                v.value ??
                v.answerId ??
                v.choice?.id ??
                v.solutionId ??
                v.solution?.id
            );
        }
        const s = String(v);
        return s.length ? s : null;
    };

    const pickKey = (...cands: any[]) => {
        for (const c of cands) {
            const k = idKey(c);
            if (k != null) return k;
        }
        return null;
    };

    const handleRetryWrong = async () => {
        if (!sessionId || retrying) return;
        setRetrying(true);
        try {
            const res = await http.post(
                `/me/quiz/sessions/${sessionId}/retry-wrong`,
                {},
                { headers: { ...authHeader() }, withCredentials: true }
            );
            const data = (res && (res as any).data) ? (res as any).data : res;
            const newSessionId = Number(
                data?.sessionId ?? data?.id ?? data?.session?.id
            );
            if (!Number.isFinite(newSessionId)) {
                throw new Error("세션 생성에 실패했습니다. (sessionId 없음)");
            }

            const base = getQuizBasePath(loc.pathname);
            nav(`${base}`, {
                state: { sessionId: newSessionId, title: title ?? "스푼퀴즈", source: "retry" },
                replace: true,
            });
        } catch (e: any) {
            const msg = e?.response?.data?.message ?? e?.message ?? "오답 세션 생성 중 오류가 발생했습니다.";
            alert(msg);
        } finally {
            setRetrying(false);
        }
    };

    const base = getQuizBasePath(loc.pathname);

    return (
        <div>
            <h1 style={{ margin: 0 }}>{title ?? "결과"}</h1>
            <p style={{ color: "#374151" }}>
                <strong>{summary.correct}</strong> / {summary.total} 정답 · {(ms / 1000).toFixed(1)}초
            </p>

            <ResultList>
                {(items ?? []).map((q: SessionItem, idx: number) => {
                    const d = detailMap.get(String(q.questionId));

                    // 내가 고른 보기(문자열 키)
                    const pickedKey =
                        pickKey(d?.choiceId, d?.selectedChoiceId, d?.quizChoiceId, d?.selectedId, d?.selected)
                        ?? fallbackPickedMap.get(String(q.questionId))
                        ?? null;

                    // 정답 키: details → items.isAnswer → (맞은 문제면) pickedKey
                    let correctKey =
                        pickKey(
                            d?.correctChoiceId,
                            d?.answerChoiceId,
                            d?.answerId,
                            d?.correctId,
                            d?.correctChoice?.id,
                            d?.answer?.id,
                            d?.solutionChoiceId,
                            d?.solution?.id,
                            d?.correctChoiceIds,
                            d?.answerChoiceIds
                        ) ?? null;

                    if (!correctKey) {
                        const ans = (q.choices ?? []).find((c) => c.isAnswer === true);
                        if (ans) correctKey = idKey(ans.id);
                    }
                    if (!correctKey && typeof d?.correct === "boolean" && d.correct && pickedKey) {
                        correctKey = pickedKey;
                    }

                    // 틀린 문제인지
                    const isPickedWrong =
                        typeof d?.correct === "boolean"
                            ? (!d.correct && pickedKey != null)
                            : (pickedKey != null && correctKey != null && pickedKey !== correctKey);

                    return (
                        <li key={String(q.questionId)} style={{ margin: "14px 0" }}>
                            <QLine>
                                <QNumText>{idx + 1}번.</QNumText>
                                <QTitle dangerouslySetInnerHTML={{ __html: emphasizeNot(q.questionText) }} />
                            </QLine>

                            <Options>
                                {q.choices.map((c) => {
                                    const cid = idKey(c.id);
                                    const isPicked = cid != null && pickedKey != null && cid === pickedKey;
                                    const isCorrectChoice =
                                        (cid != null && correctKey != null && cid === correctKey) ||
                                        (correctKey == null && c.isAnswer === true);

                                    let tone: "normal" | "ok" | "bad" = "normal";
                                    if (isPickedWrong && isPicked) tone = "bad";
                                    else if (isCorrectChoice) tone = "ok";

                                    return (
                                        <Opt as="div" key={String(c.id)} $tone={tone}>
                                            <Bullet aria-hidden $tone={tone}>
                                                {tone === "ok" ? <CheckIcon /> : tone === "bad" ? <CrossS /> : <Hollow />}
                                            </Bullet>
                                            <OptLabel>{c.text}</OptLabel>

                                            {isCorrectChoice && <Badge $tone="ok">정답</Badge>}
                                            {isPickedWrong && isPicked && <Badge $tone="bad">내 답</Badge>}
                                        </Opt>
                                    );
                                })}
                            </Options>
                        </li>
                    );
                })}
            </ResultList>

            <Footer>
                <Ghost type="button" onClick={() => onClose?.() ?? nav(base)}>닫기</Ghost>
                {(() => {
                    const wrongCount = Math.max(0, Number(summary.total) - Number(summary.correct));
                    return(
                        <Primary
                            type="button"
                            onClick={handleRetryWrong}
                            disabled={retrying || wrongCount === 0}
                            style={{ pointerEvents: retrying ? "none" : undefined }}
                        >
                            {retrying ? "다시 시작 중..." : "틀린 문제 다시 풀기"}
                        </Primary>
                    );
                })()}
            </Footer>
        </div>
    );
}

/* ===================== Page ===================== */
export default function QuizPlayPage() {
    const nav = useNavigate();
    const loc = useLocation();
    const payload = (loc.state ?? {}) as PlayState;

    const [items, setItems] = React.useState<SessionItem[]>([]);
    const [selectedByQ, setSelectedByQ] = React.useState<Record<number, number>>({});
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [err, setErr] = React.useState<string | null>(null);

    const startedAtRef = React.useRef<number>(performance.now());
    const [submitting, setSubmitting] = React.useState(false);
    const inFlightRef = React.useRef(false);

    // 결과 경로 여부 (이 파일에서 직접 처리)
    const isResultRoute = RESULT_PATH_RE.test(loc.pathname);

    React.useEffect(() => {
        if (isResultRoute) return;

        let aborted = false;
        const sid = payload.sessionId;

        const load = async () => {
            setLoading(true);
            setErr(null);
            try {
                if (!sid) { setErr("세션 ID가 없습니다."); return; }
                const res = await http.get(`/me/quiz/sessions/${sid}/items`, {
                    params: { offset: 0, limit: 200, includeAnswers: true },
                    headers: { ...authHeader() },
                    withCredentials: true,
                });
                const page = res.data ?? {};
                const arr: SessionItem[] = (page.items ?? []).map((row: any) => ({
                    questionId: Number(row.questionId ?? row.id),
                    questionText: String(row.questionText ?? row.question ?? "문항 본문이 없습니다."),
                    choices: (row.choices ?? []).map((c: any) => ({
                        id: Number(c.id ?? c.choiceId),
                        text: String(c.text ?? c.choiceText ?? ""),
                        isAnswer: truthy(
                            c.isAnswer ?? c.is_answer ?? c.answer ?? c.correct ?? c.isRight ?? c.right ?? c.solution
                        ),
                    })),
                }));
                if (!aborted) {
                    setItems(arr);
                    setSelectedByQ({});
                    setTotal(Number.isFinite(page.total) ? Number(page.total) : arr.length);
                }
            } catch (e: any) {
                if (!aborted) setErr(e?.message ?? "문항을 불러오지 못했어요.");
            } finally {
                if (!aborted) setLoading(false);
            }
        };

        load();
        return () => { aborted = true; };
    }, [isResultRoute, payload.sessionId, payload.title]);

    const submit = async () => {
        if (inFlightRef.current) return;
        inFlightRef.current = true;
        setSubmitting(true);

        try {
            const answers = items.map((q) => ({
                quizQuestionId: Number(q.questionId),
                selectedChoiceId: Number(selectedByQ[q.questionId]),
            }));

            const resp = await http.post(
                `/me/quiz/sessions/${payload.sessionId}/submit`,
                { answers, elapsedMs: Math.round(performance.now() - startedAtRef.current) },
                { headers: { ...authHeader() }, withCredentials: true }
            );

            const summary = (resp && typeof resp === "object" && "data" in resp) ? (resp as any).data : resp;

            const base = getQuizBasePath(loc.pathname) || "/quiz";
            nav(`${base}/result`, {
                state: {
                    sessionId: payload.sessionId,
                    title: payload.title ?? "스푼퀴즈",
                    summary,
                    items,
                    answers
                },
                replace: true,
            });
        } catch (e: any) {
            const msg = e?.response?.data?.message ?? e?.message ?? "제출 중 오류";
            alert(msg);
        } finally {
            inFlightRef.current = false;
            setSubmitting(false);
        }
    };

    // ===== 렌더링 분기 =====
    if (isResultRoute) {
        const st = (loc.state as any) ?? {};
        const base = getQuizBasePath(loc.pathname);
        return (
            <>
                {/* 결과 화면도 동일한 배경/용지 적용 */}
                <SoftBlobsBackground />
                <Screen>
                    <NarrowLeft>
                        <Card>
                            <ResultView
                                title={st.title}
                                summary={st.summary}
                                items={st.items}
                                answers={st.answers}
                                sessionId={st.sessionId}
                                onClose={() => nav(base)}
                            />
                        </Card>
                    </NarrowLeft>
                </Screen>
            </>
        );
    }

    const answeredCount = Object.keys(selectedByQ).length;
    const unanswered = items.filter((q) => selectedByQ[q.questionId] == null);

    return (
        <>
            <SoftBlobsBackground />
            <Screen>
                <NarrowLeft>
                    <Card>
                        {loading ? (
                            <p>불러오는 중…</p>
                        ) : err ? (
                            <p style={{ color: UI.danger }}>{err}</p>
                        ) : items.length === 0 ? (
                            <p>표시할 문항이 없습니다.</p>
                        ) : (
                            <>
                                <MetaRow>
                                    <Chip>총 {total}문항</Chip>
                                    <Chip>응답 {answeredCount}/{total}</Chip>
                                </MetaRow>

                                {items.map((q, idx) => (
                                    <div key={q.questionId} style={{ marginBottom: 24 }}>
                                        {/* 문제 번호 "텍스트" + 제목 */}
                                        <QLine>
                                            <QNumText>{idx + 1}번.</QNumText>
                                            <QTitle
                                                dangerouslySetInnerHTML={{ __html: emphasizeNot(q.questionText) }}
                                            />
                                        </QLine>

                                        <Options role="radiogroup" aria-label={`문항 ${q.questionId} 정답 선택`}>
                                            {q.choices.map((o) => {
                                                const on = selectedByQ[q.questionId] === o.id;
                                                return (
                                                    <Opt
                                                        key={o.id}
                                                        $on={on}
                                                        role="radio"
                                                        aria-checked={on}
                                                        onClick={() =>
                                                            setSelectedByQ((prev) => ({ ...prev, [q.questionId]: o.id }))
                                                        }
                                                    >
                                                        <Bullet aria-hidden $on={on}>
                                                            {on ? <CheckIcon /> : <Hollow />}
                                                        </Bullet>
                                                        <OptLabel>{o.text}</OptLabel>
                                                    </Opt>
                                                );
                                            })}
                                        </Options>
                                    </div>
                                ))}

                                <Footer>
                                    <Ghost onClick={() => nav(-1)}>취소</Ghost>
                                    <Primary
                                        type="button"
                                        onClick={submit}
                                        disabled={submitting || unanswered.length > 0}
                                        style={{ pointerEvents: submitting ? "none" : undefined }}
                                    >
                                        제출 완료
                                    </Primary>
                                </Footer>
                            </>
                        )}
                    </Card>
                </NarrowLeft>
            </Screen>
        </>
    );
}