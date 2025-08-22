import React, { useEffect, useRef } from "react";
import { getTheme, onThemeChange } from "@jobspoon/theme-bridge";

const SvelteReviewAppWrapper: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const apply = (t: "light" | "dark") => {
            el.setAttribute("data-theme", t);
            (el.style as any).colorScheme = t;
        };
        apply(getTheme());
        const off = onThemeChange(apply);
        return off;
    }, []);

    useEffect(() => {
        let app: any;

        import("svelteReviewApp/App") // ✅ MFE로 불러온 Svelte 앱
            .then((mod) => {
                const SvelteApp = mod.default;

                if (containerRef.current) {
                    app = new SvelteApp({
                        target: containerRef.current,
                    });
                }
            })
            .catch((err) => {
                console.error("❌ Failed to mount svelteReviewApp via Module Federation:", err);
            });

        return () => {
            if (app) app.$destroy();
        };
    }, []);

    return <div ref={containerRef} />;
};

export default SvelteReviewAppWrapper;
