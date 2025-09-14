import React from "react";
import TermCard from "../components/TermCard";
import SpoonNoteModal from "../components/SpoonNoteModal";
import { patchReorderFolders } from "../api/userWordbook";

type Notebook = { id: string; name: string };

const TERMS = [
    { id: 1, title: "클로저(Closure)", description: "함수가 생성될 때의 렉시컬 환경에 접근...", tags: ["js", "scope"] },
    { id: 2, title: "스레드(Thread)", description: "프로세스 내에서 실행되는 흐름의 단위...", tags: ["os", "parallel"] },
];

// 용어 카드의 article에 aria-labelledby="term-<id>" 패턴을 쓴다는 가정
function extractTermIdFromArticle(el: HTMLElement | null): number | null {
    const article = el?.closest("article");
    if (!article) return null;
    const labelled = article.getAttribute("aria-labelledby"); // "term-<id>"
    if (!labelled) return null;
    const m = /^term-(\d+)$/.exec(labelled);
    if (!m) return null;
    const idNum = Number(m[1]);
    return Number.isFinite(idNum) ? idNum : null;
}

export default function SpoonWordListPage() {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedTermId, setSelectedTermId] = React.useState<number | null>(null);
    const [notebooks, setNotebooks] = React.useState<Notebook[]>([]);

    const openModalFor = React.useCallback((termId: number) => {
        setSelectedTermId(termId);
        setModalOpen(true);
    }, []);

    const closeModal = React.useCallback(() => {
        setModalOpen(false);
        setSelectedTermId(null);
    }, []);

    // 전역 위임 클릭 핸들러: TermCard 내부에서 onAdd를 안 불러도 동작하게 백업 라인
    React.useEffect(() => {
        function onDocClick(e: MouseEvent) {
            const target = e.target as HTMLElement | null;
            if (!target) return;
            const addBtn = target.closest('button[aria-label="내 단어장에 추가"]') as HTMLElement | null;
            if (!addBtn) return;
            if (modalOpen) return;

            const termId = extractTermIdFromArticle(addBtn);
            if (!termId) return;

            setSelectedTermId(termId);
            setModalOpen(true);
        }

        document.addEventListener("click", onDocClick, true);
        return () => document.removeEventListener("click", onDocClick, true);
    }, [modalOpen]);

    // 드래그 앤 드롭 저장
    const handleReorder = React.useCallback(async (orderedIds: string[]) => {
        let serverOk = true;
        try {
            await patchReorderFolders(orderedIds as unknown as Array<string | number>);
        } catch (e: any) {
            serverOk = false;
            if (e?.message === "NON_NUMERIC_ID") {
                console.warn("[reorder] 서버 저장 생략: 숫자 id가 아님", orderedIds);
            } else {
                console.error("[reorder] 서버 오류:", e);
                return; // 실패 시 모달 컴포넌트가 자체 롤백
            }
        }

        // 성공 또는 개발용 생략 시 로컬 상태 재정렬
        setNotebooks(prev => {
            const map = new Map(prev.map(n => [n.id, n]));
            const next = orderedIds.map(id => map.get(id)).filter(Boolean) as typeof prev;
            const leftovers = prev.filter(n => !orderedIds.includes(n.id));
            return [...next, ...leftovers];
        });

        if (serverOk) console.debug("[reorder] 서버 저장 완료", orderedIds);
    }, []);

    // 저장 버튼
    const handleSaveToNotebook = React.useCallback(
        async (notebookId: string) => {
            if (!selectedTermId) return;
            // TODO: 백엔드 attach API 붙이면 여기서 호출
            closeModal();
        },
        [selectedTermId, closeModal]
    );

    return (
        <>
            <div style={{ display: "grid", gap: 16 }}>
                {TERMS.map(t => (
                    <TermCard
                        key={t.id}
                        id={t.id}
                        title={t.title}
                        description={t.description}
                        tags={t.tags}
                        // TermCard가 onAdd를 호출해 주면 이 라인으로 동작
                        onAdd={() => openModalFor(t.id)}
                        onTagClick={(tag: string) => console.log("tag:", tag)}
                    />
                ))}
            </div>

            <SpoonNoteModal
                open={modalOpen}
                notebooks={notebooks}
                onClose={closeModal}
                onSave={handleSaveToNotebook}
                onReorder={handleReorder}
            />
        </>
    );
}
