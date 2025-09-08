// NavigationBar.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

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
  gap: 10px;
  font-weight: 800;
  font-size: 20px;
  text-decoration: none;
  color: #000;

  &:hover {
    opacity: 0.8;
  }
`;

/* 실제 로고 이미지 넣을 자리
   <img src="/path/to/logo.svg" alt="JobSpoon" style={{height: 28}} />
*/

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

  &:hover {
    opacity: 0.7;
  }
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

  &:hover {
    opacity: 0.7;
  }
`;

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    navigate("/");
  };

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <Header>
      <Inner>
        <Brand to="/">
          {/* <img src="/logo.svg" alt="JobSpoon" style={{ height: 28 }} /> */}
          JobSpoon
        </Brand>

        <Nav>
          <NavLink to="/" $active={isActive("/")}>홈</NavLink>
          <NavLink to="/studies" $active={isActive("/studies")}>스터디모임</NavLink>
          <NavLink
            to="/vue-ai-interview/ai-interview/llm-test"
            $active={isActive("/vue-ai-interview")}
          >
            AI 인터뷰
          </NavLink>

          <NavLink
              to="/mypage"
              $active={isActive("/mypage")}
          >
            MyPage
          </NavLink>

          <NavLink
            to="/svelte-review/review"
            $active={isActive("/svelte-review")}
          >
            리뷰
          </NavLink>

          {/* ✅ 비로그인: 링크로 렌더 → active 밑줄 표시 / 로그인: 로그아웃 버튼 */}
          {!isLoggedIn ? (
            <NavLink
              to="/vue-account/account/login"
              $active={isActive("/vue-account")}
            >
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
