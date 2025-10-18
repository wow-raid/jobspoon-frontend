import React from "react";
import styled from "styled-components";
import HeroFloatingIcons from "./HeroFloatingIcons";

type Props = {
    title?: string;
    subtitle?: string;
    className?: string;
    align?: "left" | "center";
    narrow?: boolean;
    offsetLeft?: number;
    offsetRight?: number;
    assetHost?: string;
    iconProps?: Partial<{
        width: string;
        height: string;
        top: string;
        rightOffset: number;
        debug: boolean;
        withShadow: boolean;
        maxIconWidthPercent: number | number[];
        scales: number[];
        positions: { left: number; top: number }[];
    }>;
};

const HeroWrap = styled.section`
    width: 100vw;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    margin-bottom: 12px;
    padding-block: clamp(26px, 6.5vw, 72px);
    position: relative;
    isolation: isolate;

    /* ===== light mode: 부드러운 블롭 두 개 + 아주 옅은 톤 ===== */
    --blob-blue: 170 185 255;   /* rgb */
    --blob-pink: 255 165 190;   /* rgb */

    background:
        /* 좌하단 보라/인디고 블롭 */
            radial-gradient(900px 600px at 20% 72%,
            rgba(var(--blob-blue) / 0.55) 0%,
            rgba(var(--blob-blue) / 0.28) 22%,
            rgba(var(--blob-blue) / 0.10) 38%,
            rgba(var(--blob-blue) / 0.00) 62%),
                /* 우상단 핑크 블롭 */
            radial-gradient(700px 620px at 74% 30%,
            rgba(var(--blob-pink) / 0.60) 0%,
            rgba(var(--blob-pink) / 0.26) 32%,
            rgba(var(--blob-pink) / 0.08) 52%,
            rgba(var(--blob-pink) / 0.00) 66%),
                /* 전체 톤을 살짝 밝게 */
            linear-gradient(180deg, #f9fbff 0%, #ffffff 100%);

    background-repeat: no-repeat;

    @media (prefers-color-scheme: dark) {
        /* ===== dark mode: 네이비 바탕 + 보라/마젠타 블롭 ===== */
        --blob-blue: 120 150 255;
        --blob-pink: 255 110 190;

        background:
                radial-gradient(900px 600px at 20% 72%,
                rgba(var(--blob-blue) / 0.35) 0%,
                rgba(var(--blob-blue) / 0.18) 28%,
                rgba(var(--blob-blue) / 0.00) 60%),
                radial-gradient(700px 620px at 74% 30%,
                rgba(var(--blob-pink) / 0.38) 0%,
                rgba(var(--blob-pink) / 0.16) 36%,
                rgba(var(--blob-pink) / 0.00) 62%),
                linear-gradient(180deg, #0b1222 0%, #0a0f1c 100%);
    }
`;

/* 전면 오버레이 링크 */
const OverlayLink = styled.a`
  position: absolute;
  inset: 0;            /* 전체 영역 커버 */
  z-index: 10;         /* 텍스트/아이콘 위에 */
  display: block;
  pointer-events: auto;
  cursor: pointer;

  /* 접근성: 키보드 포커스 링 */
  &:focus-visible {
    outline: 3px solid rgba(79,118,241,.5);
    outline-offset: -2px;
  }
`;

/* 네비 Inner 라인에 맞춘 인셋 + 원하는 만큼 좌우 오프셋 */
const Inset = styled.div`
  --hero-left-offset: 0px;
  --hero-right-offset: 0px;

  padding-left: calc(
    max(var(--shell-left, 20px), env(safe-area-inset-left)) +
      var(--hero-left-offset)
  );
  padding-right: calc(
    max(var(--shell-right, 20px), env(safe-area-inset-right)) +
      var(--hero-right-offset)
  );
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
    $narrow
        ? `${theme?.custom?.layout?.narrowMaxWidth ?? 980}px`
        : `${theme?.custom?.layout?.containerMaxWidth ?? 1280}px`};
  margin: 0 auto;
`;

const HeroTitle = styled.h1`
  margin: 0;
  font-weight: 750;
  letter-spacing: -0.06em;
  font-size: clamp(28px, 6vw, 56px);
  line-height: 1.1;
  color: #0f172a;

  @media (prefers-color-scheme: dark) {
    color: #e5e7eb;
  }
`;

const HeroSub = styled.p`
  margin: 12px 0 0 0;
  letter-spacing: -0.06em;
  font-size: clamp(14px, 2.6vw, 20px);
  line-height: 1.6;
  color: #334155;

  @media (prefers-color-scheme: dark) {
    color: #9aa4b2;
  }
`;

const TextWrap = styled.div`
  position: relative;
  z-index: 2; /* 아이콘 레이어(1) 위로 */
`;

export default function SpoonNoteHeroBanner({
                                                title = "스푼노트",
                                                subtitle = "필요한 개념만, 필요한 순간에 — 나만의 맞춤 학습 노트",
                                                className,
                                                align = "left",
                                                narrow = true,
                                                offsetLeft = 15,
                                                offsetRight = 0,
                                                assetHost,
                                                iconProps,
                                            }: Props) {
    const ICON_SRC = "/hero/icon-4.png";

    return (
        <HeroWrap className={className} aria-label="스푼노트 소개 배너">
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

            {/* 항상 icon-4만 렌더 */}
            <HeroFloatingIcons
                srcs={[ICON_SRC]}
                assetHost={assetHost}
                {...(iconProps ?? {})}
            />
            <OverlayLink
                href="http://localhost/spoon-word/notes"
                aria-label="스푼노트로 이동"
            />
        </HeroWrap>
    );
}