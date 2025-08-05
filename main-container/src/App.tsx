import React, { lazy, Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import { CircularProgress } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import LayOut from "./components/layout/LayOut";

import mitt from "mitt";

import VueAccountAppWrapper from "./VueAccountWrapper.tsx";
import VueAiInterviewAppWrapper from "./VueAiInterview.tsx";

const eventBus = mitt();

const StudyRoomApp = lazy(() => import("studyRoomApp/App"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          <Route path="/" element={<LayOut />}>
            <Route index element={<div>Home Page</div>} />
            <Route
              path="/vue-account/*"
              element={<VueAccountAppWrapper eventBus={eventBus} />}
            />
            <Route
              path="/studies/*"
              element={<StudyRoomApp />}
            />
            <Route
              path="/vue-ai-interview/*"
              element={<VueAiInterviewAppWrapper eventBus={eventBus} />}
            />
          </Route>
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
