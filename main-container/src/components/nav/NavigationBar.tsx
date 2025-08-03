import React, { lazy, Suspense  } from "react";

const NavigationBarApp = lazy(() => import("navigationBarApp/App"));


const NavigationBar = () => {

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <NavigationBarApp />
        </Suspense>
    );
};

export default NavigationBar;
