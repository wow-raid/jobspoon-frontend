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

// 로고 경로
import logoDanggeun from "../assets/d1.png";
import logoToss from "../assets/t2.png";
import logoEncore from "../assets/e1.png";
import logoKT from "../assets/3.png";

/* ===== 공통 레이아웃 ===== */
const Page = styled.main`
  min-height: 100vh;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -webkit-touch-callout: none;
`;

const Section = styled.section`
  width: 100%;
  margin: 0;
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

/* ===== 하단 섹션 ===== */
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
  h2 { font-size: 32px; font-weight: 700; margin-bottom: 12px; }
  p  { font-size: 18px; line-height: 1.6; }
`;

const Features = styled.div`
  margin-top: 60px;
  h2 { font-size: 24px; font-weight: 600; margin-bottom: 16px; }
  p  { font-size: 16px; color: #b9c0cc; line-height: 1.8; }
`;

const Companies = styled.div`
  margin-top: 60px;
  text-align: center;
  h3 { font-size: 20px; font-weight: 600; }
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

/* 로고 래퍼: 기본 약간 흑백, 호버 시 컬러 */
const LogoItemWrap = styled.div`
  width: 120px;
  height: 120px;
  padding: 2px; /* 외곽선/애니메이션 잘림 방지 */
  display: flex;
  align-items: center;
  justify-content: center;
  filter: grayscale(0.3);
  transition: transform .3s ease, filter .3s ease;
  &:hover { transform: scale(1.05); filter: grayscale(0); }
`;

const BlueText = styled.strong` color: #3b82f6; `;

/* ===== 항상 흰 스트로크가 붙는 SVG 로고 ===== */
function SvgStrokeLogo({
    src,
    size = 120,
    stroke = 1,
    color = "#fff",
}: {
    src: string;
    size?: number;
    stroke?: number;
    color?: string;
}) {
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
                <filter id={strokeId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
                    <feMorphology in="SourceAlpha" operator="dilate" radius={stroke} result="DILATE" />
                    <feFlood floodColor={color} />
                    <feComposite in2="DILATE" operator="in" result="STROKE" />
                    <feMerge>
                        <feMergeNode in="STROKE" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <image href={src} width={size} height={size} preserveAspectRatio="xMidYMid meet" />
        </svg>
    );
}

/* ===== confetti용 고정 캔버스 ===== */
const ConfettiCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none;
  z-index: 9999;
`;

/* ===== 섹션 컴포넌트 (여기에 confetti 트리거 추가) ===== */
function HomeFive() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const confettiFnRef = useRef<ReturnType<typeof confetti.create> | null>(null);

    // AOS
    useEffect(() => { AOS.init({ once: true, duration: 1000 }); }, []);

    // confetti 인스턴스 생성
    useEffect(() => {
        if (canvasRef.current && !confettiFnRef.current) {
            confettiFnRef.current = confetti.create(canvasRef.current, {
                resize: true,
                useWorker: true,
            });
        }
        return () => { confettiFnRef.current = null; };
    }, []);

    // 보이면 한 번만 발사
    useEffect(() => {
        if (!sectionRef.current) return;
        const el = sectionRef.current;

        const fireConfetti = () => {
            const fn = confettiFnRef.current;
            if (!fn) return;

            const makeShot = (ratio: number, opts: any) =>
                fn({ ...opts, particleCount: Math.floor(200 * ratio), origin: { y: 0.8 } });

            makeShot(0.25, { spread: 26, startVelocity: 55 });
            makeShot(0.2, { spread: 60 });
            makeShot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            makeShot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            makeShot(0.1, { spread: 120, startVelocity: 45 });
        };

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        fireConfetti();
                        io.disconnect(); // 한 번만
                    }
                });
            },
            { threshold: 0.5 }
        );

        io.observe(el);
        return () => io.disconnect();
    }, []);

    const logos = [logoDanggeun, logoToss, logoEncore, logoKT];

    return (
        <HomeFiveSection ref={sectionRef} className="home-five" data-aos="fade-up">
            <Hero data-aos="fade-up" data-aos-delay="100">
                <h2>국내 최초, 개발자를 위한 AI 모의 면접 플랫폼</h2>
                <p>
                    <BlueText>JobSpoon</BlueText>은 진짜 면접처럼 연습하고, <br />
                    기업 맞춤 정보를 통해 자신 있게 면접을 준비할 수 있도록 돕습니다.
                </p>
            </Hero>

            <Features data-aos="fade-up" data-aos-delay="300">
                <h2><BlueText>JobSpoon</BlueText>은 이렇게 다릅니다</h2>
                <p>
                    단순한 질문 생성기가 아닙니다. <br />
                    각 기업이 요구하는 조건, 자주 묻는 질문, 실제 면접에서 사용된 질문을 수집하고 분석하여<br />
                    사용자에게 맞춤형으로 제공하는 국내 최초 개발자 특화 면접 준비 사이트입니다.
                </p>
            </Features>

            <Companies data-aos="fade-up" data-aos-delay="500">
                <h3>현재 <BlueText>JobSpoon</BlueText>이 지원하는 기업</h3>
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

            {/* 화면 전체 confetti 캔버스 (pointer-events: none) */}
            <ConfettiCanvas ref={canvasRef} />
        </HomeFiveSection>
    );
}

/* ===== 메인 ===== */
export default function Main() {
    useEffect(() => { AOS.init({ once: true, duration: 800 }); }, []);
    const images = [img01, img02, img03, img04, img05, img06, img07];

    return (
        <Page onContextMenu={preventContextMenu}>
            {images.map((src, i) => (
                <Section key={src} onContextMenu={preventContextMenu} data-aos="fade-up">
                    <Picture
                        src={src}
                        alt={`JOB Spoon 메인 비주얼 ${i + 1}`}
                        loading={i === 0 ? "eager" : "lazy"}
                        decoding="async"
                        draggable={false}
                        onDragStart={(e) => e.preventDefault()}
                    />
                </Section>
            ))}
            <HomeFive />
        </Page>
    );
}
