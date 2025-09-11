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

    // SvelteKitReviewWrapper.tsx (교체)
    useEffect(() => {
        let destroy: undefined | (() => void);

        import("svelteKitReviewApp/mount")
            .then(({ mount }) => {
                const el = containerRef.current;
                if (!el) return;
                destroy = mount(el, {
                    // 필요하면 props
                });
            })
            .catch((err) => {
                console.error("❌ Failed to mount svelteKitReviewApp via MF:", err);
            });

        return () => destroy?.();
    }, []);


    return <div ref={containerRef} />;
};

export default SvelteKitReviewAppWrapper;
