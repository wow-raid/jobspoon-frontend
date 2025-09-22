// NavigationBar.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import springAxiosInst from "./utility/AxiosInst.ts";
import { logoutRequest } from "./utility/AccountApi.ts";

// 로고 이미지
import logoBlack from "./assets/jobspoonLOGO_black.png";

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  height: 80px;
  background: #ffffff;
  color: #000000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const Inner = styled.div`
  height: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #000;
`;

// 1440px 기준: 93×53
// 93/1440 = 6.458333vw, 53/1440 = 3.680556vw
// clamp(min, fluid, max) → 작아질 땐 줄고, 커질 땐 93×53을 넘지 않음
const LogoImg = styled.img`
  width: clamp(60px, 6.458333vw, 93px);
  height: clamp(34px, 3.680556vw, 53px);
  object-fit: contain;
  display: block;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 28px;
`;

const NavLink = styled(Link) <{ $active?: boolean }>`
  text-decoration: none;
  color: #000;
  font-size: 15px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  padding: 6px 2px;
  border-bottom: ${({ $active }) => ($active ? "2px solid #000" : "2px solid transparent")};
  transition: opacity 0.15s ease;
  &:hover { opacity: 0.7; }
`;

const AuthButton = styled.button`
  appearance: none;
  border: 0;
  background: transparent;
  color: #000;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  padding: 6px 0;
  &:hover { opacity: 0.7; }
`;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("isLoggedIn");
    if (!token) {
      // 값이 없거나 비어있으면 false
      setIsLoggedIn(false);
    } else {
      // 값이 있으면 true
      setIsLoggedIn(true);
    }
  }, [location]);

  const handleLogout = async () => {
    try {
      const axiosResponse = await logoutRequest();
      if (axiosResponse.status === 200 && axiosResponse.data === "success") {
        setIsLoggedIn(false);
        localStorage.removeItem("userToken");
        navigate("/");
      } else {
        alert("로그아웃에 실패 하였습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("로그아웃중 문제 발생");
    }
  };

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <Header>
      <Inner>
        <Brand to="/" aria-label="JobSpoon 홈">
          <LogoImg src={logoBlack} alt="JobSpoon" />
        </Brand>

        <Nav>
          <NavLink to="/" $active={isActive("/")}>홈</NavLink>
          <NavLink to="/studies" $active={isActive("/studies")}>스터디모임</NavLink>
          <NavLink to="/vue-ai-interview/ai-interview/landing" $active={isActive("/vue-ai-interview")}>
            AI 인터뷰
          </NavLink>
          <NavLink to="/mypage" $active={isActive("/mypage")}>MyPage</NavLink>
          <NavLink to="/sveltekit-review/review" $active={isActive("/sveltekit-review")}>리뷰</NavLink>

          {!isLoggedIn ? (
            <NavLink to="/vue-account/account/login" $active={isActive("/vue-account")}>
              로그인
            </NavLink>
          ) : (
            <AuthButton onClick={handleLogout}>로그아웃</AuthButton>
          )}
        </Nav>
      </Inner>
    </Header>
  );
};

export default App;
