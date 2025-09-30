import React from "react";
import TermCard from "../components/TermCard";
import SpoonNoteModal from "../components/SpoonNoteModal";
import { patchReorderFolders, fetchUserFolders } from "../api/userWordbook";
import { renameUserFolder, deleteUserFolder, deleteUserFoldersBulk } from "../api/folder";

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

    const normalize = React.useCallback((s: string) => s.trim().replace(/\s+/g, " ").toLowerCase(), []);

    const openModalFor = React.useCallback((termId: number) => {
        setSelectedTermId(termId);
        setModalOpen(true);
    }, []);

    const closeModal = React.useCallback(() => {
        setModalOpen(false);
        setSelectedTermId(null);
    }, []);

    // 모달 열릴 때 폴더 목록 로드
    React.useEffect(() => {
        let aborted = false;
        (async () => {
            if (!modalOpen) return;
            try {
                const list = await fetchUserFolders();
                if (!aborted) setNotebooks(list);
            } catch {
                if (!aborted) setNotebooks([]);
            }
        })();
        return () => { aborted = true; };
    }, [modalOpen]);

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

    // 🔧 이름 바꾸기: 모달에서 호출됨
    const handleRequestRename = React.useCallback(
        async (folderId: string, currentName: string) => {
            const next = window.prompt("새 폴더 이름을 입력하세요.", currentName ?? "");
            if (next == null) return;
            const raw = next.trim();
            if (!raw) { alert("폴더 이름은 공백일 수 없습니다."); return; }
            if (raw.length > 60) { alert("폴더 이름은 최대 60자입니다."); return; }

            const dup = notebooks.some(n => n.id !== folderId && normalize(n.name) === normalize(raw));
            if (dup) { alert("동일한 이름의 폴더가 이미 존재합니다."); return; }

            try {
                await renameUserFolder(folderId, raw);
                // 로컬 즉시 반영 또는 서버 재조회 중 택1
                setNotebooks(prev => prev.map(n => n.id === folderId ? { ...n, name: raw } : n));
                // 또는: setNotebooks(await fetchUserFolders());
            } catch (e: any) {
                const s = e?.response?.status;
                if (s === 409) alert("동일한 이름의 폴더가 이미 존재합니다.");
                else if (s === 400) alert("폴더 이름 형식이 올바르지 않습니다.");
                else if (s === 403) alert("이 폴더에 대한 권한이 없습니다.");
                else if (s === 404) alert("폴더를 찾을 수 없습니다.");
                else alert("폴더 이름 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.");
            }
        },
        [notebooks, normalize]
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
                onRename={async (folderId, newName) => {
                    await renameUserFolder(folderId, newName);
                    setNotebooks(prev => prev.map(n => n.id === folderId ? ({ ...n, name: newName }) : n));
                }}
                onRequestDelete={async (fid, name) => {
                    await deleteUserFolder(fid, "purge");
                    setNotebooks(await fetchUserFolders());
                }}
                onRequestBulkDelete={async (ids) => {
                    if (!confirm(`선택 ${ids.length}개 폴더 삭제? (안의 용어도 삭제)`)) return;
                    setNotebooks(await fetchUserFolders());
                }}
            />
        </>
    );
}
