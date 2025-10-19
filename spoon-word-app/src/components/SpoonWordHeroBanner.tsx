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

    /* SpoonNote와 높이 맞춤 */
    padding-block: clamp(26px, 6.5vw, 72px);
    position: relative;
    isolation: isolate;

    /* ===== light: 스푼워드 톤(스카이블루↔민트)으로 부드러운 블롭 두 개 ===== */
    --blob-sky: 168 198 255;   /* rgb(하늘 파랑) */
    --blob-mint: 196 236 220;  /* rgb(연한 민트) */

    background:
        /* 좌하단: 스카이블루 블롭 */
            radial-gradient(900px 600px at 20% 72%,
            rgba(var(--blob-sky) / 0.55) 0%,
            rgba(var(--blob-sky) / 0.28) 24%,
            rgba(var(--blob-sky) / 0.10) 40%,
            rgba(var(--blob-sky) / 0.00) 64%),
                /* 우상단: 민트 블롭 */
            radial-gradient(720px 620px at 76% 30%,
            rgba(var(--blob-mint) / 0.60) 0%,
            rgba(var(--blob-mint) / 0.26) 34%,
            rgba(var(--blob-mint) / 0.08) 54%,
            rgba(var(--blob-mint) / 0.00) 68%),
                /* 전체를 아주 살짝 밝게 */
            linear-gradient(180deg, #f7fbff 0%, #f9fffb 100%);
    background-repeat: no-repeat;

    @media (prefers-color-scheme: dark) {
        /* ===== dark: 네이비 베이스 + 시안/민트 블롭 ===== */
        --blob-sky: 120 170 255;
        --blob-mint: 120 230 210;

        background:
                radial-gradient(900px 600px at 20% 72%,
                rgba(var(--blob-sky) / 0.38) 0%,
                rgba(var(--blob-sky) / 0.18) 30%,
                rgba(var(--blob-sky) / 0.00) 62%),
                radial-gradient(720px 620px at 76% 30%,
                rgba(var(--blob-mint) / 0.36) 0%,
                rgba(var(--blob-mint) / 0.16) 36%,
                rgba(var(--blob-mint) / 0.00) 62%),
                linear-gradient(180deg, #0b1222 0%, #0a141d 100%);
    }
`;

/* 히어로 전체를 클릭 영역으로 만드는 오버레이 링크 */
const OverlayLink = styled.a`
  position: absolute;
  inset: 0;        /* 전체 영역 커버 */
  z-index: 10;     /* 텍스트/아이콘 위에 */
  display: block;
  pointer-events: auto;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid rgba(79,118,241,.5);
    outline-offset: -2px;
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

export default function SpoonWordHeroBanner({
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

            {/* 배너 전체 클릭 → /spoon-word/words 이동 */}
            <OverlayLink
                href="http://localhost/spoon-word/words"
                aria-label="스푼워드 단어 목록으로 이동"
            />
        </HeroWrap>
    );
}
