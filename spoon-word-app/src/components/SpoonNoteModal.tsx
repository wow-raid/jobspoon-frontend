import React from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

type Notebook = { id: string; name: string };

export type SpoonNoteModalProps = {
    open: boolean;
    notebooks: Notebook[];
    onClose: () => void;
    onSave: (notebookId: string) => void | Promise<void>;
    onCreate?: (name: string) => string | Promise<string>;
    onReorder?: (orderedIds: string[]) => void | Promise<void>;
    onGoToFolder?: (folderId: string, name?: string) => void | Promise<void>;
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
    overflow: visible; /* 툴팁이 패널 밖으로 나와도 보이도록 */
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

/** 버튼 대신 div로 변경 (중첩 버튼 이슈 해결) */
const Row = styled.div<{
    $dragging?: boolean;
    $barTop?: boolean;
    $barBottom?: boolean;
}>`
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

    &:hover {
        background: #f9fafb;
    }
    & + & {
        border-top: 1px solid ${TOKENS.color.line};
    }

    outline: ${({ $dragging }) =>
            $dragging ? `2px dashed ${TOKENS.color.primary}` : "none"};

    &::before {
        content: "";
        position: absolute;
        left: 8px;
        right: 8px;
        height: 3px;
        top: ${({ $barTop }) => ($barTop ? "-2px" : "auto")};
        bottom: ${({ $barBottom }) => ($barBottom ? "-2px" : "auto")};
        background: ${({ $barTop, $barBottom }) =>
                $barTop || $barBottom ? TOKENS.color.bar : "transparent"};
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
    accent-color: ${TOKENS.color.primary};
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

// 체브론 아이콘
const ChevronIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M9 6l6 6-6 6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/** ➜ 실제 네비게이션을 담당하는 버튼 (Row는 div라 중첩 문제 없음) */
const ArrowBtn = styled.button`
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    width: 30px;
    height: 30px;
    flex: 0 0 30px;

    border-radius: 999px;
    border: 1px solid ${TOKENS.color.line};
    background: #f9fafb;
    color: ${TOKENS.color.textSecondary};
    cursor: pointer;
    touch-action: manipulation; /* 모바일 탭 지연 방지 */

    &:hover {
        background: #f3f4f6;
    }
    &:active {
        transform: translateY(0.5px);
    }

    &:focus-visible {
        outline: 2px solid ${TOKENS.color.primary};
        outline-offset: 2px;
    }

    /* 손가락 포인터(모바일/태블릿)에서는 44px로 확대 */
    @media (pointer: coarse) {
        width: 44px;
        height: 44px;
        flex-basis: 44px;
    }
`;

/* ===== 커스텀 말풍선 툴팁 (체크박스/화살표 전용) ===== */
const TipWrap = styled.span`
    position: relative;
    display: inline-flex;
    align-items: center;
`;

const TipBubble = styled.span`
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translate(-50%, -6px);
    padding: 6px 10px;
    background: rgba(17, 24, 39, 0.92);
    color: #fff;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    pointer-events: none;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    opacity: 0;
    /* hover-intent: show 140ms 지연, hide 60ms 지연 */
    transition: opacity 160ms ease, transform 160ms ease;
    transition-delay: 60ms; /* 기본(비호버) 상태에서 hide 딜레이 */
    z-index: 2;

    &::after {
        content: "";
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 6px solid transparent;
        border-top-color: rgba(17, 24, 39, 0.92);
    }

    ${TipWrap}:hover &,
    ${TipWrap}:focus-within & {
        opacity: 1;
        transform: translate(-50%, -8px);
        transition-delay: 140ms; /* show 딜레이 */
    }

    /* 드래그/정렬 저장 중엔 숨김 (Row 상위 data-attr로 제어) */
    ${Row}[data-block-tips="true"] & {
        opacity: 0 !important;
        transition-delay: 0ms !important;
    }

    /* 터치 기기 비활성 */
    @media (pointer: coarse) {
        display: none;
    }
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
                                           onGoToFolder,
                                       }: SpoonNoteModalProps) {
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [creating, setCreating] = React.useState(false);
    const [newName, setNewName] = React.useState("");
    const [error, setError] = React.useState<string>("");

    const [list, setList] = React.useState<Notebook[]>([]);
    const [draggingId, setDraggingId] = React.useState<string | null>(null);
    const [dragOver, setDragOver] =
        React.useState<{ id: string; edge: "top" | "bottom" } | null>(null);
    const [savingOrder, setSavingOrder] = React.useState(false);
    const [showSaved, setShowSaved] = React.useState(false);
    const lastStableRef = React.useRef<Notebook[]>([]);

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

    React.useEffect(() => {
        if (open) {
            setList(notebooks);
            lastStableRef.current = notebooks;
        }
    }, [open, notebooks]);

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
        if (draggingId) return;
        setSelectedId((prev) => (prev === id ? null : id));
    };

    const handleCreateToggle = () => {
        setCreating(true);
        setSelectedId(null);
        setError("");
    };

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
                newId =
                    typeof (r as any)?.then === "function" ? await (r as Promise<string>) : (r as string);
            }
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

    const handleSave = async () => {
        if (!selectedId) return;
        await Promise.resolve(onSave(selectedId));
    };

    const handlePrimary = () => {
        if (creating) handleCreate();
        else handleSave();
    };

    const moveItem = (arr: Notebook[], from: number, to: number) => {
        const copy = arr.slice();
        const [m] = copy.splice(from, 1);
        copy.splice(to, 0, m);
        return copy;
    };

    const onDragStart = (id: string, e: React.DragEvent) => {
        setDraggingId(id);
        setDragOver(null);
        try {
            e.dataTransfer.effectAllowed = "move";
            const img = document.createElement("div");
            img.style.position = "absolute";
            img.style.top = "-99999px";
            img.style.left = "-99999px";
            document.body.appendChild(img);
            e.dataTransfer.setDragImage(img, 0, 0);
            setTimeout(() => document.body.removeChild(img), 0);
        } catch {}
    };

    const onRowDragStart = (id: string, e: React.DragEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest('input[type="checkbox"]')) {
            e.preventDefault();
            return;
        }
        onDragStart(id, e);
    };

    const onDragOverRow = (overId: string, e: React.DragEvent<HTMLDivElement>) => {
        if (!draggingId || draggingId === overId) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        const rect = e.currentTarget.getBoundingClientRect();
        const isBottom = e.clientY - rect.top > rect.height / 2;
        setDragOver({ id: overId, edge: isBottom ? "bottom" : "top" });
    };

    const onDropRow = async (overId: string, e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!draggingId || draggingId === overId) {
            setDraggingId(null);
            setDragOver(null);
            return;
        }

        const from = list.findIndex((n) => n.id === draggingId);
        const base = list.findIndex((n) => n.id === overId);
        if (from < 0 || base < 0) {
            setDraggingId(null);
            setDragOver(null);
            return;
        }

        let to = base + (dragOver?.edge === "bottom" ? 1 : 0);
        if (from < to) to--;
        to = Math.max(0, Math.min(to, list.length - 1));
        if (from === to) {
            setDraggingId(null);
            setDragOver(null);
            return;
        }

        const prev = list;
        const next = moveItem(list, from, to);

        setList(next);
        setSavingOrder(true);
        setDraggingId(null);
        setDragOver(null);

        try {
            lastStableRef.current = prev;
            if (onReorder) {
                await Promise.resolve(onReorder(next.map((n) => n.id)));
            }
            setShowSaved(true);
            setTimeout(() => setShowSaved(false), 1200);
            lastStableRef.current = next;
        } catch (err) {
            console.error("[folders reorder] PATCH failed:", err);
            setList(lastStableRef.current);
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
                        <Row
                            role="button"
                            tabIndex={0}
                            draggable={!savingOrder}
                            data-block-tips={savingOrder}
                            onClick={() => handleCreateToggle()}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") handleCreateToggle();
                            }}
                        >
                            <Left>
                                <Plus>＋</Plus>
                                <Name>새로운 SpoonNote에 만들기</Name>
                            </Left>
                            <span aria-hidden="true">›</span>
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
                                        <line
                                            x1="12"
                                            y1="7"
                                            x2="12"
                                            y2="13"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                        />
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

                    <List $disabled={savingOrder}>
                        {list.map((nb) => {
                            const isDragging = draggingId === nb.id;
                            const isOverTop = dragOver?.id === nb.id && dragOver.edge === "top";
                            const isOverBottom = dragOver?.id === nb.id && dragOver.edge === "bottom";

                            return (
                                <Row
                                    key={nb.id}
                                    role="button"
                                    tabIndex={0}
                                    draggable={!savingOrder}
                                    data-block-tips={isDragging || savingOrder}
                                    onDragStart={(e) => onRowDragStart(nb.id, e)}
                                    onDragOver={(e) => onDragOverRow(nb.id, e)}
                                    onDrop={(e) => onDropRow(nb.id, e)}
                                    onDragEnd={onDragEnd}
                                    onClick={(e) => {
                                        const el = e.target as HTMLElement;
                                        if (el.closest('input,button,[role="checkbox"],[role="switch"]')) return;
                                        handleToggle(nb.id);
                                    }}
                                    onKeyDown={(e) => {
                                        const el = e.target as HTMLElement;
                                        if (el.closest('input, button, [role="checkbox"], [role="switch"]')) return;
                                        if (e.key === "Enter" || e.key === " ") handleToggle(nb.id);
                                    }}
                                    $dragging={isDragging}
                                    $barTop={!!isOverTop}
                                    $barBottom={!!isOverBottom}
                                >
                                    <Left>
                                        {/* 체크박스: 개별 말풍선 */}
                                        <TipWrap data-tip>
                                            <Checkbox
                                                draggable={false}
                                                onMouseDown={(e) => e.stopPropagation()}
                                                onClick={(e) => e.stopPropagation()} // click 버블링 차단
                                                checked={selectedId === nb.id}
                                                onChange={() => handleToggle(nb.id)}
                                                aria-label={`${nb.name} 선택`}
                                            />
                                            <TipBubble>저장할 단어장 선택하기</TipBubble>
                                        </TipWrap>

                                        <Name>{nb.name}</Name>
                                    </Left>

                                    {/* 화살표 버튼: 개별 말풍선 */}
                                    <TipWrap data-tip>
                                        <ArrowBtn
                                            type="button"
                                            aria-label={`${nb.name} 폴더로 이동`}
                                            draggable={false}
                                            onMouseDown={(e) => e.stopPropagation()}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onGoToFolder?.(nb.id, nb.name);
                                            }}
                                            data-testid="go-to-folder"
                                        >
                                            <ChevronIcon />
                                        </ArrowBtn>
                                        <TipBubble>해당 단어장으로 이동하기</TipBubble>
                                    </TipWrap>
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
