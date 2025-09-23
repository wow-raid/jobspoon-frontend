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
  &:hover {
    opacity: 0.85;
  }
`;

// 이메일 링크는 a 태그 스타일로 별도 정의
const EmailLink = styled.a`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    opacity: 0.85;
  }
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
  border-top: 1px solid #76aeff; /* 기존 디자인 유지 */
  margin: 28px 0;
`;

const CompanyBlock = styled.div`
  color: #ffffff;
  padding: 6px 12px;
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

  const handleSocialClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    alert("죄송합니다. 아직 개발중입니다.");
  };

  return (
    <Wrap>
      <Container>
        {/* 로고(회사 아이덴티티: EDDI) */}
        <BrandButton onClick={goHome} aria-label="홈으로">
          <LogoImg src={eddiLogo} alt="EDDI" />
        </BrandButton>

        {/* 네비게이션 링크 */}
        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/sveltekit-review">About</NavLink>
          <NavLink to="/vue-ai-interview">Service</NavLink>
          <EmailLink href="mailto:puppy1012@naver.com">Contact Us</EmailLink>
        </Nav>

        {/* 소셜 아이콘 (알럿 처리) */}
        <SocialRow>
          {["Dr", "Be", "Ig", "Tw"].map((k) => (
            <SocialBadge
              key={k}
              onClick={handleSocialClick}
              aria-label={`${k} (준비 중)`}
              title="준비 중"
            >
              {k}
            </SocialBadge>
          ))}
        </SocialRow>

        <Line />

        {/* 주소/저작권 */}
        <CompanyBlock>
          <CompanyText>서울특별시 송파구 새말로8길 26, 3층(문정동)</CompanyText>
          <CompanyText>Copyright © 2025 에디(EDDI). All rights reserved.</CompanyText>
        </CompanyBlock>
      </Container>
    </Wrap>
  );
}
