import React from "react";
import styled from "styled-components";
import { useCategoryTree, Category } from "../../hooks/useCategoryTree";

const TOKENS = {
    color: {
        text: "#111827",
        muted: "#6b7280",
        border: "#e5e7eb",
        borderStrong: "#cbd5e1",
        blue: "#2563eb",
        panel: "#f8fafc",
        white: "#ffffff",
        itemHover: "#f3f4f6",
        chipBg: "#eef2ff",
        chipBorder: "#c7d2fe",
    },
    space: (n: number) => `${n}px`,
    radius: { panel: 12, box: 10, pill: 999 },
    shadow: {
        ring: "0 0 0 2px rgba(37, 99, 235, 0.15)",
        soft: "0 8px 24px rgba(2,8,20,0.06)",
    },
    transition: "140ms ease",
};

const Panel = styled.div`
  border: 1px solid ${TOKENS.color.border};
  border-top: none;
  border-bottom-left-radius: ${TOKENS.radius.panel}px;
  border-bottom-right-radius: ${TOKENS.radius.panel}px;
  background: ${TOKENS.color.panel};
  padding: ${TOKENS.space(12)};
`;

const Section = styled.div`
  border-top: 1px solid ${TOKENS.color.border};
  &:first-child { border-top: 0; }
`;

const Header = styled.button<{ $open: boolean }>`
  width: 100%;
  padding: ${TOKENS.space(14)} ${TOKENS.space(8)};
  display: flex;
  align-items: center;
  gap: ${TOKENS.space(10)};
  background: transparent;
  border: 0;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;
  color: ${TOKENS.color.text};
  outline: none;

  &:focus-visible {
    box-shadow: ${TOKENS.shadow.ring};
    border-radius: 8px;
  }

  .chev {
    margin-left: auto;
    width: 18px; height: 18px;
    transition: transform ${TOKENS.transition};
    transform: rotate(${({ $open }) => ($open ? 180 : 0)}deg);
  }
`;

const Content = styled.div`
  margin: ${TOKENS.space(10)} 0 ${TOKENS.space(14)} 0;
  background: ${TOKENS.color.white};
  border: 1px solid ${TOKENS.color.borderStrong};
  border-radius: ${TOKENS.radius.box}px;
  box-shadow: ${TOKENS.shadow.soft};
  padding: ${TOKENS.space(10)};
`;

const Col = styled.div`
  display: grid;
  gap: ${TOKENS.space(2)};
`;

const Item = styled.button<{ $active?: boolean }>`
  text-align: left;
  padding: ${TOKENS.space(10)} ${TOKENS.space(12)};
  border-radius: 8px;
  border: 0;
  background: ${({ $active }) => ($active ? "#eef2ff" : "transparent")};
  color: ${({ $active }) => ($active ? TOKENS.color.blue : TOKENS.color.text)};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 750 : 500)};
  text-decoration: ${({ $active }) => ($active ? "underline" : "none")};
  cursor: pointer;

  &:hover {
    background: ${({ $active }) => ($active ? "#eef2ff" : TOKENS.color.itemHover)};
  }
  &:focus-visible {
    outline: none;
    box-shadow: ${TOKENS.shadow.ring};
  }
`;

const TwoCols = styled.div`
  display: grid;
  grid-template-columns: 220px 1fr; /* 중분류 목록 | 소분류 목록 */
  gap: ${TOKENS.space(12)};

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const SubBox = styled.div`
  border: 1px dashed ${TOKENS.color.borderStrong};
  border-radius: 8px;
  padding: ${TOKENS.space(10)};
  min-height: 180px;
`;

const SubTitle = styled.div`
  font-size: 12px;
  color: ${TOKENS.color.muted};
  margin-bottom: ${TOKENS.space(8)};
  font-weight: 700;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: ${TOKENS.space(8)};
  margin-top: ${TOKENS.space(12)};
  border-top: 1px solid ${TOKENS.color.border};
  padding-top: ${TOKENS.space(12)};
  flex-wrap: wrap;
`;

const Chip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${TOKENS.space(6)};
  padding: ${TOKENS.space(4)} ${TOKENS.space(10)};
  border-radius: ${TOKENS.radius.pill}px;
  background: ${TOKENS.color.chipBg};
  border: 1px solid ${TOKENS.color.chipBorder};
  color: ${TOKENS.color.blue};
  font-weight: 700;
  font-size: 12px;
`;

const Spacer = styled.span`
  color: ${TOKENS.color.muted};
  font-size: 12px;
`;

const Right = styled.div`
  margin-left: auto;
  display: inline-flex;
  gap: ${TOKENS.space(8)};
`;

const GhostBtn = styled.button`
  padding: ${TOKENS.space(6)} ${TOKENS.space(10)};
  border: 1px solid ${TOKENS.color.border};
  background: ${TOKENS.color.white};
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
`;

const PrimaryBtn = styled.button<{ $disabled?: boolean }>`
  padding: ${TOKENS.space(6)} ${TOKENS.space(12)};
  border: none;
  background: ${({ $disabled }) => ($disabled ? "#93c5fd" : TOKENS.color.blue)};
  color: #fff;
  border-radius: 10px;
  font-size: 13px;
  cursor: ${({ $disabled }) => ($disabled ? "not-allowed" : "pointer")};
  opacity: ${({ $disabled }) => ($disabled ? 0.85 : 1)};
`;

type PathNode = { id: number; name: string; depth: 0 | 1 | 2 };

type Props = {
    initialPathIds?: number[];
    onApply?: (path: PathNode[]) => void;
};

const CategoryAccordionPicker: React.FC<Props> = ({ initialPathIds, onApply }) => {
    // 선택 상태
    const [sel0, setSel0] = React.useState<number | "">(initialPathIds?.[0] ?? "");
    const [sel1, setSel1] = React.useState<number | "">(initialPathIds?.[1] ?? "");
    const [sel2, setSel2] = React.useState<number | "">(initialPathIds?.[2] ?? "");

    const sel0Num = typeof sel0 === "number" ? sel0 : null;
    const sel1Num = typeof sel1 === "number" ? sel1 : null;
    const sel2Num = typeof sel2 === "number" ? sel2 : null;

    // 데이터 로딩 (선택된 대/중 기준으로만 로딩)
    const { level0, level1, level2 } = useCategoryTree(sel0Num, sel1Num);

    // 선택 경로
    const find = (arr: Category[], id?: number | null) => arr.find((x) => x.id === id) ?? null;
    const path: PathNode[] = React.useMemo(() => {
        const p0 = sel0Num ? find(level0.items, sel0Num) : null;
        const p1 = sel1Num ? find(level1.items, sel1Num) : null;
        const p2 = sel2Num ? find(level2.items, sel2Num) : null;
        return [p0, p1, p2].filter(Boolean).map((c) => ({ id: c!.id, name: c!.name, depth: c!.depth }));
    }, [sel0Num, sel1Num, sel2Num, level0.items, level1.items, level2.items]);

    // 아코디언: 하나만 펼침 (같은 걸 누르면 닫힘)
    const toggleD0 = (id: number) => {
        setSel0((cur) => (cur === id ? "" : id));
        setSel1("");
        setSel2("");
    };

    const onPickD1 = (id: number) => {
        setSel1(id);
        setSel2("");
    };

    const onPickD2 = (id: number) => setSel2(id);

    const resetAll = () => { setSel0(""); setSel1(""); setSel2(""); };
    const apply = () => { if (onApply) onApply(path); };

    return (
        <Panel>
            {/* 대분류 섹션들 */}
            {level0.items.map((d0) => {
                const open = sel0Num === d0.id;
                return (
                    <Section key={d0.id}>
                        <Header
                            type="button"
                            aria-expanded={open}
                            aria-controls={`cat-sec-${d0.id}`}
                            onClick={() => toggleD0(d0.id)}
                            $open={open}
                        >
                            {d0.name}
                            <svg className="chev" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M6 9l6 6 6-6" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </Header>

                        {open && (
                            <Content id={`cat-sec-${d0.id}`} role="region" aria-label={`${d0.name} 하위 분류`}>
                                <TwoCols>
                                    {/* 중분류 */}
                                    <div>
                                        <SubTitle>중분류</SubTitle>
                                        <SubBox>
                                            <Col role="list">
                                                {level1.items.length === 0 ? (
                                                    <div style={{ color: TOKENS.color.muted, fontSize: 14 }}>하위 분류 없음</div>
                                                ) : (
                                                    level1.items.map((d1) => (
                                                        <Item
                                                            key={d1.id}
                                                            role="listitem"
                                                            onClick={() => onPickD1(d1.id)}
                                                            $active={sel1Num === d1.id}
                                                        >
                                                            {d1.name}
                                                        </Item>
                                                    ))
                                                )}
                                            </Col>
                                        </SubBox>
                                    </div>

                                    {/* 소분류 */}
                                    <div>
                                        <SubTitle>소분류</SubTitle>
                                        <SubBox>
                                            {sel1Num ? (
                                                level2.items.length ? (
                                                    <Col role="list">
                                                        {level2.items.map((d2) => (
                                                            <Item
                                                                key={d2.id}
                                                                role="listitem"
                                                                onClick={() => onPickD2(d2.id)}
                                                                $active={sel2Num === d2.id}
                                                            >
                                                                {d2.name}
                                                            </Item>
                                                        ))}
                                                    </Col>
                                                ) : (
                                                    <div style={{ color: TOKENS.color.muted, fontSize: 14 }}>하위 분류 없음</div>
                                                )
                                            ) : (
                                                <div style={{ color: TOKENS.color.muted, fontSize: 14 }}>중분류를 선택하세요.</div>
                                            )}
                                        </SubBox>
                                    </div>
                                </TwoCols>
                            </Content>
                        )}
                    </Section>
                );
            })}

            {/* 요약/버튼 */}
            <Footer>
                {path.length === 0 ? (
                    <Spacer>선택한 분류가 없습니다.</Spacer>
                ) : (
                    <>
                        {path.map((p, i) => (
                            <React.Fragment key={p.id}>
                                <Chip>{p.name}</Chip>
                                {i < path.length - 1 && <Spacer>›</Spacer>}
                            </React.Fragment>
                        ))}
                    </>
                )}

                <Right>
                    <GhostBtn type="button" onClick={resetAll}>전체 초기화</GhostBtn>
                    <PrimaryBtn type="button" onClick={apply} $disabled={path.length === 0} aria-disabled={path.length === 0}>
                        선택한 분류로 보기
                    </PrimaryBtn>
                </Right>
            </Footer>
        </Panel>
    );
};

export default CategoryAccordionPicker;
