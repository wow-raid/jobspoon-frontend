import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

const Wrap = styled.footer`
  background: #161722;
  color: rgba(255, 255, 255, 0.9);
  padding: 48px 16px;

  /* 글자 선택 방지 전역 */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
`;

const Logo = styled.div`
  font-weight: 800;
  font-size: 20px;
  letter-spacing: 0.4px;
  margin-bottom: 12px;
  cursor: default; /* 텍스트 커서 금지 */
`;

const Nav = styled.nav`
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 12px;
`;

const NavLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;          /* ✅ 링크는 포인터 커서 */
  &:hover { opacity: 0.85; }
`;

const SocialRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
`;

const SocialBadge = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 0;
  background: #3b82f6;
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;          /* 아이콘 버튼은 포인터 유지 */
`;

const Line = styled.hr`
  border: 0;
  border-top: 1px solid #76AEFF;  /* ✅ 요청 색상 */
  margin: 28px 0;
`;

const Copy = styled.small`
  color: rgba(255, 255, 255, 0.72);
  cursor: default;          /* 텍스트 커서 금지 */
`;

export default function SiteFooter() {
    const navigate = useNavigate();
    const goHome: React.MouseEventHandler = (e) => {
        e.preventDefault();
        navigate("/");
    };

    return (
        <Wrap>
            <Container>
                <Logo>JOB Spoon</Logo>

                <Nav>
                    <NavLink to="/" onClick={goHome}>Home</NavLink>
                    <NavLink to="/" onClick={goHome}>About</NavLink>
                    <NavLink to="/" onClick={goHome}>Service</NavLink>
                    <NavLink to="/" onClick={goHome}>Contact Us</NavLink>
                </Nav>

                <SocialRow>
                    {["Dr", "Be", "Ig", "Tw"].map((k) => (
                        <SocialBadge key={k} onClick={goHome}>{k}</SocialBadge>
                    ))}
                </SocialRow>

                <Line />
                <Copy>Copyright 2025. JOB Spoon. All rights reserved.</Copy>
            </Container>
        </Wrap>
    );
}
