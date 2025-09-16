// components/Footer.tsx
import React from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import eddiLogo from "../assets/eddi1.png"; // ← 경로 확인

const Wrap = styled.footer`
  background: #161722;
  color: rgba(255, 255, 255, 0.9);
  padding: 48px 16px;
  user-select: none;
  -webkit-user-select: none;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  text-align: center;
`;

const BrandButton = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0 auto 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const LogoImg = styled.img`
  width: 100px;
  height: 100px;
  display: block;
  object-fit: contain;
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
  cursor: pointer;
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
  cursor: pointer;
`;

const Line = styled.hr`
  border: 0;
  border-top: 1px solid #76AEFF;  /* 기존 디자인 유지 */
  margin: 28px 0;
`;

const CompanyBlock = styled.div`
  color: #ffffff;
  paddingrgba(3, 3, 3, 1)px 12px 6px;
  border-radius: 6px;
  display: inline-block;
  text-align: center;
`;

const CompanyText = styled.p`
  margin: 0 0 4px;
  font-size: 12px;
  line-height: 1.45;
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
        {/* 로고(회사 아이덴티티: EDDI) */}
        <BrandButton onClick={goHome} aria-label="홈으로">
          <LogoImg src={eddiLogo} alt="EDDI" />
        </BrandButton>

        {/* 네비게이션 링크(현재 디자인 유지) */}
        <Nav>
          <NavLink to="/" onClick={goHome}>Home</NavLink>
          <NavLink to="/" onClick={goHome}>About</NavLink>
          <NavLink to="/" onClick={goHome}>Service</NavLink>
          <NavLink to="/" onClick={goHome}>Contact Us</NavLink>
        </Nav>

        {/* 소셜 아이콘 (더미) */}
        <SocialRow>
          {["Dr", "Be", "Ig", "Tw"].map((k) => (
            <SocialBadge key={k} onClick={goHome}>{k}</SocialBadge>
          ))}
        </SocialRow>

        <Line />

        {/* 기존 푸터(주소/저작권) 문구 이식 */}
        <CompanyBlock>
          <CompanyText>서울특별시 송파구 새말로8길 26, 3층(문정동)</CompanyText>
          <CompanyText>Copyright © 2025 에디(EDDI). All rights reserved.</CompanyText>
        </CompanyBlock>
      </Container>
    </Wrap>
  );
}
