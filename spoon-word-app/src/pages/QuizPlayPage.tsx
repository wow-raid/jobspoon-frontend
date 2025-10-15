import React from "react";
import styled from "styled-components";
import { NarrowLeft } from "../styles/layout";
import { useLocation, useNavigate } from "react-router-dom";
import SoftBlobsBackground from "../components/SoftBlobsBackground";
import http, { authHeader } from "../utils/http";

/* ====== 색/토큰 ====== */
const UI = {
    bgGrad: "radial-gradient(1200px 600px at 50% -120px, rgba(79,118,241,.15) 0%, rgba(62,99,224,.10) 30%, rgba(255,255,255,0) 70%)",
    panel: "#ffffff",
    line: "#e5e7eb",
    text: "#0f172a",
    sub: "#374151",
    muted: "#6b7280",
    primary: "#3E63E0",
    primarySoft: "#e6edff",
    danger: "#ef4444",
    shadow: "0 20px 60px rgba(62,99,224,.15)",
    radius: 20,
    gradient: {
        brand: "linear-gradient(135deg, #4F76F1 0%, #3E63E0 100%)",
        brandSoft: "linear-gradient(135deg, rgba(79,118,241,0.12) 0%, rgba(62,99,224,0.12) 100%)",
    },
};

/* ====== 레이아웃/스타일 ====== */
const Screen = styled.div`min-height:60vh; padding:26px 0 46px;`;
const Card = styled.div`
    background:${UI.panel}; border:1px solid ${UI.line}; border-radius:24px;
    box-shadow:${UI.shadow}; padding:clamp(20px,4vw,36px);
`;
const MetaRow = styled.div`display:flex; gap:10px; flex-wrap:wrap; margin-bottom:10px;`;
const Chip = styled.span`
    display:inline-flex; align-items:center; height:28px; padding:0 12px; border-radius:999px;
    background:${UI.primarySoft}; color:${UI.primary}; font-weight:700; font-size:13px; letter-spacing:-0.02em;
`;
const QTitle = styled.h2`
    margin: 12px 0 14px; font-size: clamp(17px, 2.2vw, 20px); font-weight: 750;
    color: ${UI.text}; letter-spacing: -0.02em; line-height: 1.45;
    em { font-style: normal; color: ${UI.danger}; font-weight: 750; }
`;
const ItemCard = styled.div`
    padding: 18px; border:1px solid ${UI.line}; border-radius:16px; margin-bottom:18px;
    background:#fff;
`;

const Options = styled.div`display:grid; gap:12px;`;
const Opt = styled.button<{ $on?: boolean }>`
    width:100%; display:flex; align-items:center; gap:14px;
    border:1px solid ${UI.line}; background:#fff; padding:14px 14px; border-radius:14px;
    cursor:pointer; text-align:left; transition:transform .06s ease, background-color .12s ease, border-color .12s ease, box-shadow .12s ease;
    &:hover { background:#fbfbfd; } &:active { transform:scale(.99); }
    &:focus-visible { outline:none; box-shadow:0 0 0 3px rgba(62,99,224,.25); }
    ${({ $on }) => $on && `border-color:${UI.primary}; background:#f8faff;`}
`;
const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={{ display:"block" }}>
        <path d="M20 7L10 17l-6-6" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
);
const Hollow = styled.span`
    width:14px; height:14px; border-radius:999px; border:2px solid ${UI.primary}; background:rgba(255,255,255,0.7); display:block;
`;
const Bullet = styled.span<{ $on?: boolean }>`
    width:28px; height:28px; flex:0 0 auto; display:inline-flex; align-items:center; justify-content:center;
    border-radius:999px; background:${({$on}) => ($on ? UI.gradient.brand : UI.gradient.brandSoft)};
    color:${({$on}) => ($on ? "#fff" : "#0f172a")}; box-shadow:inset 0 1px 0 rgba(255,255,255,0.28);
`;
const OptLabel = styled.div`font-size:16px; font-weight:700; color:${UI.text};`;

const Footer = styled.div`margin-top:26px; display:flex; justify-content:flex-end; gap:10px;`;
const Ghost = styled.button`
    height:35px; padding:0 16px; border-radius:5px; font-weight:700; background:#fff; color:${UI.primary};
    border:1px solid ${UI.primary}; cursor:pointer; transition:background-color .15s, color .15s, border-color .15s, transform .08s;
    &:hover { background:${UI.primarySoft}; } &:active { transform: translateY(1px); }
    &:focus-visible { outline:none; box-shadow:0 0 0 3px rgba(62,99,224,.25); } &:disabled { opacity:.6; cursor:not-allowed; }
`;
const Primary = styled.button`
    height:35px; padding:0 18px; border-radius:5px; font-weight:700; letter-spacing:-0.02em; background:${UI.primary}; border:1px solid ${UI.primary};
    color:#fff; cursor:pointer; transition:filter .15s, transform .08s;
    &:hover { filter: brightness(0.96); } &:active { transform: translateY(1px); }
    &:focus-visible { outline:none; box-shadow:0 0 0 3px rgba(79,118,241,.25); } &:disabled { opacity:.7; cursor:not-allowed; }
`;

/* ====== 타입 ====== */
type PlayState = {
    sessionId?: number;
    title?: string;
    source?: "folder" | "category" | "selected";
};

type QuizOption = { id: number; text: string };
type Quiz = {
    id: number;
    question: string;
    options: QuizOption[];
    categories: string[];
};

/* 강조(‘않는’) 하이라이트 */
function emphasizeNot(text: string) {
    return text.replace(/(않는|아닌|NOT)/gi, (m) => `<em>${m}</em>`);
}

export default function QuizPlayPage() {
    const nav = useNavigate();
    const payload = (useLocation().state ?? {}) as PlayState;

    type SessionItem = {
        questionId: number;
        questionText: string;
        choices: { id: number; text: string }[];
    };

    const [items, setItems] = React.useState<SessionItem[]>([]);
    const [selectedByQ, setSelectedByQ] = React.useState<Record<number, number>>({});
    const [total, setTotal] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [err, setErr] = React.useState<string | null>(null);

    const startedAtRef = React.useRef<number>(performance.now());
    const [submitting, setSubmitting] = React.useState(false);

    // 여러 문항 한 번에 로드
    React.useEffect(() => {
        let aborted = false;
        const sid = payload.sessionId;
        const tryGet = (url: string, params?: any) =>
            http.get(url, {
                params,
                headers: { ...authHeader() },
                withCredentials: true,
                validateStatus: () => true,
            });

        const normalize = (row: any): Quiz | null => {
            const qid = Number(row.questionId ?? row.quizQuestionId ?? row.id);
            if (!Number.isFinite(qid)) return null;

            const text =
                String(row.questionText ?? row.text ?? row.question ?? "문항 본문이 없습니다.");

            const choicesRaw = row.choices ?? row.options ?? [];
            const options: QuizOption[] = (Array.isArray(choicesRaw) ? choicesRaw : [])
                .map((o: any, i: number) => {
                    const cid = Number(o.id ?? o.choiceId ?? i + 1);
                    if (!Number.isFinite(cid)) return null;
                    const label = String(o.text ?? o.choiceText ?? o.label ?? `보기 ${i + 1}`);
                    return { id: cid, text: label };
                })
                .filter(Boolean) as QuizOption[];

            const cats = payload.title ? [payload.title] : [];
            return { id: qid, question: text, options, categories: cats };
        };

        const load = async () => {
            setLoading(true); setErr(null);
            try {
                if (!sid) { setErr("세션 ID가 없습니다."); return; }

                // limit을 크게 줘서 한 번에 모두 가져오기 (백엔드가 total 까지만 반환)
                const res = await http.get(`/me/quiz/sessions/${sid}/items`, {
                    params: { offset: 0, limit: 200 }, // 컨트롤러에서 캡(예: 200)로 처리
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
                    })),
                }));
                setItems(arr);
                setSelectedByQ({});
                setTotal(Number.isFinite(page.total) ? Number(page.total) : arr.length);
            } catch (e: any) {
                if (!aborted) setErr(e?.message ?? "문항을 불러오지 못했어요.");
            } finally {
                if (!aborted) setLoading(false);
            }
        };

        load();
        return () => { aborted = true; };
    }, [payload.sessionId, payload.title]);

    const submit = async () => {
        if (!payload.sessionId) return;

        // 전체 문항이 다 선택됐는지 검사
        const unanswered = items.filter((q) => selectedByQ[q.questionId] == null);
        if (unanswered.length) {
            alert(`${unanswered.length}개 문항이 선택되지 않았어요.`);
            return;
        }

        const answers = items.map((q) => {
            const cid = selectedByQ[q.questionId];
            return {
                quizQuestionId: Number(q.questionId),
                questionId: Number(q.questionId),

                selectedChoiceId: Number(cid),
                choiceId: Number(cid),
                quizChoiceId: Number(cid),
            };
        });

        setSubmitting(true);
        try {
            await http.post(
                `/me/quiz/sessions/${payload.sessionId}/submit`,
                {
                    answers,
                    elapsedMs: Math.round(performance.now() - startedAtRef.current),
                },
                { headers: { ...authHeader() }, withCredentials: true }
            );
            alert("제출 완료!");
            nav(-1);
        } catch (e: any) {
            // 400일 때 서버가 이유 메시지를 내려주면 보여주기
            const msg = e?.response?.data?.message ?? e?.message ?? "제출 중 오류";
            alert(msg);
        } finally {
            setSubmitting(false);
        }
    };

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

                                {items.map((q) => (
                                    <div key={q.questionId} style={{ marginBottom: 24 }}>
                                        <QTitle dangerouslySetInnerHTML={{ __html: emphasizeNot(q.questionText) }} />
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
                                                        <Bullet aria-hidden $on={on}>{on ? <CheckIcon /> : <Hollow />}</Bullet>
                                                        <OptLabel>{o.text}</OptLabel>
                                                    </Opt>
                                                );
                                            })}
                                        </Options>
                                    </div>
                                ))}

                                <Footer>
                                    <Ghost onClick={() => nav(-1)}>취소</Ghost>
                                    <Primary onClick={submit} disabled={submitting || unanswered.length > 0}>
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
