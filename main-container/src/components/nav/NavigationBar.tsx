// src/components/nav/NavigationBar.tsx
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate, useLocation } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import ForumIcon from "@mui/icons-material/Forum";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import CasinoOutlined from '@mui/icons-material/CasinoOutlined'
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setIsLoggedIn(!!token);
  }, [location]);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("userToken");
      setIsLoggedIn(false);
      navigate("/");
    } else {
      // Vue 앱의 로그인 페이지로 이동
      navigate("/vue-account/account/login");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "inherit",
            fontWeight: 'bold',
          }}
        >
          EDDI
        </Typography>
        <Button color="inherit" component={Link} to="/" startIcon={<HomeIcon />}>
          홈
        </Button>
        <Button color="inherit" component={Link} to="/vue-board/list" startIcon={<ForumIcon />}>
          V게시판
        </Button>
        <Button color="inherit" component={Link} to="/game-chip/list" startIcon={<CasinoOutlined />}>
          게임칩
        </Button>
        <Button color="inherit" component={Link} to="/cart/list" startIcon={<ShoppingCartCheckoutIcon />}>
          카트
        </Button>
        <Button color="inherit" onClick={handleAuthClick} startIcon={isLoggedIn ? <LogoutIcon /> : <LoginIcon />}>
          {isLoggedIn ? "로그아웃" : "로그인"}
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
