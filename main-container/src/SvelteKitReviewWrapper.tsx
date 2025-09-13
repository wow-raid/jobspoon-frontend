// SvelteKitReviewWrapper.tsx
import React, { useEffect, useRef } from "react";
import { getTheme, onThemeChange } from "@jobspoon/theme-bridge";

const SvelteKitReviewAppWrapper: React.FC = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    // 테마 동기화
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const apply = (t: "light" | "dark") => {
            el.setAttribute("data-theme", t);
            (el.style as any).colorScheme = t;
        };
        apply(getTheme());
        return onThemeChange(apply);
    }, []);

    useEffect(() => {
        if (!containerRef.current) return;
        let cleanup: (() => void) | undefined;

        (async () => {
            try {
                // 1) Svelte 5용 mount 우선
                const mod1 = await import("svelteKitReviewApp/mount").catch(() => null);
                if (mod1 && typeof (mod1 as any).mount === "function") {
                    const handle: any = (mod1 as any).mount(containerRef.current!, {
                        storageKey: "review-widget:v1",
                    });
                    cleanup =
                        typeof handle === "function"
                            ? handle
                            : handle?.destroy?.bind(handle);
                    return;
                }

                // 2) (옵션) Svelte 4 호환 외길 — 클래스 컴포넌트인 경우만 new
                const mod2 = await import("svelteKitReviewApp/App");
                const C: any = (mod2 as any).default;
                const inst = new C({
                    target: containerRef.current!,
                    props: { storageKey: "review-widget:v1" },
                });
                cleanup = inst.$destroy?.bind(inst) ?? inst.destroy?.bind(inst);
            } catch (err) {
                console.error("❌ Failed to mount svelteKitReviewApp via MF:", err);
            }
        })();

        return () => {
            try { cleanup?.(); } catch (e) { /* 안전하게 무시 */ }
        };
    }, []);

    return <div ref={containerRef} />;
};

export default SvelteKitReviewAppWrapper;
