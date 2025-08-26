import React from "react";
import SideBar from "./SideBar";
import ActivityLogSection from "./ActivityLogSection";

export default function MyPageLayout() {
    return (
        <div className="flex min-h-screen">
            {/* 좌측 메뉴바 */}
            <SideBar />

            {/* 메인 컨텐츠 */}
            <main className="flex-1 p-6 space-y-6 bg-gray-50">
                {/* 활동 로그 */}
                <ActivityLogSection />

                {/* 캘린더 + 일정 요약 (지금은 placeholder) */}
                <section className="grid grid-cols-3 gap-6">
                    <div className="col-span-2 border bg-white p-4 rounded text-gray-400 text-center">
                        [캘린더 자리]
                    </div>
                    <div className="border bg-white p-4 rounded text-gray-400">
                        [일정 요약]
                    </div>
                </section>
            </main>
        </div>
    );
}
