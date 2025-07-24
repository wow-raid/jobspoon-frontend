import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";

import { CircularProgress } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import VueNuxtAppWrapper from './VueNuxtAppWrapper'


const App = () => {

    return (
        <BrowserRouter>
            <Suspense fallback={<CircularProgress />}>
                <Routes>
                    <Route path="/" element={<div>Home Page</div>} />
                    <Route path="/nuxt" element={<VueNuxtAppWrapper />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
};

export default App;