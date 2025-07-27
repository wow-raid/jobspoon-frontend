import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";

import { CircularProgress } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const NuxtAppWrapper = lazy(() => import("./NuxtAppWrapper"));



const App = () => {

  return (
    <BrowserRouter>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/nuxt/*" element={<NuxtAppWrapper />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

const container = document.getElementById("app") as HTMLElement;
if (!container) {
  throw new Error("Root container #app not found");
}

const root = ReactDOM.createRoot(container);
root.render(<App />);