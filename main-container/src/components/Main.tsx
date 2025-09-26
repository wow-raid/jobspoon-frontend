// src/components/Main.tsx
import React, {
  useEffect,
  useId,
  useRef,
  useState,
  useLayoutEffect,
} from "react";
import styled, { keyframes } from "styled-components";
import AOS from "aos";
import "aos/dist/aos.css";
import confetti from "canvas-confetti";

/* ====== 이미지 ====== */
import main01 from "../assets/main01.png";
import main02_dark from "../assets/main02_dark.png";
import main02_white from "../assets/main02_white.jpg";
import main03_dark from "../assets/main03_dark.png";
import main03_white from "../assets/main03_white.png";
import main04_dark from "../assets/main04_dark.png";
import main04_white from "../assets/main04_white.jpg";
import main05_dark from "../assets/main05_dark.png";
import main05_white from "../assets/main05_white.png";
import main06_dark from "../assets/main06_dark.jpg";
import main06_white from "../assets/main06_white.jpg";
import main07_dark from "../assets/main07_dark.png";
import main07_white from "../assets/main07_white.png";

/* ====== 로고 ====== */
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

/* ========== 1번은 풀블리드, 이후는 90vw ========== */
const FullBleedSection = styled.section`
  position: relative;
  left: 50%;
  right: 50%;
  margin-left: -50vw;
  margin-right: -50vw;
  width: 100vw;
  max-width: 100vw;
  margin-bottom: 60px; /* main01 과 다음 섹션 사이 간격 */
`;

const ConstrainedSection = styled.section`
  width: 90vw;
  max-width: 1440px;
  margin: 0 auto;
`;

/* ====== 1번 오버레이 ====== */
const OverlayWrap = styled.div`
  position: absolute;

  /* 글자와 AI 배지가 겹치지 않게 살짝 하단으로 */
  top: clamp(26%, 31vh, 36%);
  right: clamp(8px, 7vw, 140px);
  left: auto;

  /* 화면 밖으로 나가지 않도록 최대 너비 제한 */
  max-width: min(52vw, 680px);
  width: max-content;
  text-align: right;
  color: #fff;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  line-height: 1.25;
  pointer-events: none;

  /* 기본 폰트 스케일(요청: 기존의 0.9배) */
  --hero-scale: 0.72;

  @media (max-width: 1100px) {
    --hero-scale: 0.648;
    max-width: 58vw;
    right: 7vw;
    top: clamp(24%, 30vh, 34%);
  }
  @media (max-width: 900px) {
    --hero-scale: 0.594;
    max-width: 64vw;
    right: 6vw;
    top: clamp(22%, 29vh, 33%);
  }
  @media (max-width: 640px) {
    --hero-scale: 0.54;
    max-width: 74vw;
    right: 5vw;
    top: clamp(20%, 27vh, 31%);
  }
  @media (max-width: 480px) {
    --hero-scale: 0.486;
    max-width: 86vw;
    right: 4vw;
    top: clamp(18%, 25vh, 29%);
  }
`;

const Line = styled.div`
  font-weight: 800;
  letter-spacing: -0.02em;
  white-space: pre-wrap;

  &.lg {
    /* 단어 단위 줄바꿈으로 '무대'가 쪼개지지 않도록 */
    word-break: keep-all;
    overflow-wrap: normal;
    /* 지원 브라우저에서 줄 균형 */
    text-wrap: balance;
    line-break: loose;

    font-size: calc(var(--hero-scale) * clamp(22px, 5vw, 56px));
  }

  &.sm {
    font-size: calc(var(--hero-scale) * clamp(18px, 4.2vw, 44px));
    margin-top: 10px;
  }
`;

/* 두 번째 줄(‘잡스푼’) 고정폭 컨테이너: 우측정렬 유지 + LTR 타이핑 */
const FixedWidthLine = styled.div`
  position: relative;
  display: inline-block; /* 부모가 right-align이므로 이 박스 자체가 오른쪽에 붙음 */
  text-align: left; /* 내부 타이핑은 왼→오 */
  line-height: 1.25;
  .ghost {
    visibility: hidden;
    pointer-events: none;
  }
  .typing {
    position: absolute;
    left: 0;
    top: 0;
    white-space: pre; /* 자간 보존 */
  }
`;

/* ====== 라이트/다크 스왑 (OS 선호 무시, data-theme만 신뢰) ====== */
const SwapWrap = styled.div`
  position: relative;
`;

const LightImg = styled(Picture)`
  display: block;
  :root[data-theme="dark"] & {
    display: none !important;
  }
`;

const DarkImg = styled(Picture)`
  display: none;
  :root[data-theme="dark"] & {
    display: block !important;
  }
`;

function ThemedSwap({
  light,
  dark,
  alt,
}: {
  light: string;
  dark: string;
  alt: string;
}) {
  return (
    <SwapWrap>
      <LightImg
        src={light}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
      <DarkImg
        src={dark}
        alt={alt}
        loading="lazy"
        decoding="async"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
      />
    </SwapWrap>
  );
}

/* ====== 두 줄 타자기 ====== */
function useTwoLineTypewriter(
  line1: string,
  line2: string,
  opts?: {
    type1Ms?: number;
    type2Ms?: number;
    gapMs?: number;
    holdMs?: number;
    cycleGapMs?: number;
  }
) {
  const {
    type1Ms = 55,
    type2Ms = 55,
    gapMs = 500,
    holdMs = 1100,
    cycleGapMs = 500,
  } = opts || {};

  const [t1, setT1] = useState("");
  const [t2, setT2] = useState("");
  const [phase, setPhase] = useState<
    "typing1" | "gap" | "typing2" | "hold" | "clear"
  >("typing1");

  useEffect(() => {
    let id: number;

    if (phase === "typing1") {
      if (t1.length < line1.length) {
        id = window.setTimeout(
          () => setT1(line1.slice(0, t1.length + 1)),
          type1Ms
        );
      } else {
        id = window.setTimeout(() => setPhase("gap"), gapMs);
      }
    } else if (phase === "gap") {
      setPhase("typing2");
    } else if (phase === "typing2") {
      if (t2.length < line2.length) {
        id = window.setTimeout(
          () => setT2(line2.slice(0, t2.length + 1)),
          type2Ms
        );
      } else {
        id = window.setTimeout(() => setPhase("hold"), holdMs);
      }
    } else if (phase === "hold") {
      id = window.setTimeout(() => setPhase("clear"), 250);
    } else {
      setT1("");
      setT2("");
      id = window.setTimeout(() => setPhase("typing1"), cycleGapMs);
    }

    return () => window.clearTimeout(id);
  }, [
    phase,
    t1,
    t2,
    line1,
    line2,
    type1Ms,
    type2Ms,
    gapMs,
    holdMs,
    cycleGapMs,
  ]);

  return { line1: t1, line2: t2 };
}

/* ===== 아래부 텍스트/로고 ===== */
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
  transition:
    transform 0.3s ease,
    filter 0.3s ease;
  &:hover {
    transform: scale(1.05);
    filter: grayscale(0);
  }
`;
const BlueText = styled.strong`
  color: #3b82f6;
`;

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

const ConfettiCanvas = styled.canvas`
  position: fixed;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  pointer-events: none;
  z-index: 9999;
`;

/* ===== 하단 섹션 ===== */
function HomeFive() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiFnRef = useRef<ReturnType<typeof confetti.create> | null>(null);
  const cooldownRef = useRef(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: false, mirror: true, offset: 80 });
    const onResize = () => AOS.refresh();
    window.addEventListener("resize", onResize);

    // 초기 한 번만 추가하고, 언마운트 시 제거하지 않음
    document.documentElement.classList.add("theme-ready");

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

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
    const fire = () => {
      const fn = confettiFnRef.current;
      if (!fn) return;
      const shot = (r: number, o: any) =>
        fn({ ...o, particleCount: Math.floor(200 * r), origin: { y: 0.8 } });
      shot(0.25, { spread: 26, startVelocity: 55 });
      shot(0.2, { spread: 60 });
      shot(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      shot(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      shot(0.1, { spread: 120, startVelocity: 45 });
    };
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting && !document.hidden && !cooldownRef.current) {
            fire();
            cooldownRef.current = true;
            setTimeout(() => (cooldownRef.current = false), 3500);
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
    <HomeFiveSection
      ref={sectionRef}
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
          각 기업이 요구하는 조건, 자주 묻는 질문, 실제 면접에서 사용된 질문을
          수집하고 분석하여
          <br />
          사용자에게 맞춤형으로 제공하는 국내 최초 개발자 특화 면접 준비
          사이트입니다.
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

/* ========== 제품 소개: 스푼워드 / 마이페이지 / 스터디 모임 ========== */
const ProductsWrap = styled.section`
  width: 90vw;
  max-width: 1200px;
  margin: 0 auto;
  padding: 72px 0 120px;
`;

const ProductsHeader = styled.div`
  text-align: center;
  margin-bottom: 36px;
  h2 {
    font-size: clamp(22px, 3.2vw, 34px);
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  p {
    margin-top: 10px;
    font-size: clamp(14px, 1.6vw, 16px);
    color: #aab2bf;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(16px, 2.4vw, 28px);

  @media (max-width: 980px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.article`
  position: relative;
  border-radius: 20px;
  padding: clamp(18px, 2.6vw, 28px);
  background:
    radial-gradient(
      60% 80% at 100% -10%,
      rgba(99, 102, 241, 0.25),
      transparent 60%
    ),
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08),
      rgba(255, 255, 255, 0.04)
    );
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;

  &:hover {
    transform: translateY(-6px);
    border-color: rgba(255, 255, 255, 0.16);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.16);
  }
`;

const IconCircle = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #60a5fa, #6366f1);
  color: white;
  font-size: 22px;
  font-weight: 700;
  box-shadow: 0 8px 18px rgba(99, 102, 241, 0.35);
`;

const CardTitle = styled.h3`
  margin-top: 14px;
  font-size: clamp(18px, 2.2vw, 22px);
  font-weight: 800;
  letter-spacing: -0.01em;
`;

/* ✅ 카드 본문: 라이트에서 진하게, 다크에서는 밝게 */
const CardDesc = styled.p`
  margin-top: 8px;
  color: #334155; /* light: slate-700 */
  font-size: clamp(14px, 1.6vw, 15.5px);
  line-height: 1.7;
  font-weight: 500;

  :root[data-theme="dark"] & {
    color: #e8eef8; /* dark: 밝게 */
  }
`;

/* ✅ 불릿: 라이트에서 더 진하게, 다크에서는 더 밝게 */
const Bullet = styled.ul`
  margin: 14px 0 0;
  padding-left: 16px;

  li {
    margin: 6px 0;
    font-size: clamp(14px, 1.7vw, 15px);
    color: #475569; /* light: slate-600 */
    list-style: none;
    position: relative;
    padding-left: 14px;
  }
  li::before {
    content: "•";
    position: absolute;
    left: 0;
    top: 0;
    color: #2563eb; /* 포인트도 진하게(blue-600) */
  }

  :root[data-theme="dark"] & li {
    color: #f2f6ff; /* dark: 훨씬 밝게 */
  }
  :root[data-theme="dark"] & li::before {
    color: #8ab6ff; /* dark 포인트 */
  }
`;

/* ✅ 버튼: 하단 정렬 유지(세 카드 동일 y 정렬) */
const CardAction = styled.a`
  margin-top: auto; /* 하단으로 밀착 */
  align-self: flex-start;

  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  color: #0b63ff;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.25);
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    background: rgba(59, 130, 246, 0.18);
    border-color: rgba(59, 130, 246, 0.35);
  }
`;

function ProductsIntro() {
  return (
    <ProductsWrap>
      <ProductsHeader data-aos="fade-up">
        <h2>무기를 장전하세요</h2>
        <p>스푼워드 · 마이페이지 · 스터디 모임으로 준비 과정을 한 번에.</p>
      </ProductsHeader>

      <ProductGrid>
        {/* 스푼워드 */}
        <Card data-aos="fade-up" data-aos-delay="50">
          <IconCircle>🔤</IconCircle>
          <CardTitle>스푼워드</CardTitle>
          <CardDesc>
            신입·주니어 개발자가 실제 면접에서 자주 마주치는 키워드만 쏙쏙.
            개념→예시→꼬리질문까지 한 흐름으로 정리되어 있어요.
          </CardDesc>
          <Bullet>
            <li>핵심 정의와 한 문장 요약</li>
            <li>코드/아키텍처 예시와 실무 포인트</li>
            <li>꼬리질문 &amp; 대비 포인트</li>
          </Bullet>
          <CardAction href="/spoon-word">바로 보기 →</CardAction>
        </Card>

        {/* 마이페이지 */}
        <Card data-aos="fade-up" data-aos-delay="120">
          <IconCircle>📊</IconCircle>
          <CardTitle>마이페이지</CardTitle>
          <CardDesc>
            연습 기록·피드백·즐겨찾기를 한 곳에서. 강점/약점 트렌드를 보고 다음
            연습 주제를 빠르게 결정하세요.
          </CardDesc>
          <Bullet>
            <li>문항/기업별 정답률 &amp; 시간 분석</li>
            <li>AI 피드백 히스토리 관리</li>
            <li>즐겨찾기/학습 리스트</li>
          </Bullet>
          <CardAction href="/mypage">나의 대시보드 →</CardAction>
        </Card>

        {/* 스터디 모임 */}
        <Card data-aos="fade-up" data-aos-delay="190">
          <IconCircle>👥</IconCircle>
          <CardTitle>스터디 모임</CardTitle>
          <CardDesc>
            혼자보다 함께가 빠릅니다. 역할 분담, 진행 템플릿, 출석/리캡까지
            온라인·오프라인 스터디 운영을 지원해요.
          </CardDesc>
          <Bullet>
            <li>모집·일정·출석 관리</li>
            <li>질문 뱅크 &amp; 진행 체크리스트</li>
            <li>리뷰/회고 템플릿</li>
          </Bullet>
          <CardAction href="/studies">모임 찾기/만들기 →</CardAction>
        </Card>
      </ProductGrid>
    </ProductsWrap>
  );
}

/* ========== 메인 ========== */
export default function Main() {
  /* ✅ 저장된 테마가 없으면 기본 light로 시작 (최초 시크릿/첫 방문에서도 라이트 이미지) */
  useLayoutEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme"); // 'dark' | 'light' | null
    if (saved === "dark" || saved === "light") {
      root.setAttribute("data-theme", saved);
    } else {
      root.setAttribute("data-theme", "light"); // 기본값 라이트
    }
  }, []);

  useEffect(() => {
    AOS.init({ duration: 800, once: false, mirror: true, offset: 80 });
    const onResize = () => AOS.refresh();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const pairs = [
    { dark: main02_dark, light: main02_white, alt: "JOB Spoon 메인 비주얼 2" },
    { dark: main03_dark, light: main03_white, alt: "JOB Spoon 메인 비주얼 3" },
    { dark: main04_dark, light: main04_white, alt: "JOB Spoon 메인 비주얼 4" },
    { dark: main05_dark, light: main05_white, alt: "JOB Spoon 메인 비주얼 5" },
    { dark: main06_dark, light: main06_white, alt: "JOB Spoon 메인 비주얼 6" },
    { dark: main07_dark, light: main07_white, alt: "JOB Spoon 메인 비주얼 7" },
  ];

  const handleImgLoad = () => AOS.refresh();

  // 요구사항: 1줄 타이핑 후 0.5초 뒤 2줄 타이핑
  const { line1, line2 } = useTwoLineTypewriter(
    "취업 전, 당신의 마지막 연습 무대",
    "잡스푼",
    { gapMs: 500 }
  );

  return (
    <Page onContextMenu={preventContextMenu}>
      {/* 1) 풀블리드 + 오버레이 */}
      <FullBleedSection
        data-aos="fade-up"
        data-aos-once="false"
        data-aos-anchor-placement="top-bottom"
        onContextMenu={preventContextMenu}
      >
        <Picture
          src={main01}
          alt="JOB Spoon 메인 비주얼 1"
          loading="eager"
          decoding="async"
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onLoad={handleImgLoad}
        />
        <OverlayWrap>
          <Line className="lg">{line1}</Line>
          <Line className="sm">
            <FixedWidthLine>
              {/* 고정폭 확보(우측 끝 정렬) */}
              <span className="ghost">잡스푼</span>
              <span className="typing">{line2}</span>
            </FixedWidthLine>
          </Line>
        </OverlayWrap>
      </FullBleedSection>

      {/* 2) 이후: 90vw + 테마 스왑 (data-theme만 신뢰) */}
      {pairs.map(({ dark, light, alt }) => (
        <ConstrainedSection
          key={alt}
          data-aos="fade-up"
          data-aos-once="false"
          data-aos-anchor-placement="top-bottom"
          onContextMenu={preventContextMenu}
        >
          <ThemedSwap light={light} dark={dark} alt={alt} />
        </ConstrainedSection>
      ))}

      {/* 하단 설명/로고 섹션 */}
      <HomeFive />

      {/* 제품 소개 섹션 */}
      <ProductsIntro />
    </Page>
  );
}
