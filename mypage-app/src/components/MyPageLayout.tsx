import React from "react";
import SideBar from "./SideBar";
import DashboardSection from "./DashboardSection.tsx";

export default function MyPageLayout() {
    return (
        <div className="flex flex-row min-h-screen w-full">
            {/* 좌측 메뉴바 */}
            <aside className="w-64 bg-white border-r shadow-sm">
                <SideBar />
            </aside>

            {/* 메인 컨텐츠 */}
            <main className="flex-1 p-6 space-y-6 bg-gray-50">
                {/* 활동 로그 */}
                <DashboardSection />

                {/* 캘린더 + 일정 요약 */}
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
