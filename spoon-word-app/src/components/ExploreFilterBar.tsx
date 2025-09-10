// ExploreFilterBar.tsx
import React, { useMemo, useState, useEffect, useRef } from "react";

export type FilterSelection =
    | { mode: "initial"; value: string }
    | { mode: "alpha"; value: string }
    | { mode: "symbol"; value: string }
    | null;

type Props = {
    value?: FilterSelection;
    onChange?: (sel: FilterSelection) => void;
    defaultTab?: number;
    /** true면 선택 하이라이트 유지, false면 클릭 직후 원상복구 */
    sticky?: boolean;
};

/* 디자인 토큰 */
const TOKENS = {
    color: {
        text: "#111827",
        muted: "#6b7280",
        blue: "#2563eb",
        border: "#d1d5db",
        tabBg: "#eef2ff",
        panelBg: "#f8fafc",
        chipBg: "#ffffff",
        chipBorder: "#e5e7eb",
        chipHover: "#f3f4f6",
    },
    radius: { tab: 10, chip: 8, panel: 12 },
    space: (n: number) => `${n}px`,
    shadow: { tab: "0 1px 2px rgba(0,0,0,0.06)" },
};

const INITIALS = ["ㄱ","ㄴ","ㄷ","ㄹ","ㅁ","ㅂ","ㅅ","ㅇ","ㅈ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"];
const ALPHABETS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));
const SYMBOLS = ["~","@","#","$","%","&","*","/","?","-","_","+","=",".",",","!"];

/* 한 줄 14개 고정 */
const GRID_COLS = 14;

/* 라벨 열 폭(52~60 사이로 미세 조정 가능) */
const LABEL_COL = 52;

/* UA outline 제거(스코프 한정) */
const SCOPE_CLASS = "efb-scope";
const STYLE_ID = "efb-scope-style-nokbd";
const ensureScopedStyle = () => {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
  .${SCOPE_CLASS} button {
    outline: none !important;
    box-shadow: none !important;
    -webkit-appearance: none;
    appearance: none;
  }
  .${SCOPE_CLASS} button:focus,
  .${SCOPE_CLASS} button:focus-visible,
  .${SCOPE_CLASS} button:active,
  .${SCOPE_CLASS} button:focus:not(:focus-visible) {
    outline: none !important;
    box-shadow: none !important;
  }
  .${SCOPE_CLASS} button:-moz-focusring { outline: none !important; }
  .${SCOPE_CLASS} button::-moz-focus-inner { border: 0 !important; }
  .${SCOPE_CLASS} * { -webkit-tap-highlight-color: transparent; }
  `;
    document.head.appendChild(style);
};

const ExploreFilterBar: React.FC<Props> = ({
                                               value,
                                               onChange,
                                               defaultTab = 0,
                                               sticky = true,
                                           }) => {
    useEffect(() => { ensureScopedStyle(); }, []);

    const [activeTab, setActiveTab] = useState(defaultTab);
    const [internalSel, setInternalSel] = useState<FilterSelection>(null);
    const selection = value === undefined ? internalSel : value;

    const [hoveredKey, setHoveredKey] = useState<string | null>(null);

    // 마우스-only: 포인터 다운 시 이전 포커스 제거
    const rootRef = useRef<HTMLDivElement>(null);
    const blurActiveInRoot = () => {
        const ae = document.activeElement as HTMLElement | null;
        if (ae && rootRef.current && rootRef.current.contains(ae)) ae.blur();
    };
    const handlePointerDownCapture: React.PointerEventHandler<HTMLDivElement> = () => {
        blurActiveInRoot();
    };

    useEffect(() => {
        setHoveredKey(null);
        requestAnimationFrame(blurActiveInRoot);
    }, [selection?.mode, selection?.value, activeTab]);

    /* 버튼 스타일 */
    const buttonStyle = useMemo(() => ({
        base: {
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: TOKENS.space(36),
            padding: `0 ${TOKENS.space(10)}`,
            borderRadius: TOKENS.radius.chip,
            border: `1px solid ${TOKENS.color.chipBorder}`,
            background: TOKENS.color.chipBg,
            cursor: "pointer",
            userSelect: "none" as const,
            transition: "background-color 120ms ease, color 120ms ease, border-color 120ms ease",
            fontSize: 14,
            color: TOKENS.color.text,
        } as React.CSSProperties,
        active: {
            borderColor: TOKENS.color.blue,
            background: "#eef2ff",
            color: TOKENS.color.blue,
            fontWeight: 700,
        },
        hover: { background: TOKENS.color.chipHover },
    }), []);

    const toggleSelection = (sel: Exclude<FilterSelection, null>, btn?: HTMLButtonElement) => {
        const isSame = selection && selection.mode === sel.mode && selection.value === sel.value;
        const next: FilterSelection = isSame ? null : sel;

        onChange?.(next);

        if (value === undefined) {
            if (sticky) {
                setInternalSel(next);
            } else {
                setInternalSel(null);
            }
        }

        setHoveredKey(null);
        requestAnimationFrame(() => {
            blurActiveInRoot();
            btn?.blur();
        });
    };

    const isActiveKey = (mode: "initial" | "alpha" | "symbol", v: string) =>
        (value === undefined ? internalSel : value)?.mode === mode &&
        (value === undefined ? internalSel : value)?.value === v;

    const makeButton = (mode: "initial" | "alpha" | "symbol", v: string) => {
        const key = `${mode}-${v}`;
        const isActive = isActiveKey(mode, v);
        const isHovered = hoveredKey === key;
        return (
            <button
                key={key}
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()} // 크롬 기본 focus 방지
                onClick={(e) => toggleSelection({ mode, value: v }, e.currentTarget)}
                onMouseEnter={() => setHoveredKey(key)}
                onMouseLeave={() => setHoveredKey(null)}
                {...(sticky ? { "aria-pressed": isActive } : {})}
                style={{
                    ...buttonStyle.base,
                    ...(isActive ? buttonStyle.active : {}),
                    ...(!isActive && isHovered ? buttonStyle.hover : {}),
                }}
            >
                {v}
            </button>
        );
    };

    /* 그룹 렌더러 */
    const renderGroup = (mode: "initial" | "alpha" | "symbol", items: string[]) => (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_COLS}, minmax(0, 1fr))`,
                gap: TOKENS.space(8),
                justifyItems: "stretch",
            }}
        >
            {items.map((v) => makeButton(mode, v))}
        </div>
    );

    /* 레이아웃 스타일 */
    const styles = useMemo(() => ({
        root: { marginTop: TOKENS.space(12) },
        tabs: { display: "flex", gap: TOKENS.space(8), borderBottom: `2px solid ${TOKENS.color.border}` } as React.CSSProperties,
        tabBtn: (active: boolean) => ({
            border: `1px solid ${active ? TOKENS.color.blue : TOKENS.color.border}`,
            color: active ? TOKENS.color.blue : TOKENS.color.text,
            background: active ? TOKENS.color.tabBg : "#fff",
            borderBottom: "none",
            borderTopLeftRadius: TOKENS.radius.tab,
            borderTopRightRadius: TOKENS.radius.tab,
            padding: `${TOKENS.space(10)} ${TOKENS.space(14)}`,
            fontSize: 14,
            fontWeight: active ? 700 : 600,
            cursor: "pointer",
            boxShadow: TOKENS.shadow.tab,
        }) as React.CSSProperties,
        panel: {
            border: `1px solid ${TOKENS.color.border}`,
            borderTop: "none",
            borderBottomLeftRadius: TOKENS.radius.panel,
            borderBottomRightRadius: TOKENS.radius.panel,
            background: TOKENS.color.panelBg,
            padding: `${TOKENS.space(16)} ${TOKENS.space(16)} ${TOKENS.space(16)} ${TOKENS.space(12)}`,
        } as React.CSSProperties,
        row: {
            display: "grid",
            gridTemplateColumns: `${LABEL_COL}px 1fr`,
            alignItems: "start",
            gap: TOKENS.space(12),
            marginBottom: TOKENS.space(12),
        } as React.CSSProperties,
        labelBox: {
            height: TOKENS.space(36),
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
        } as React.CSSProperties,
        labelText: {
            fontSize: 14,
            fontWeight: 700,
            color: TOKENS.color.muted,
        } as React.CSSProperties,
    }), []);

    /* 렌더 */
    return (
        <div
            ref={rootRef}
            className={SCOPE_CLASS}
            style={styles.root}
            aria-label="탐색 방식 선택"
            onPointerDownCapture={handlePointerDownCapture}
        >
            <div style={styles.tabs} role="tablist" aria-label="탐색 방식">
                <button
                    role="tab"
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => { setActiveTab(0); blurActiveInRoot(); (e.currentTarget as HTMLButtonElement).blur(); }}
                    style={styles.tabBtn(activeTab === 0)}
                    aria-selected={activeTab === 0}
                >
                    초성 / 알파벳 / 기호로 찾기
                </button>
                <button
                    role="tab"
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => { setActiveTab(1); blurActiveInRoot(); (e.currentTarget as HTMLButtonElement).blur(); }}
                    style={styles.tabBtn(activeTab === 1)}
                    aria-selected={activeTab === 1}
                >
                    분류별로 찾기
                </button>
            </div>

            {activeTab === 0 ? (
                <div role="tabpanel" style={styles.panel}>
                    {/* 초성 */}
                    <div style={styles.row}>
                        <div style={styles.labelBox}><span style={styles.labelText}>초성</span></div>
                        {renderGroup("initial", INITIALS)}
                    </div>

                    {/* 알파벳 */}
                    <div style={styles.row}>
                        <div style={styles.labelBox}><span style={styles.labelText}>알파벳</span></div>
                        {renderGroup("alpha", ALPHABETS)}
                    </div>

                    {/* 기호 */}
                    <div style={{ ...styles.row, marginBottom: 0 }}>
                        <div style={styles.labelBox}><span style={styles.labelText}>기호</span></div>
                        {renderGroup("symbol", SYMBOLS)}
                    </div>
                </div>
            ) : (
                <div role="tabpanel" style={{ ...styles.panel, textAlign: "center" }}>
                    준비 중…
                </div>
            )}
        </div>
    );
};

export default ExploreFilterBar;
