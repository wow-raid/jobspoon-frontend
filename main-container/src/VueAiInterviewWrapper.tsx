import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const VueAiInterviewAppWrapper = ({ eventBus }: { eventBus: any }) => {
    const vueModuleRef = useRef<HTMLDivElement>(null);
    const isMountedRef = useRef(false);
    const unmountRef = useRef<(() => void) | null>(null);

    const location = useLocation()

    useEffect(() => {
        const mountVueApp = async () => {
            const { vueAiInterviewAppMount, vueAiInterviewAppUnmount } = await import("vueAiInterviewApp/bootstrap");

            if (vueModuleRef.current && !isMountedRef.current) {
                vueAiInterviewAppMount(vueModuleRef.current, eventBus);
                isMountedRef.current = true;

                unmountRef.current = () => {
                    vueAiInterviewAppUnmount?.(vueModuleRef.current!);
                    isMountedRef.current = false;
                };
                const iframeDoc = document;
                iframeDoc.body.style.margin = "0";
                iframeDoc.body.style.padding = "0";
            }

        }
        mountVueApp();

        return () => {
            if (unmountRef.current) {
                unmountRef.current();
                unmountRef.current = null;
            }
            eventBus.off("routing-event");
        };
    }, [])



    useEffect(() => {
        console.log('handleNavigation()')
        if (location.pathname === "/vue-ai-interview/llm-test") {
            console.log('라우터 변경')
            eventBus.emit("vue-ai-interview-routing-event", "/")
        }
    }, [location]);

    return (
        <div
            id="vue-ai-interview-wrapper"
            ref={vueModuleRef}
            style={{
                width: "100vw",
                height: "100vh",
                margin: 0,
                padding: 0,
            }}
        />
    )
};

export default VueAiInterviewAppWrapper;