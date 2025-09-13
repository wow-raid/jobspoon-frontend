import React from "react";
import TermCard from "../components/TermCard";
import SpoonNoteModal from "../components/SpoonNoteModal";

const TERMS = [
    { id: 1, title: "클로저(Closure)", description: "함수가 생성될 때의 렉시컬 환경에 접근...", tags: ["js", "scope"] },
    { id: 2, title: "스레드(Thread)", description: "프로세스 내에서 실행되는 흐름의 단위...", tags: ["os", "parallel"] },
];

const INITIAL_NOTEBOOKS = [
    { id: "nb-1", name: "내가 찾은 용어" },
    { id: "nb-2", name: "Frontend" },
];

export default function SpoonWordListPage() {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [selectedTermId, setSelectedTermId] = React.useState<number | null>(null);
    const [notebooks, setNotebooks] = React.useState(INITIAL_NOTEBOOKS);

    const openModalFor = React.useCallback((termId: number) => {
        setSelectedTermId(termId);
        setModalOpen(true);
    }, []);

    const closeModal = React.useCallback(() => {
        setModalOpen(false);
        setSelectedTermId(null);
    }, []);

    const handleSaveToNotebook = React.useCallback(
        (notebookId: string, options?: { createdName?: string }) => {
            // 새 노트 생성 플로우(임시)
            if (notebookId === "NEW" && options?.createdName) {
                const newId = `nb-${Date.now()}`;
                setNotebooks((prev) => [{ id: newId, name: options.createdName! }, ...prev]);
                // 실제로는: const created = await api.createNotebook(options.createdName)
                //          await api.attachTerm({ termId: selectedTermId!, notebookId: created.id })
            } else {
                // 기존 노트에 저장
                // 실제로는: await api.attachTerm({ termId: selectedTermId!, notebookId })
            }
            closeModal();
        },
        [closeModal, selectedTermId]
    );

    return (
        <>
            <div style={{ display: "grid", gap: 16 }}>
                {TERMS.map((t) => (
                    <TermCard
                        key={t.id}
                        id={t.id}
                        title={t.title}
                        description={t.description}
                        tags={t.tags}
                        // 로그인 상태면 TermCard 내부 가드 통과 → 여기로 들어와 모달 오픈
                        onAdd={(id) => openModalFor(id)}
                        onTagClick={(tag) => console.log("tag:", tag)}
                    />
                ))}
            </div>

            <SpoonNoteModal
                open={modalOpen}
                notebooks={notebooks}
                onClose={closeModal}
                onSave={handleSaveToNotebook}
            />
        </>
    );
}
