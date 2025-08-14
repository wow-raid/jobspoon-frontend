import React, { lazy, Suspense, useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import { CircularProgress, CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import mitt from "mitt";

import VueAccountAppWrapper from "./VueAccountWrapper.tsx";
import VueAiInterviewAppWrapper from "./VueAiInterview.tsx";

const eventBus = mitt();

const NavigationBarApp = lazy(() => import("navigationBarApp/App"));
const StudyRoomApp = lazy(() => import("studyRoomApp/App"));



const App = () => {
  const [isNavigationBarLoaded, setIsNavigationBarLoaded] = useState(false);

  useEffect(() => {
    import("navigationBarApp/App")
      .then(() => setIsNavigationBarLoaded(true))
      .catch((err) => console.error("Failed to load navigation bar:", err));
  }, []);

  return (
    <BrowserRouter>
      <CssBaseline />
      <Suspense fallback={<CircularProgress />}>
        <NavigationBarApp />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
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
