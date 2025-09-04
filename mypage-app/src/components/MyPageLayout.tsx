import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import styled from "styled-components";

export default function MyPageLayout() {
    return (
        <LayoutContainer>
            {/* 좌측 메뉴바 */}
            <Aside>
                <SideBar />
            </Aside>

            {/* 메인 컨텐츠 */}
            <Main>
                <Outlet />
            </Main>
        </LayoutContainer>
    );
}

/* ================== styled-components ================== */

// 레이아웃 전체 컨테이너
const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
`;

// 좌측 메뉴바
const Aside = styled.aside`
  width: 300px;
  border-right: 1px solid rgb(229, 231, 235);
  flex-shrink: 0;

  @media (min-width: 640px) {
    width: 20rem; /* sm:w-80 */
  }
  @media (min-width: 768px) {
    width: 24rem; /* md:w-96 */
  }
  @media (min-width: 1024px) {
    width: 28rem; /* lg:w-[28rem] */
  }
`;

// 메인 컨텐츠
const Main = styled.main`
  flex: 1;
  padding: 1.5rem; /* p-6 */
  display: flex;
  flex-direction: column;
  gap: 1.5rem; /* space-y-6 */
`;



// import React from "react";
// import { Outlet } from "react-router-dom";
// import SideBar from "./SideBar";
// import '../assets/tailwind.css'
//
// export default function MyPageLayout() {
//     return (
//         <div className="flex min-h-screen w-full">
//             {/* 좌측 메뉴바 */}
//             <aside className="w-[300px] sm:w-80 md:w-96 lg:w-[28rem] border-r border-r-[rgb(229,231,235)] flex-shrink-0">
//                 <SideBar />
//             </aside>
//
//             {/* 메인 컨텐츠 */}
//             <main className="flex-1 p-6 space-y-6">
//                 <Outlet />
//             </main>
//         </div>
//     );
// }