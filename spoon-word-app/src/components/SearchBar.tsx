// src/components/SearchBar.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import RecentSearchList from "./RecentSearchList";
import { RECENT_KEY, addRecent, clearRecent, getRecent, removeRecent } from "../utils/recentSearch";

type Props = {
    value: string;
    onChange: (v: string) => void;
    onSearch: (term: string) => void;
};

const TOKENS = {
    radius: 10,
    padX: 20,
    padY: 16,
    btnPadX: 16,
    btnPadY: 8,
    fontSize: 15,
    colors: {
        text: "#111827",
        placeholder: "#9CA3AF",
        bg: "#ffffff",
        ring: "#e5e7eb",
        ringFocus: "#3b82f6",
        btnBg: "#2563eb",
        btnBgHover: "#1d4ed8",
        btnText: "#ffffff",
        border: "#e5e7eb",
    },
    z: { popup: 20 },
    shadow: {
        sm: "0 1px 2px rgba(0,0,0,0.06)",
        xl: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
    },
};

const SearchBar: React.FC<Props> = ({ value, onChange, onSearch }) => {
    const [open, setOpen] = useState(false);
    const [recent, setRecent] = useState<string[]>(() => getRecent());
    const [highlight, setHighlight] = useState(-1);
    const [isFocused, setIsFocused] = useState(false);
    const [btnHover, setBtnHover] = useState(false);
    const [btnActive, setBtnActive] = useState(false);
    const [isComposing, setIsComposing] = useState(false); // ★ IME 가드

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxId = "recent-search-listbox";

    useEffect(() => {
        function onDocDown(e: MouseEvent) {
            if (!wrapperRef.current) return;
            if (!wrapperRef.current.contains(e.target as Node)) {
                setOpen(false);
                setHighlight(-1);
            }
        }
        document.addEventListener("mousedown", onDocDown);
        return () => document.removeEventListener("mousedown", onDocDown);
    }, []);

    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === RECENT_KEY) setRecent(getRecent());
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    const runSearch = (term: string) => {
        const t = term.trim();
        if (!t) return;
        const updated = addRecent(t);
        setRecent(updated);
        setOpen(false);
        setHighlight(-1);
        onSearch(t);
    };

    const filtered = useMemo(() => recent, [recent]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;

        // ★ 한글/IME 조합 중에는 키 처리 막기
        if (isComposing) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(filtered.length - 1, h + 1));
            return;
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(-1, h - 1));
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            if (highlight >= 0 && filtered[highlight]) runSearch(filtered[highlight]);
            else runSearch(value);
            return;
        }
        if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            setHighlight(-1);
            return;
        }
    };

    const styles = useMemo(() => {
        const ringWidth = isFocused ? 2 : 1;
        const ringColor = isFocused ? TOKENS.colors.ringFocus : TOKENS.colors.ring;
        const btnScale = btnActive ? 0.98 : 1;

        return {
            wrapper: { position: "relative" as const },
            inputShell: { position: "relative" as const },
            inputContainer: {
                position: "relative" as const,
                borderRadius: TOKENS.radius,
                background: TOKENS.colors.bg,
                boxShadow: TOKENS.shadow.sm,
                boxSizing: "border-box" as const,
                border: `${ringWidth}px solid ${ringColor}`,
                transition: "border-color 120ms ease",
            },
            input: {
                width: "100%",
                border: "none",
                outline: "none",
                borderRadius: TOKENS.radius,
                padding: `${TOKENS.padY}px ${TOKENS.padX}px`,
                paddingRight: `${TOKENS.padX + 44}px`,
                fontSize: TOKENS.fontSize,
                color: TOKENS.colors.text,
                background: "transparent",
            } as React.CSSProperties,
            btnSearch: {
                position: "absolute" as const,
                right: 8,
                top: "50%",
                transform: `translateY(-50%) scale(${btnScale})`,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderRadius: 10,
                padding: `${TOKENS.btnPadY}px ${TOKENS.btnPadX}px`,
                fontSize: 14,
                fontWeight: 600,
                background: btnHover ? TOKENS.colors.btnBgHover : TOKENS.colors.btnBg,
                color: TOKENS.colors.btnText,
                cursor: "pointer",
                transition: "background-color 120ms ease, transform 40ms ease",
            } as React.CSSProperties,
            btnIcon: {
                width: 18,
                height: 18,
                marginRight: 4,
                display: "inline-block",
            },
            popup: {
                position: "absolute" as const,
                left: 0,
                right: 0,
                zIndex: TOKENS.z.popup,
                marginTop: 8,
                borderRadius: 16,
                border: `1px solid ${TOKENS.colors.border}`,
                background: TOKENS.colors.bg,
                boxShadow: TOKENS.shadow.xl,
            },
        };
    }, [isFocused, btnHover, btnActive]);

    return (
        <div style={styles.wrapper} ref={wrapperRef} onKeyDown={handleKeyDown}>
            <div style={styles.inputShell}>
                <div style={styles.inputContainer}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        onFocus={() => {
                            setIsFocused(true);
                            setOpen(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        placeholder="찾고 싶은 용어를 입력해 주세요."
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        aria-controls={listboxId}
                        aria-label="검색어 입력"
                        style={styles.input}
                        // ★ IME 조합 상태 트래킹
                        onCompositionStart={() => setIsComposing(true)}
                        onCompositionEnd={() => setIsComposing(false)}
                    />
                    <button
                        type="button"
                        aria-label="검색"
                        onClick={() => runSearch(value)}
                        style={styles.btnSearch}
                        onMouseEnter={() => setBtnHover(true)}
                        onMouseLeave={() => {
                            setBtnHover(false);
                            setBtnActive(false);
                        }}
                        onMouseDown={() => setBtnActive(true)}
                        onMouseUp={() => setBtnActive(false)}
                    >
                        <svg viewBox="0 0 24 24" style={styles.btnIcon}>
                            <path
                                d="M21 21l-4.3-4.3m1.3-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                stroke="currentColor"
                                strokeWidth="2"
                                fill="none"
                                strokeLinecap="round"
                            />
                        </svg>
                        검색
                    </button>
                </div>
            </div>

            {open && (
                <div role="dialog" aria-modal="true" style={styles.popup}>
                    <RecentSearchList
                        items={filtered}
                        highlightedIndex={highlight}
                        onSelect={(v) => runSearch(v)}
                        onDelete={(v) => setRecent(removeRecent(v))}
                        onClear={() => {
                            clearRecent();
                            setRecent([]);
                        }}
                        listboxId={listboxId}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchBar;
