import React from "react";
import { Routes, Route } from "react-router-dom";
import MyPageLayout from "./components/layout/MyPageLayout.tsx";
import DashboardSection from "./components/dashboard/DashboardSection.tsx";
import ProfileAppearanceCardEdit from "./components/profile/ProfileAppearanceCardEdit.tsx";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<MyPageLayout />}>
                {/* 기본: 대시보드 (우측 영역) */}
                <Route index element={<DashboardSection />} />
                {/* 프로필 외형 수정 (우측 영역만 바뀜) */}
                <Route path="profile/edit" element={<ProfileAppearanceCardEdit />} />
            </Route>
        </Routes>
    )
}