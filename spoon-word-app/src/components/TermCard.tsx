// src/components/TermCard.tsx
import React, { useMemo, useState } from "react";

/**
 * TermCard
 * - 순수 프리젠테이셔널 카드 (네트워크 호출 없음)
 * - 제목 / 연관 키워드 라벨 / 칩을 본문 시작점과 정렬
 * - (+) 버튼 클릭, 해시태그 클릭 콜백을 외부로 전달
 */
export type TermCardProps = {
    id: number;
    title: string;
    description: string;
    tags?: string[];               // 이미 확보된 태그가 있으면 그대로 출력
    onAdd?: (id: number) => void;  // (+) 버튼 클릭
    onTagClick?: (tag: string) => void; // 해시태그 클릭
};

/* 디자인 토큰 */
const TOKENS = {
    color: {
        bgWhite: "#ffffff",
        textPrimary: "#111827",
        textSecondary: "#374151",
        textMuted: "#6b7280",
        textLight: "#9ca3af",
        indigo: "#6366f1",
        indigo50: "#eef2ff",
        textBlue: "#2563eb",     // 검색 칩과 동일
        chipBg: "#eef2ff",       // 검색 칩과 동일
        chipBorder: "#c7d2fe",   // 검색 칩과 동일
        chipActiveBg: "#e0e7ff", // 눌림일 때 살짝 진하게
    },
    radius: { card: 20, inner: 14, chip: 10, pill: 999 },
    space: (n: number) => `${n}px`,
    font: { h3: "20px", body: "17px", chip: "12px", label: "12px" },
    shadow: {
        card: "0 1px 0 rgba(0,0,0,0.02), 0 2px 8px rgba(0,0,0,0.04)",
        chip: "0 1px 0 rgba(99,102,241,0.08)",
    },
    border: {
        card: "1px solid rgba(99,102,241,0.28)",
        chip: "1px solid rgba(99,102,241,0.22)",
        chipHover: "1px solid #c7d2fe",
    },
} as const;

// 본문 라이트박스 좌측 padding과 동일한 시작점(정렬 기준)
const CONTENT_INSET = 16; // px
const px = (n: number) => `${n}px`;

/** 개별 태그 칩 (호버/클릭 인터랙션 내장) */
const TagChip: React.FC<{
    label: string;
    onClick?: (t: string) => void;
}> = ({ label, onClick }) => {
    const [hover, setHover] = useState(false);
    const [active, setActive] = useState(false);

    const style: React.CSSProperties = {
        flex: "0 0 auto",
        borderRadius: TOKENS.radius.chip,
        border: hover ? TOKENS.border.chipHover : TOKENS.border.chip,
        background: active
            ? TOKENS.color.chipActiveBg
            : hover
                ? TOKENS.color.chipBg
                : TOKENS.color.bgWhite,
        padding: `${TOKENS.space(4)} ${TOKENS.space(12)}`,
        fontSize: TOKENS.font.chip,
        color: hover ? TOKENS.color.textBlue : TOKENS.color.textSecondary,
        boxShadow: TOKENS.shadow.chip,
        cursor: "pointer",
        outline: "none",
        transition:
            "background-color 120ms ease, border-color 120ms ease, color 120ms ease, transform 40ms ease",
        transform: active ? "scale(0.98)" : "scale(1)",
    };

    return (
        <button
            type="button"
            role="listitem"
            title={`#${label}`}
            aria-label={`해시태그 ${label}`}
            style={style}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => {
                setHover(false);
                setActive(false);
            }}
            onMouseDown={() => setActive(true)}
            onMouseUp={() => setActive(false)}
            onClick={() => onClick?.(label)}
        >
            #{label}
        </button>
    );
};

const TermCardBase: React.FC<TermCardProps> = ({
                                                   id,
                                                   title,
                                                   description,
                                                   tags = [],
                                                   onAdd,
                                                   onTagClick,
                                               }) => {
    // (+) 버튼 인터랙션 상태
    const [addHover, setAddHover] = useState(false);
    const [addActive, setAddActive] = useState(false);

    // inline 스타일 (인터랙션 상태에 의존하므로 useMemo로 묶음)
    const styles = useMemo(() => {
        return {
            article: {
                borderRadius: TOKENS.radius.card,
                border: TOKENS.border.card,
                background: TOKENS.color.bgWhite,
                padding: TOKENS.space(20),
                boxShadow: TOKENS.shadow.card,
            } as React.CSSProperties,

            header: {
                display: "flex",
                alignItems: "flex-start",
                gap: TOKENS.space(12),
            } as React.CSSProperties,

            // 제목은 본문 시작점과 동일 정렬
            title: {
                fontSize: TOKENS.font.h3,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: TOKENS.color.textPrimary,
                margin: 0,
                marginLeft: TOKENS.space(CONTENT_INSET),
                wordBreak: "keep-all",
            } as React.CSSProperties,

            addBtn: {
                marginLeft: "auto",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: px(32),
                height: px(32),
                borderRadius: TOKENS.radius.pill,
                border: TOKENS.border.card,
                color: TOKENS.color.indigo,
                background: addHover ? TOKENS.color.indigo50 : TOKENS.color.bgWhite,
                transform: addActive ? "scale(0.98)" : "scale(1)",
                transition: "background-color 120ms ease, transform 40ms ease",
                cursor: "pointer",
                outline: "none",
                boxShadow: "none",
            } as React.CSSProperties,

            addIcon: { width: px(16), height: px(16), display: "inline-block" } as React.CSSProperties,

            // 본문 라이트박스
            innerBox: {
                marginTop: TOKENS.space(12),
                borderRadius: TOKENS.radius.inner,
                background: "#f8fafc",
                padding: `${TOKENS.space(12)} ${TOKENS.space(16)}`,
            } as React.CSSProperties,

            description: {
                fontSize: TOKENS.font.body,
                lineHeight: 1.7,
                color: TOKENS.color.textSecondary,
                margin: 0,
                whiteSpace: "pre-wrap", // 개행 보존
                wordBreak: "keep-all",
            } as React.CSSProperties,

            /* ---------- 태그 영역: 한 줄 모드 ---------- */

            // 전체 줄(라벨 + 칩)을 한 줄에 배치. 넘치면 가로 스크롤.
            tagsRow: {
                marginTop: TOKENS.space(16),
                marginLeft: TOKENS.space(CONTENT_INSET),
                display: "flex",
                alignItems: "center",
                gap: TOKENS.space(8),
                whiteSpace: "nowrap",     // 줄바꿈 금지
                overflowX: "auto",        // 칩 많을 때 가로 스크롤
                overflowY: "hidden",
                WebkitOverflowScrolling: "touch" as any,
            } as React.CSSProperties,

            tagLabelInline: {
                flex: "0 0 auto",
                fontSize: TOKENS.font.label,
                fontWeight: 600,
                color: TOKENS.color.textMuted,
            } as React.CSSProperties,

            // 칩 컨테이너도 nowrap 유지
            tagListInline: {
                display: "inline-flex",
                alignItems: "center",
                gap: TOKENS.space(8),
                whiteSpace: "nowrap",
            } as React.CSSProperties,

            tagEmptyInline: {
                flex: "0 0 auto",
                fontSize: TOKENS.font.chip,
                color: TOKENS.color.textLight,
            } as React.CSSProperties,
        };
    }, [addHover, addActive]);

    return (
        <article style={styles.article} aria-labelledby={`term-${id}`}>
            {/* 헤더: 제목 + (+) */}
            <div style={styles.header}>
                <h3 id={`term-${id}`} style={styles.title}>
                    {title}
                </h3>

                <button
                    type="button"
                    title="내 단어장에 추가"
                    aria-label="내 단어장에 추가"
                    onClick={() => onAdd?.(id)}
                    style={styles.addBtn}
                    onMouseEnter={() => setAddHover(true)}
                    onMouseLeave={() => {
                        setAddHover(false);
                        setAddActive(false);
                    }}
                    onMouseDown={() => setAddActive(true)}
                    onMouseUp={() => setAddActive(false)}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" style={styles.addIcon}>
                        <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
            </div>

            {/* 본문 */}
            <div style={styles.innerBox}>
                <p style={styles.description}>{description}</p>
            </div>

            {/* 연관 키워드: 한 줄 */}
            <div style={styles.tagsRow} aria-label="연관 키워드">
                <span style={styles.tagLabelInline}>연관 키워드</span>

                {tags.length > 0 ? (
                    <div style={styles.tagListInline} role="list" aria-label="해시태그 목록">
                        {tags.map((t, idx) => (
                            <TagChip key={`${t}-${idx}`} label={t} onClick={onTagClick} />
                        ))}
                    </div>
                ) : (
                    <span style={styles.tagEmptyInline}>등록된 키워드가 없습니다</span>
                )}
            </div>
        </article>
    );
};

export default React.memo(TermCardBase);
