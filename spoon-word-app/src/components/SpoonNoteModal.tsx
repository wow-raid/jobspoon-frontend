import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

type Notebook = { id: string; name: string };

export type SpoonNoteModalProps = {
    open: boolean;
    notebooks: Notebook[];
    onClose: () => void;
    // attach(저장) 전용 콜백
    onSave: (notebookId: string) => void | Promise<void>;
    // 새 폴더 생성 전용 콜백 (모달은 닫지 않음)
    // 반환값은 생성된 notebook의 id (동기/비동기 모두 허용)
    onCreate?: (name: string) => string | Promise<string>;
    // 폴더 순서 저장 콜백 (서버 PATCH 위임)
    onReorder?: (orderedIds: string[]) => void | Promise<void>;
};

const TOKENS = {
    color: {
        overlay: "rgba(17,24,39,0.45)",
        panelBg: "#ffffff",
        textPrimary: "#111827",
        textSecondary: "#374151",
        textMuted: "#6b7280",
        line: "#e5e7eb",
        primary: "#3b82f6",
        primaryHover: "#2563eb",
        btnGhost: "#f3f4f6",
        danger: "#ef4444",
        dangerBg: "#fef2f2",
        success: "#10b981",
        bar: "#c7d2fe",
    },
    radius: { panel: 14, item: 10, btn: 10 },
    space: (n: number) => `${n}px`,
    shadow: { panel: "0 8px 30px rgba(0,0,0,0.12)" },
    font: { h3: "18px", body: "15px", help: "12px" },
} as const;

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: ${TOKENS.color.overlay};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2147483647;
`;

const Panel = styled.div`
    position: relative;
    width: 420px;
    max-width: calc(100vw - 32px);
    background: ${TOKENS.color.panelBg};
    border-radius: ${TOKENS.radius.panel}px;
    box-shadow: ${TOKENS.shadow.panel};
    overflow: hidden;
`;

const Header = styled.div`
    padding: ${TOKENS.space(18)} ${TOKENS.space(20)};
    font-size: ${TOKENS.font.h3};
    font-weight: 700;
    color: ${TOKENS.color.textPrimary};
    border-bottom: 1px solid ${TOKENS.color.line};
`;

const Body = styled.div`
    padding: ${TOKENS.space(12)} ${TOKENS.space(14)};
`;

const List = styled.div<{ $disabled?: boolean }>`
    pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
    opacity: ${({ $disabled }) => ($disabled ? 0.6 : 1)};
`;

const Row = styled.button<{ $dragging?: boolean; $barTop?: boolean; $barBottom?: boolean }>`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${TOKENS.space(10)};
    padding: ${TOKENS.space(12)} ${TOKENS.space(10)};
    border-radius: ${TOKENS.radius.item}px;
    background: transparent;
    border: none;
    text-align: left;
    position: relative;

    cursor: grab;
    &:active {
        cursor: grabbing;
    }

    &:hover {
        background: #f9fafb;
    }
    & + & {
        border-top: 1px solid ${TOKENS.color.line};
    }

    outline: ${({ $dragging }) => ($dragging ? `2px dashed ${TOKENS.color.primary}` : "none")};

    &::before {
        content: "";
        position: absolute;
        left: 8px;
        right: 8px;
        height: 3px;
        top: ${({ $barTop }) => ($barTop ? "-2px" : "auto")};
        bottom: ${({ $barBottom }) => ($barBottom ? "-2px" : "auto")};
        background: ${({ $barTop, $barBottom }) => ($barTop || $barBottom ? TOKENS.color.bar : "transparent")};
        border-radius: 3px;
    }
`;

const Left = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1 1 auto;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
    width: 18px;
    height: 18px;
    cursor: pointer;

    /* 체크박스 안쪽(체크 마크+배경) 색상을 파란색으로 고정 */
    accent-color: ${TOKENS.color.primary};

    /* 접근성 포커스 링도 동일 톤으로 */
    &:focus-visible {
        outline: 2px solid ${TOKENS.color.primary};
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.55;
        cursor: not-allowed;
    }
`;

const Name = styled.span`
    color: ${TOKENS.color.textPrimary};
    font-size: ${TOKENS.font.body};
`;

const Arrow = styled.span`
    margin-left: auto;
    color: ${TOKENS.color.textMuted};
`;

const CreateBar = styled.div<{ $invalid?: boolean }>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: ${TOKENS.space(10)} ${TOKENS.space(10)};
    background: ${({ $invalid }) => ($invalid ? TOKENS.color.dangerBg : "#f8fafc")};
    border-radius: ${TOKENS.radius.item}px;
    margin: ${TOKENS.space(8)} 0 ${TOKENS.space(4)};
    border: 1px solid ${({ $invalid }) => ($invalid ? TOKENS.color.danger : "transparent")};
`;

const Plus = styled.span`
    color: ${TOKENS.color.primary};
    font-weight: 700;
    font-size: 18px;
`;

const Input = styled.input`
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: ${TOKENS.font.body};
    color: ${TOKENS.color.textPrimary};
`;

const ErrorRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 6px 2px 0;
`;

const ErrorIcon = styled.svg`
    width: 16px;
    height: 16px;
    flex: 0 0 16px;
    color: ${TOKENS.color.danger};
    margin-top: 2px;
`;

const ErrorText = styled.p`
    margin: 0;
    font-size: ${TOKENS.font.help};
    color: ${TOKENS.color.danger};
`;

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    padding: ${TOKENS.space(14)} ${TOKENS.space(16)};
    border-top: 1px solid ${TOKENS.color.line};
`;

const GhostBtn = styled.button`
    min-width: 84px;
    height: 36px;
    border-radius: ${TOKENS.radius.btn}px;
    border: 1px solid ${TOKENS.color.line};
    background: ${TOKENS.color.btnGhost};
    color: ${TOKENS.color.textSecondary};
    font-weight: 600;
    cursor: pointer;
`;

const PrimaryBtn = styled.button<{ disabled?: boolean }>`
    min-width: 96px;
    height: 36px;
    border-radius: ${TOKENS.radius.btn}px;
    border: none;
    background: ${TOKENS.color.primary};
    color: #fff;
    font-weight: 700;
    cursor: pointer;

    &:hover {
        background: ${TOKENS.color.primaryHover};
    }

    &:disabled,
    &[aria-disabled="true"] {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const Divider = styled.div`
    height: 1px;
    background: ${TOKENS.color.line};
    margin: ${TOKENS.space(12)} 0;
`;

/* 저장됨 체크 뱃지 */
const SavedBadge = styled.div<{ $show: boolean }>`
    position: absolute;
    top: 8px;
    right: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: #ecfdf5;
    border: 1px solid #d1fae5;
    color: ${TOKENS.color.success};
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    opacity: ${({ $show }) => ($show ? 1 : 0)};
    transform: translateY(${({ $show }) => ($show ? "0px" : "-6px")});
    transition: all 240ms ease;
`;

export default function SpoonNoteModal({
                                           open,
                                           notebooks,
                                           onClose,
                                           onSave,
                                           onCreate,
                                           onReorder,
                                       }: SpoonNoteModalProps) {
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [creating, setCreating] = React.useState(false);
    const [newName, setNewName] = React.useState("");
    const [error, setError] = React.useState<string>("");

    // 로컬 목록 상태 + 드래그 상태 + 저장 상태
    const [list, setList] = React.useState<Notebook[]>([]);
    const [draggingId, setDraggingId] = React.useState<string | null>(null);
    const [dragOver, setDragOver] = React.useState<{ id: string; edge: "top" | "bottom" } | null>(null);
    const [savingOrder, setSavingOrder] = React.useState(false);
    const [showSaved, setShowSaved] = React.useState(false);
    const lastStableRef = React.useRef<Notebook[]>([]); // 롤백용

    React.useEffect(() => {
        if (!open) {
            setSelectedId(null);
            setCreating(false);
            setNewName("");
            setError("");
            setDraggingId(null);
            setDragOver(null);
            setSavingOrder(false);
            setShowSaved(false);
        }
    }, [open]);

    // 모달이 열릴 때/리스트 갱신 시 동기화
    React.useEffect(() => {
        if (open) {
            setList(notebooks);
            lastStableRef.current = notebooks;
        }
    }, [open, notebooks]);

    // 이름 정규화 (공백 정리 + 소문자)
    const normalizeName = React.useCallback((s: string) => {
        return s.trim().replace(/\s+/g, " ").toLowerCase();
    }, []);

    React.useEffect(() => {
        function onKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
            if (e.key === "Enter") handlePrimary();
        }
        if (open) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, creating, selectedId, newName, error]);

    const handleToggle = (id: string) => {
        if (draggingId) return; // 드래그 중 클릭 방지
        setSelectedId((prev) => (prev === id ? null : id));
    };

    const handleCreateToggle = () => {
        setCreating(true);
        setSelectedId(null);
        setError("");
    };

    // 입력 변경 시 즉시 검증(프론트 1차)
    const handleChangeName = (val: string) => {
        setNewName(val);
        const normalized = normalizeName(val);
        if (!normalized) {
            setError("공백만 입력할 수 없어요.");
            return;
        }
        const dup = list.some((n) => normalizeName(n.name) === normalized);
        if (dup) {
            setError("중복되는 이름입니다.");
            return;
        }
        setError("");
    };

    // 생성 모드의 기본 액션 (모달 닫지 않음)
    const handleCreate = async () => {
        const name = newName.trim();
        if (!name) {
            setError("공백만 입력할 수 없어요.");
            return;
        }
        if (error) return;

        try {
            let newId: string | undefined;
            if (onCreate) {
                const r = onCreate(name);
                newId = typeof (r as any)?.then === "function" ? await (r as Promise<string>) : (r as string);
            }
            // 성공 시 입력/에러 초기화 + 생성한 폴더 선택
            setCreating(false);
            setNewName("");
            setError("");
            if (newId) setSelectedId(newId);
        } catch (e: any) {
            const status = e?.response?.status;
            if (e?.message === "DUPLICATE_LOCAL" || status === 409) {
                setError("중복되는 이름입니다.");
            } else if (e?.message === "EMPTY_NAME" || status === 400) {
                setError("공백만 입력할 수 없어요.");
            } else {
                setError("폴더 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.");
            }
        }
    };

    // 저장(attach) 액션 — 이때만 부모가 모달을 닫음
    const handleSave = async () => {
        if (!selectedId) return;
        await Promise.resolve(onSave(selectedId));
    };

    // 현재 모드에 따른 기본 버튼 액션
    const handlePrimary = () => {
        if (creating) handleCreate();
        else handleSave();
    };

    // 유틸: 배열 이동
    const moveItem = (arr: Notebook[], from: number, to: number) => {
        const copy = arr.slice();
        const [m] = copy.splice(from, 1);
        copy.splice(to, 0, m);
        return copy;
    };

    // DnD: 시작
    const onDragStart = (id: string, e: React.DragEvent) => {
        setDraggingId(id);
        setDragOver(null);
        try {
            e.dataTransfer.effectAllowed = "move";
            // Firefox에서 drag 이미지가 이상하게 잡히는 것을 방지
            const img = document.createElement("div");
            img.style.position = "absolute";
            img.style.top = "-99999px";
            img.style.left = "-99999px";
            document.body.appendChild(img);
            e.dataTransfer.setDragImage(img, 0, 0);
            setTimeout(() => document.body.removeChild(img), 0);
        } catch {
            // setDragImage 미지원/에러 시 무시
        }
    };

    // 행 전체 드래그 시작 가드 (체크박스에서 시작한 드래그는 취소)
    const onRowDragStart = (id: string, e: React.DragEvent<HTMLButtonElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest('input[type="checkbox"]')) {
            e.preventDefault();
            return;
        }
        onDragStart(id, e);
    };

    const onDragOverRow = (overId: string, e: React.DragEvent<HTMLButtonElement>) => {
        if (!draggingId || draggingId === overId) return;
        e.preventDefault();                   // drop 허용
        e.dataTransfer.dropEffect = "move";   // 시각적 피드백

        const rect = e.currentTarget.getBoundingClientRect();
        const isBottom = e.clientY - rect.top > rect.height / 2;
        setDragOver({ id: overId, edge: isBottom ? "bottom" : "top" });
    };

    const onDropRow = async (overId: string, e: React.DragEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!draggingId || draggingId === overId) {
            setDraggingId(null);
            setDragOver(null);
            return;
        }

        const from = list.findIndex(n => n.id === draggingId);
        const base = list.findIndex(n => n.id === overId);
        if (from < 0 || base < 0) {  // 안전가드
            setDraggingId(null);
            setDragOver(null);
            return;
        }

        let to = base + (dragOver?.edge === "bottom" ? 1 : 0);

        // 아래 방향 이동 시 제거로 인한 인덱스 당김 보정
        if (from < to) to--;

        // 범위 클램프 + 변화 없음 가드
        to = Math.max(0, Math.min(to, list.length - 1));
        if (from === to) {            // 위치가 같다면 작업 불필요
            setDraggingId(null);
            setDragOver(null);
            return;
        }

        const prev = list;
        const next = moveItem(list, from, to);

        // 낙관적 갱신 + 저장 중 잠금
        setList(next);
        setSavingOrder(true);
        setDraggingId(null);
        setDragOver(null);

        try {
            lastStableRef.current = prev; // 롤백 기준
            if (onReorder) {
                await Promise.resolve(onReorder(next.map(n => n.id)));
            }
            // 성공 배지
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 1200);

            // 성공 시 안정 상태 갱신
            lastStableRef.current = next;
        } catch (err) {
            console.error("[folders reorder] PATCH failed:", err); // 원인 보이게
            setList(lastStableRef.current);                        // 실패 롤백
        } finally {
            setSavingOrder(false);
        }
    };

    const onDragEnd = () => {
        setDraggingId(null);
        setDragOver(null);
    };

    if (!open) return null;

    const isCreateInvalid = creating && (!!error || newName.trim().length === 0);

    const modal = (
        <Overlay role="dialog" aria-modal="true" aria-label="내 SpoonNote에 저장하기">
            <Panel>
                <SavedBadge $show={showSaved} aria-live="polite">
                    <span aria-hidden="true">✓</span> 저장됨
                </SavedBadge>

                <Header>내 SpoonNote에 저장하기</Header>
                <Body>
                    {!creating ? (
                        <Row onClick={handleCreateToggle} type="button" aria-label="새로운 SpoonNote에 만들기">
                            <Left>
                                <Plus>＋</Plus>
                                <Name>새로운 SpoonNote에 만들기</Name>
                            </Left>
                            <Arrow>›</Arrow>
                        </Row>
                    ) : (
                        <>
                            <CreateBar $invalid={!!error}>
                                <Plus>＋</Plus>
                                <Input
                                    autoFocus
                                    placeholder="새 노트 이름을 입력하세요"
                                    value={newName}
                                    onChange={(e) => handleChangeName(e.target.value)}
                                    aria-invalid={!!error}
                                    aria-describedby={error ? "notebook-name-error" : undefined}
                                />
                            </CreateBar>

                            {error && (
                                <ErrorRow>
                                    <ErrorIcon viewBox="0 0 24 24" aria-hidden="true">
                                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
                                        <line x1="12" y1="7" x2="12" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        <circle cx="12" cy="17" r="1.5" fill="currentColor" />
                                    </ErrorIcon>
                                    <ErrorText id="notebook-name-error" aria-live="assertive">
                                        {error}
                                    </ErrorText>
                                </ErrorRow>
                            )}
                        </>
                    )}

                    <Divider />

                    {/* 드래그 가능한 리스트. 저장 중에는 잠깐 비활성화 */}
                    <List $disabled={savingOrder}>
                        {list.map((nb) => {
                            const isDragging = draggingId === nb.id;
                            const isOverTop = dragOver?.id === nb.id && dragOver.edge === "top";
                            const isOverBottom = dragOver?.id === nb.id && dragOver.edge === "bottom";

                            return (
                                <Row
                                    key={nb.id}
                                    type="button"
                                    draggable={!savingOrder}
                                    title="드래그하여 순서 변경"
                                    onDragStart={(e) => onRowDragStart(nb.id, e)}
                                    onDragOver={(e) => onDragOverRow(nb.id, e)}
                                    onDrop={(e) => onDropRow(nb.id, e)}
                                    onDragEnd={onDragEnd}
                                    onClick={() => handleToggle(nb.id)}
                                    $dragging={isDragging}
                                    $barTop={!!isOverTop}
                                    $barBottom={!!isOverBottom}
                                >
                                    <Left>
                                        <Checkbox
                                            draggable={false}
                                            onMouseDown={(e) => e.stopPropagation()} // 클릭-드래그 충돌 방지
                                            checked={selectedId === nb.id}
                                            onChange={() => handleToggle(nb.id)}
                                            aria-label={`${nb.name} 선택`}
                                        />
                                        <Name>{nb.name}</Name>
                                    </Left>
                                    <Arrow>›</Arrow>
                                </Row>
                            );
                        })}
                    </List>
                </Body>

                <Footer>
                    <GhostBtn onClick={onClose}>취소</GhostBtn>
                    <PrimaryBtn
                        onClick={handlePrimary}
                        aria-disabled={creating ? isCreateInvalid : !selectedId}
                        disabled={creating ? isCreateInvalid : !selectedId}
                    >
                        {creating ? "생성하기" : "저장하기"}
                    </PrimaryBtn>
                </Footer>
            </Panel>
        </Overlay>
    );

    return createPortal(modal, document.body);
}
