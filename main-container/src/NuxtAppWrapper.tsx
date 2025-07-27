// main-container/src/NuxtAppWrapper.tsx
import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

declare module "nuxtApp/bootstrap" {
  export function mountNuxtApp(el: string | Element): Promise<void>;
  export function unmountNuxtApp(): void;
}

const NuxtAppWrapper: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  const location = useLocation();

  useEffect(() => {
    if (!isMounted.current && containerRef.current) {
      import("nuxtApp/bootstrap")
        .then(({ mountNuxtApp }) => mountNuxtApp(containerRef.current!))
        .then(() => {
          isMounted.current = true;
          console.log("Nuxt app mounted");
        });
    }
    return () => {
      if (isMounted.current) {
        import("nuxtApp/bootstrap").then(({ unmountNuxtApp }) => {
          unmountNuxtApp();
          isMounted.current = false;
          console.log("Nuxt app unmounted");
        });
      }
    };
  }, []);

  // (옵션) React 라우팅 연동이 필요하면 location 바뀔 때 다시 push
  useEffect(() => {
    if (isMounted.current && containerRef.current) {
      // 예: window.history.pushState({}, '', location.pathname)
    }
  }, [location]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default NuxtAppWrapper;
