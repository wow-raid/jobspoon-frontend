// src/components/Main.tsx
import React, { useEffect, useId, useRef } from "react";
import styled, { keyframes } from "styled-components";
import AOS from "aos";
import "aos/dist/aos.css";
import confetti from "canvas-confetti";

import img01 from "../assets/main01.jpg";
import img02 from "../assets/main02.jpg";
import img03 from "../assets/main03.jpg";
import img04 from "../assets/main04.jpg";
import img05 from "../assets/main05.jpg";
import img06 from "../assets/main06.jpg";
import img07 from "../assets/main07.jpg";

// 로고
import logoDanggeun from "../assets/d1.png";
import logoToss from "../assets/t2.png";
import logoEncore from "../assets/e1.png";
import logoKT from "../assets/3.png";

/* ========== 공통 레이아웃 ========== */
const Page = styled.main`
  min-height: 100vh;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
`;

const Picture = styled.img`
  width: 100%;
  display: block;
  height: auto;
  pointer-events: none;
  -webkit-user-drag: none;
  user-drag: none;
`;

const preventContextMenu: React.MouseEventHandler = (e) => e.preventDefault();

/* ========== 섹션: 1번은 풀블리드, 이후는 1200 컨테이너 ========== */

/** 1) 첫번째 이미지를 뷰포트 가로 100%로 “풀블리드” */
const FullBleedSection = styled.section`
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
  max-width: 100vw;
`;

/** 2) 나머지 이미지는 최대 1200px, 1440px 기준 좌우 120px 여백 */
const ConstrainedSection = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding-left: clamp(16px, calc((100vw - 1200px) / 2), 120px);
  padding-right: clamp(16px, calc((100vw - 1200px) / 2), 120px);
`;

/* ========== 아래 텍스트/로고 섹션 ========== */
const scrollLeft = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

const HomeFiveSection = styled.section`
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 20px 120px;
  text-align: center;
`;

const Hero = styled.div`
  margin-bottom: 40px;
  h2 {
    font-size: 32px;
    font-weight: 700;
    margin-bottom: 12px;
  }
  p {
    font-size: 18px;
    line-height: 1.6;
  }
`;

const Features = styled.div`
  margin-top: 60px;
  h2 {
    font-size: 24px;
    font-weight: 600;
    margin-bottom: 16px;
  }
  p {
    font-size: 16px;
    color: #b9c0cc;
    line-height: 1.8;
  }
`;

const Companies = styled.div`
  margin-top: 60px;
  text-align: center;
  h3 {
    font-size: 20px;
    font-weight: 600;
  }
`;

const LogoSlider = styled.div`
  overflow: hidden;
  width: 100%;
  margin-top: 20px;
`;

const LogoTrack = styled.div`
  display: flex;
  gap: 40px;
  animation: ${scrollLeft} 20s linear infinite;
`;

const LogoItemWrap = styled.div`
  width: 120px;
  height: 120px;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: grayscale(0.3);
  transition: transform 0.3s ease, filter 0.3s ease;
  &:hover {
    transform: scale(1.05);
    filter: grayscale(0);
  }
`;

const BlueText = styled.strong`
  color: #3b82f6;
`;

/* 항상 흰 스트로크가 붙는 SVG 로고 (useId 경고 fix) */
type SvgStrokeLogoProps = {
    src: string;
    size?: number;
    stroke?: number;
    color?: string;
};

function SvgStrokeLogo({
    src,
    size = 120,
    stroke = 1,
    color = "#fff",
}: SvgStrokeLogoProps) {
    const rawId = useId().replace(/[:]/g, "");
    const strokeId = `stroke-${rawId}`;

    return (
        <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ display: "block" }}
            xmlns="http://www.w3.org/2000/svg"
            filter={`url(#${strokeId})`}
        >
            <defs>
                <filter
                    id={strokeId}
                    x="-10%"
                    y="-10%"
                    width="120%"
                    height="120%"
                    colorInterpolationFilters="sRGB"
                >
                    <feMorphology
                        in="SourceAlpha"
                        operator="dilate"
                        radius={stroke}
                        result="DILATE"
                    />
                    <feFlood floodColor={color} />
                    <feComposite in2="DILATE" operator="in" result="STROKE" />
                    <feMerge>
                        <feMergeNode in="STROKE" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <image
                href={src}
                width={size}
                height={size}
                preserveAspectRatio="xMidYMid meet"
            />
        </svg>
    );
}

/* confetti용 고정 캔버스 */
const ConfettiCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none;
  z-index: 9999;
`;

/* ===== 하단 섹션 (보이면 스크롤 진입마다 confetti 재발사) ===== */
function HomeFive() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const confettiFnRef = useRef<ReturnType<typeof confetti.create> | null>(null);
    const cooldownRef = useRef(false); // ✅ 중복 발사 방지

    // 스크롤마다 AOS 재실행
    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: false,
            mirror: true,
            offset: 80,
        });
    }, []);

    // confetti 인스턴스 생성
    useEffect(() => {
        if (canvasRef.current && !confettiFnRef.current) {
            confettiFnRef.current = confetti.create(canvasRef.current, {
                resize: true,
                useWorker: true,
            });
        }
        return () => {
            confettiFnRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (!sectionRef.current) return;
        const el = sectionRef.current;

        const fireConfetti = () => {
            const fn = confettiFnRef.current;
            if (!fn) return;

            const makeShot = (ratio: number, opts: any) =>
                fn({
                    ...opts,
                    particleCount: Math.floor(200 * ratio),
                    origin: { y: 0.8 },
                });

            makeShot(0.25, { spread: 26, startVelocity: 55 });
            makeShot(0.2, { spread: 60 });
            makeShot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            makeShot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            makeShot(0.1, { spread: 120, startVelocity: 45 });
        };

        const onIntersect: IntersectionObserverCallback = (entries) => {
            entries.forEach((entry) => {
                if (
                    entry.isIntersecting &&
                    !document.hidden &&
                    !cooldownRef.current
                ) {
                    fireConfetti();
                    cooldownRef.current = true;
                    setTimeout(() => (cooldownRef.current = false), 3500); // ✅ 쿨다운
                }
            });
        };

        const io = new IntersectionObserver(onIntersect, { threshold: 0.5 });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    const logos = [logoDanggeun, logoToss, logoEncore, logoKT];

    return (
        <HomeFiveSection
            ref={sectionRef}
            className="home-five"
            data-aos="fade-up"
            data-aos-once="false"
            data-aos-anchor-placement="top-bottom"
        >
            <Hero data-aos="fade-up" data-aos-delay="100" data-aos-once="false">
                <h2>국내 최초, 개발자를 위한 AI 모의 면접 플랫폼</h2>
                <p>
                    <BlueText>JobSpoon</BlueText>은 진짜 면접처럼 연습하고, <br />
                    기업 맞춤 정보를 통해 자신 있게 면접을 준비할 수 있도록 돕습니다.
                </p>
            </Hero>

            <Features data-aos="fade-up" data-aos-delay="300" data-aos-once="false">
                <h2>
                    <BlueText>JobSpoon</BlueText>은 이렇게 다릅니다
                </h2>
                <p>
                    단순한 질문 생성기가 아닙니다. <br />
                    각 기업이 요구하는 조건, 자주 묻는 질문, 실제 면접에서 사용된 질문을 수집하고 분석하여
                    <br />
                    사용자에게 맞춤형으로 제공하는 국내 최초 개발자 특화 면접 준비 사이트입니다.
                </p>
            </Features>

            <Companies data-aos="fade-up" data-aos-delay="500" data-aos-once="false">
                <h3>
                    현재 <BlueText>JobSpoon</BlueText>이 지원하는 기업
                </h3>
                <LogoSlider>
                    <LogoTrack>
                        {[...logos, ...logos].map((src, i) => (
                            <LogoItemWrap key={`${src}-${i}`}>
                                <SvgStrokeLogo src={src} size={120} stroke={1} />
                            </LogoItemWrap>
                        ))}
                    </LogoTrack>
                </LogoSlider>
            </Companies>

            <ConfettiCanvas ref={canvasRef} />
        </HomeFiveSection>
    );
}

/* ========== 메인 ========== */
export default function Main() {
    // 스크롤마다 재실행되도록 once:false + mirror:true
    useEffect(() => {
        AOS.init({
            duration: 800,
            once: false,
            mirror: true,
            offset: 80,
        });

        const onResize = () => AOS.refresh();
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    const images = [img01, img02, img03, img04, img05, img06, img07];

    const handleImgLoad = () => AOS.refresh();

    return (
        <Page onContextMenu={preventContextMenu}>
            {/* 1) 첫 번째 이미지는 화면 전체 넓이(풀블리드) */}
            <FullBleedSection
                data-aos="fade-up"
                data-aos-once="false"
                data-aos-anchor-placement="top-bottom"
                onContextMenu={preventContextMenu}
            >
                <Picture
                    src={images[0]}
                    alt="JOB Spoon 메인 비주얼 1"
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    onDragStart={(e) => e.preventDefault()}
                    onLoad={handleImgLoad}
                />
            </FullBleedSection>

            {/* 2) 이후 이미지는 1200px 컨텐츠 폭 + 반응형 좌우 여백 */}
            {images.slice(1).map((src, i) => (
                <ConstrainedSection
                    key={src}
                    data-aos="fade-up"
                    data-aos-once="false"
                    data-aos-anchor-placement="top-bottom"
                    onContextMenu={preventContextMenu}
                >
                    <Picture
                        src={src}
                        alt={`JOB Spoon 메인 비주얼 ${i + 2}`}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                        onLoad={handleImgLoad}
                    />
                </ConstrainedSection>
            ))}

            {/* 하단 설명/로고 섹션 */}
            <HomeFive />
        </Page>
    );
}
