// ExploreFilterBar.tsx
import React, { useMemo, useState, useEffect, useRef } from "react";
import styled from "styled-components";

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

/* 라벨 열 폭 */
const LABEL_COL = 52;

/* styled-components */
const Root = styled.div`
  margin-top: ${TOKENS.space(12)};
`;

const TabList = styled.div`
  display: flex;
  gap: ${TOKENS.space(8)};
  border-bottom: 2px solid ${TOKENS.color.border};
`;

const TabButton = styled.button<{ $active: boolean }>`
  border: 1px solid ${({ $active }) => ($active ? TOKENS.color.blue : TOKENS.color.border)};
  color: ${({ $active }) => ($active ? TOKENS.color.blue : TOKENS.color.text)};
  background: ${({ $active }) => ($active ? TOKENS.color.tabBg : "#fff")};
  border-bottom: none;
  border-top-left-radius: ${TOKENS.radius.tab}px;
  border-top-right-radius: ${TOKENS.radius.tab}px;
  padding: ${TOKENS.space(10)} ${TOKENS.space(14)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  cursor: pointer;
  box-shadow: ${TOKENS.shadow.tab};
  outline: none;

  &:focus,
  &:active {
    outline: none;
    box-shadow: ${TOKENS.shadow.tab};
  }
`;

const Panel = styled.div`
  border: 1px solid ${TOKENS.color.border};
  border-top: none;
  border-bottom-left-radius: ${TOKENS.radius.panel}px;
  border-bottom-right-radius: ${TOKENS.radius.panel}px;
  background: ${TOKENS.color.panelBg};
  padding: ${TOKENS.space(16)} ${TOKENS.space(16)} ${TOKENS.space(16)} ${TOKENS.space(12)};
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: ${LABEL_COL}px 1fr;
  align-items: start;
  gap: ${TOKENS.space(12)};
  margin-bottom: ${TOKENS.space(12)};
`;

const LabelBox = styled.div`
  height: ${TOKENS.space(36)};
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const LabelText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${TOKENS.color.muted};
`;

const GroupGrid = styled.div<{ $cols: number }>`
  display: grid;
  grid-template-columns: ${({ $cols }) => `repeat(${$cols}, minmax(0, 1fr))`};
  gap: ${TOKENS.space(8)};
  justify-items: stretch;
`;

const ChipButton = styled.button<{ $active: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${TOKENS.space(36)};
  padding: 0 ${TOKENS.space(10)};
  border-radius: ${TOKENS.radius.chip}px;
  border: 1px solid ${({ $active }) => ($active ? TOKENS.color.blue : TOKENS.color.chipBorder)};
  background: ${({ $active }) => ($active ? "#eef2ff" : TOKENS.color.chipBg)};
  cursor: pointer;
  user-select: none;
  transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
  font-size: 14px;
  color: ${({ $active }) => ($active ? TOKENS.color.blue : TOKENS.color.text)};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  outline: none;

  /* hover는 비활성 상태에서만 */
  &:not([data-active="true"]):hover {
    background: ${TOKENS.color.chipHover};
  }

  &:focus,
  &:active {
    outline: none;
    box-shadow: none;
  }

  /* 모바일 탭 하이라이트 제거 */
  -webkit-tap-highlight-color: transparent;
`;

const ExploreFilterBar: React.FC<Props> = ({
                                               value,
                                               onChange,
                                               defaultTab = 0,
                                               sticky = true,
                                           }) => {
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [internalSel, setInternalSel] = useState<FilterSelection>(null);
    const selection = value === undefined ? internalSel : value;

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
        // 탭/선택 변경 시 강제로 포커스 제거
        requestAnimationFrame(blurActiveInRoot);
    }, [selection?.mode, selection?.value, activeTab]);

    const toggleSelection = (sel: Exclude<FilterSelection, null>, btn?: HTMLButtonElement) => {
        const isSame = selection && selection.mode === sel.mode && selection.value === sel.value;
        const next: FilterSelection = isSame ? null : sel;

        onChange?.(next);

        if (value === undefined) {
            if (sticky) setInternalSel(next);
            else setInternalSel(null);
        }

        requestAnimationFrame(() => {
            blurActiveInRoot();
            btn?.blur();
        });
    };

    const isActiveKey = (mode: "initial" | "alpha" | "symbol", v: string) =>
        (value === undefined ? internalSel : value)?.mode === mode &&
        (value === undefined ? internalSel : value)?.value === v;

    const makeButton = (mode: "initial" | "alpha" | "symbol", v: string) => {
        const isActive = isActiveKey(mode, v);
        return (
            <ChipButton
                key={`${mode}-${v}`}
                type="button"
                tabIndex={-1}
                onMouseDown={(e) => e.preventDefault()} // 크롬 기본 focus 방지
                onClick={(e) => toggleSelection({ mode, value: v }, e.currentTarget)}
                aria-pressed={sticky ? isActive : undefined}
                data-active={isActive ? "true" : "false"}
                $active={isActive}
            >
                {v}
            </ChipButton>
        );
    };

    /* 그룹 렌더러 */
    const renderGroup = (mode: "initial" | "alpha" | "symbol", items: string[]) => (
        <GroupGrid $cols={GRID_COLS}>
            {items.map((v) => makeButton(mode, v))}
        </GroupGrid>
    );

    /* 렌더 */
    return (
        <Root
            ref={rootRef}
            aria-label="탐색 방식 선택"
            onPointerDownCapture={handlePointerDownCapture}
        >
            <TabList role="tablist" aria-label="탐색 방식">
                <TabButton
                    role="tab"
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                        setActiveTab(0);
                        blurActiveInRoot();
                        (e.currentTarget as HTMLButtonElement).blur();
                    }}
                    aria-selected={activeTab === 0}
                    $active={activeTab === 0}
                >
                    초성 / 알파벳 / 기호로 찾기
                </TabButton>

                <TabButton
                    role="tab"
                    type="button"
                    tabIndex={-1}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                        setActiveTab(1);
                        blurActiveInRoot();
                        (e.currentTarget as HTMLButtonElement).blur();
                    }}
                    aria-selected={activeTab === 1}
                    $active={activeTab === 1}
                >
                    분류별로 찾기
                </TabButton>
            </TabList>

            {activeTab === 0 ? (
                <Panel role="tabpanel">
                    {/* 초성 */}
                    <Row>
                        <LabelBox><LabelText>초성</LabelText></LabelBox>
                        {renderGroup("initial", INITIALS)}
                    </Row>

                    {/* 알파벳 */}
                    <Row>
                        <LabelBox><LabelText>알파벳</LabelText></LabelBox>
                        {renderGroup("alpha", ALPHABETS)}
                    </Row>

                    {/* 기호 */}
                    <Row style={{ marginBottom: 0 }}>
                        <LabelBox><LabelText>기호</LabelText></LabelBox>
                        {renderGroup("symbol", SYMBOLS)}
                    </Row>
                </Panel>
            ) : (
                <Panel role="tabpanel" style={{ textAlign: "center" }}>
                    준비 중…
                </Panel>
            )}
        </Root>
    );
};

export default ExploreFilterBar;
