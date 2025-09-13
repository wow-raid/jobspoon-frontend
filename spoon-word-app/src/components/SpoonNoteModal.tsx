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

const Row = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${TOKENS.space(10)};
    padding: ${TOKENS.space(12)} ${TOKENS.space(10)};
    border-radius: ${TOKENS.radius.item}px;
    cursor: pointer;
    background: transparent;
    border: none;
    text-align: left;

    &:hover {
        background: #f9fafb;
    }

    & + & {
        border-top: 1px solid ${TOKENS.color.line};
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
`;

const Name = styled.span`
    color: ${TOKENS.color.textPrimary};
    font-size: ${TOKENS.font.body};
`;

const Arrow = styled.span`
    margin-left: auto;
    color: ${TOKENS.color.textMuted};
`;

// 에러 시 시각적 강조를 위해 invalid prop
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

// 에러 행(아이콘 + 텍스트)
const ErrorRow = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 6px 2px 0;
`;

// 동그라미 느낌표 아이콘
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

export default function SpoonNoteModal({
                                           open,
                                           notebooks,
                                           onClose,
                                           onSave,
                                           onCreate,
                                       }: SpoonNoteModalProps) {
    const [selectedId, setSelectedId] = React.useState<string | null>(null);
    const [creating, setCreating] = React.useState(false);
    const [newName, setNewName] = React.useState("");
    const [error, setError] = React.useState<string>("");

    // 이름 정규화 (공백 정리 + 소문자)
    const normalizeName = React.useCallback((s: string) => {
        return s.trim().replace(/\s+/g, " ").toLowerCase();
    }, []);

    React.useEffect(() => {
        if (!open) {
            setSelectedId(null);
            setCreating(false);
            setNewName("");
            setError("");
        }
    }, [open]);

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
        const dup = notebooks.some((n) => normalizeName(n.name) === normalized);
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

    if (!open) return null;

    const isCreateInvalid = creating && (!!error || newName.trim().length === 0);

    const modal = (
        <Overlay role="dialog" aria-modal="true" aria-label="내 SpoonNote에 저장하기">
            <Panel>
                <Header>내 SpoonNote에 저장하기</Header>
                <Body>
                    {!creating ? (
                        <Row onClick={handleCreateToggle} aria-label="새로운 SpoonNote에 만들기">
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

                            {/* 아이콘 + 빨간 에러 문구 */}
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

                    {notebooks.map((nb) => (
                        <Row key={nb.id} onClick={() => handleToggle(nb.id)}>
                            <Left>
                                <Checkbox
                                    checked={selectedId === nb.id}
                                    onChange={() => handleToggle(nb.id)}
                                    aria-label={`${nb.name} 선택`}
                                />
                                <Name>{nb.name}</Name>
                            </Left>
                            <Arrow>›</Arrow>
                        </Row>
                    ))}
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
