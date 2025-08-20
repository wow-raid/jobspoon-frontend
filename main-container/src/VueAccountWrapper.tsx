import React, { useEffect, useRef } from "react";
import { useLocation} from "react-router-dom";

const VueAccountAppWrapper = ({ eventBus }:{eventBus: any}) => {
    const vueModuleRef = useRef<HTMLDivElement>(null);
    const isMountedRef = useRef(false);
    const unmountRef = useRef<(() => void) | null>(null);

    const location = useLocation()

    useEffect(() => {
        const mountVueApp = async () =>{
            const { vueAccountAppMount, vueAccountAppUnmount } = await import("vueAccountApp/bootstrap");

            if (vueModuleRef.current && !isMountedRef.current) {
                vueAccountAppMount(vueModuleRef.current, eventBus);
                isMountedRef.current = true;

                unmountRef.current = () => {
                    vueAccountAppUnmount?.(vueModuleRef.current!);
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
    }, []);

    useEffect(() => {
        if (location.pathname === "/vue-account/login") {
            eventBus.emit("vue-account-routing-event", "/");
        }
    }, [location]);

    return (
        <div
            id="vue-account-wrapper"
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

export default VueAccountAppWrapper;