import React from "react";
import styled from "styled-components";
import HeroFloatingIcons from "./HeroFloatingIcons";

type Props = {
    title?: string;
    subtitle?: string;
    className?: string;
    align?: "left" | "center";
    narrow?: boolean;
    offsetLeft?: number;   // 왼쪽 라인 기준 +면 오른쪽으로
    offsetRight?: number;  // 오른쪽 패딩 조정
    floatingIcons?: [string, string, string];
    assetHost?: string;
    iconProps?: Partial<{
        width: string;
        height: string;
        top: string;
        rightOffset: number;
        debug: boolean;
        withShadow: boolean;
        maxIconWidthPercent: number;
        scales: [number, number, number];
        positions: [{ left: number; top: number }, { left: number; top: number }, { left: number; top: number }];
    }>;
};

const HeroWrap = styled.section`
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    margin-bottom: 12px;
    padding-block: clamp(24px, 6vw, 64px);
    background: linear-gradient(90deg, #e8f0fb 0%, #e7f2ea 100%);
    position: relative;
    isolation: isolate;

    @media (prefers-color-scheme: dark) {
        background: linear-gradient(90deg, #0f172a 0%, #0b2a26 100%);
    }
`;

/* 네비 Inner 라인에 맞춘 인셋 + 원하는 만큼 좌우 오프셋 */
const Inset = styled.div`
    --hero-left-offset: 0px;
    --hero-right-offset: 0px;

    padding-left: calc(max(var(--shell-left, 20px), env(safe-area-inset-left)) + var(--hero-left-offset));
    padding-right: calc(max(var(--shell-right, 20px), env(safe-area-inset-right)) + var(--hero-right-offset));
`;

const HeroInner = styled.div<{ $align: "left" | "center" }>`
    display: grid;
    gap: 8px;
    justify-items: ${({ $align }) => ($align === "center" ? "center" : "start")};
    text-align: ${({ $align }) => ($align === "center" ? "center" : "left")};
`;

/* 검색바와 동일한 폭/정렬 */
const HeroNarrow = styled.div<{ $narrow: boolean }>`
    width: 100%;
    max-width: ${({ $narrow, theme }) =>
            $narrow ? `${theme?.custom?.layout?.narrowMaxWidth ?? 980}px` : `${theme?.custom?.layout?.containerMaxWidth ?? 1280}px`};
    margin: 0 auto;
`;

const HeroTitle = styled.h1`
    margin: 0;
    font-weight: 750;
    letter-spacing: -0.06em;
    font-size: clamp(28px, 6vw, 56px);
    line-height: 1.1;
    color: #0f172a;

    @media (prefers-color-scheme: dark) { color: #e5e7eb; }
`;

const HeroSub = styled.p`
    margin: 12px 0 0 0;
    letter-spacing: -0.06em;
    font-size: clamp(14px, 2.6vw, 20px);
    line-height: 1.6;
    color: #334155;

    @media (prefers-color-scheme: dark) { color: #9aa4b2; }
`;

const TextWrap = styled.div`
    position: relative;
    z-index: 2; /* 아이콘 레이어(1) 위로 */
`;

export default function HeroBanner({
                                       title = "스푼워드",
                                       subtitle = "잡스푼과 함께, 기술 용어를 나만의 언어로 만들어 보세요.",
                                       className,
                                       align = "left",
                                       narrow = true,
                                       offsetLeft = 15,
                                       offsetRight = 0,
                                       floatingIcons,
                                       assetHost,
                                       iconProps,
                                   }: Props) {
    return (
        <HeroWrap className={className} aria-label="스푼워드 소개 배너">
            <Inset
                style={
                    {
                        ["--hero-left-offset" as any]: `${offsetLeft}px`,
                        ["--hero-right-offset" as any]: `${offsetRight}px`,
                    } as React.CSSProperties
                }
            >
                <HeroInner $align={align}>
                    <HeroNarrow $narrow={narrow}>
                        <TextWrap>
                            <HeroTitle>{title}</HeroTitle>
                            <HeroSub>{subtitle}</HeroSub>
                        </TextWrap>
                    </HeroNarrow>
                </HeroInner>
            </Inset>

            {/* 오른쪽 아이콘 (정적 배치) */}
            {floatingIcons && (
                <HeroFloatingIcons
                    srcs={floatingIcons}
                    assetHost={assetHost}
                />
            )}
        </HeroWrap>
    );
}
