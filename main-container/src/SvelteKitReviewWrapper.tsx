import React, { useEffect, useRef } from "react";
import { getTheme, onThemeChange } from "@jobspoon/theme-bridge";

const SvelteKitReviewAppWrapper: React.FC = () => {
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

        import("svelteKitReviewApp/App") // ✅ MFE로 불러온 Svelte 앱
            .then((mod) => {
                const SvelteKitApp = mod.default;

                if (containerRef.current) {
                    app = new SvelteKitApp({
                        target: containerRef.current,
                    });
                }
            })
            .catch((err) => {
                console.error("❌ Failed to mount svelteKitReviewApp via Module Federation:", err);
            });

        return () => {
            if (app) app.$destroy();
        };
    }, []);

    return <div ref={containerRef} />;
};

export default SvelteKitReviewAppWrapper;
