import React, { useMemo } from "react";
import styled from "styled-components";

type Pos = { left: number; top: number }; // % 기준

type Props = {
    srcs: [string, string, string];
    width?: string;              // 떠다니는 영역 가로
    height?: string;             // 떠다니는 영역 세로
    top?: string;                // 히어로 상단에서부터 거리
    rightOffset?: number;        // 네비 우측선 기준 +오프셋(px)
    debug?: boolean;
    assetHost?: string;          // 예: http://localhost:3006

    withShadow?: boolean;        // 기본 false
    maxIconWidthPercent?: number;// 각 아이콘 최대폭 (% of field width)
    scales?: [number, number, number]; // 개별 스케일
    positions?: [Pos, Pos, Pos]; // 각 아이콘 위치(%)
};

const Layer = styled.div<{ $w: string; $h: string; $top: string; $right: number; $debug?: boolean }>`
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 1;

    > .field {
        position: absolute;
        top: ${({ $top }) => $top};
        right: calc(max(var(--shell-right, 20px), 20px) + ${({ $right }) => $right}px);
        width: ${({ $w }) => $w};
        height: ${({ $h }) => $h};
        ${({ $debug }) => $debug && "outline: 2px dashed rgba(0,128,255,.6); background: rgba(0,128,255,.06);"}
    }
`;

const Icon = styled.img<{ $z: number; $maxPct: number; $shadow: boolean }>`
  position: absolute;
  max-width: ${({ $maxPct }) => $maxPct}%;
  filter: ${({ $shadow }) => ($shadow ? "drop-shadow(0 18px 30px rgba(0,0,0,.25))" : "none")};
  transform-origin: center center;
  z-index: ${({ $z }) => $z};
`;

function absolutize(src: string, hostOrigin?: string): string {
    if (!hostOrigin) return src;
    try {
        if (/^https?:\/\//i.test(src)) return src;            // 이미 절대 URL
        if (src.startsWith("/")) return `${hostOrigin}${src}`; // /hero/... → http://host/hero/...
        return `${hostOrigin}/${src.replace(/^\.?\//, "")}`;   // 상대경로
    } catch {
        return src;
    }
}

const HeroFloatingIcons: React.FC<Props> = ({
                                                srcs,
                                                width = "clamp(220px, 26vw, 380px)",
                                                height = "clamp(160px, 24vw, 320px)",
                                                top = "clamp(16px, 6vw, 64px)",
                                                rightOffset = 0,
                                                debug = false,
                                                assetHost,

                                                withShadow = false,
                                                maxIconWidthPercent = 40,
                                                scales = [1.0, 0.92, 0.98],
                                                positions = [
                                                    { left: 18, top: 15 }, // 1번 아이콘 위치(%)
                                                    { left: 66, top: 15 }, // 2번
                                                    { left: 46, top: 28 }, // 3번
                                                ],
                                            }) => {
    const resolved = useMemo(
        () => srcs.map((s) => absolutize(s, assetHost)) as [string, string, string],
        [srcs, assetHost]
    );

    return (
        <Layer $w={width} $h={height} $top={top} $right={rightOffset} $debug={debug} aria-hidden>
            <div className="field">
                <Icon
                    src={resolved[0]}
                    alt=""
                    $z={3}
                    $maxPct={maxIconWidthPercent}
                    $shadow={withShadow}
                    style={{ left: `${positions[0].left}%`, top: `${positions[0].top}%`, transform: `translate(-50%, -50%) scale(${scales[0]})` }}
                    onError={() => console.warn("icon load fail:", resolved[0])}
                />
                <Icon
                    src={resolved[1]}
                    alt=""
                    $z={2}
                    $maxPct={maxIconWidthPercent}
                    $shadow={withShadow}
                    style={{ left: `${positions[1].left}%`, top: `${positions[1].top}%`, transform: `translate(-50%, -50%) scale(${scales[1]})` }}
                    onError={() => console.warn("icon load fail:", resolved[1])}
                />
                <Icon
                    src={resolved[2]}
                    alt=""
                    $z={1}
                    $maxPct={maxIconWidthPercent}
                    $shadow={withShadow}
                    style={{ left: `${positions[2].left}%`, top: `${positions[2].top}%`, transform: `translate(-50%, -50%) scale(${scales[2]})` }}
                    onError={() => console.warn("icon load fail:", resolved[2])}
                />
            </div>
        </Layer>
    );
};

export default HeroFloatingIcons;
