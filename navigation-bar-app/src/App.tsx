import React, {useEffect, useState} from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import {Link, useNavigate, useLocation} from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import ForumIcon from "@mui/icons-material/Forum";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import Interview from '@mui/icons-material/InterpreterMode';
import ReviewIcon from '@mui/icons-material/RateReview';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("userToken");

        if (token) {
            setIsLoggedIn(true);
        }else{
            setIsLoggedIn(false);
        }
    }, [location]);

    const handleAuthClick = () => {
        if (isLoggedIn) {
            localStorage.removeItem("userToken");
            setIsLoggedIn(false);
            navigate("/");
        } else {
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

                <Button
                    color="inherit"
                    component={Link}
                    to="/studies"
                    startIcon={<ForumIcon />}
                    />

                <Button
                    color="inherit"
                    component={Link}
                    to="/"
                    startIcon={<HomeIcon />}
                />

                <Button
                    color="inherit"
                    component={Link}
                    to="/vue-ai-interview/ai-interview/llm-test"
                    startIcon={<Interview />}
                />

                <Button
                    color="inherit"
                    component={Link}
                    to="/svelte-review/review"
                    startIcon={<ReviewIcon />}
                />
              
               
                <Button
                    color="inherit"
                    onClick={handleAuthClick}
                    startIcon={isLoggedIn ? <LogoutIcon /> : <LoginIcon />}
                >
                </Button>
            </Toolbar>
        </AppBar>
    );
};

export default App