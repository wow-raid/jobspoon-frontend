// src/router/guards/adminGuards.ts
import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { getAdminUserToken, getTempAdminToken } from "@/security/admin/adminFlow";
import { loadAdminSession, saveAdminSession, refreshAdminSession, clearAdminSession } from "@/security/admin";
import { verifyAdminOnServer } from "@/account/utility/axiosInstance";

// 1) 공개 라우트 name (router.ts의 name과 일치해야 함)
const PUBLIC_NAMES = new Set<string>([
    "VueAccountLogin",
    "AdminAuthCode",
    "AdminAuthSocialLogin",
]);

// 2) 공개 라우트 path prefix (name이 없는 콜백 라우트 대응)
const PUBLIC_PATH_PREFIXES = [
    "/kakao_oauth/",
    "/google-oauth/",
    "/github-oauth/",
    "/guest-oauth/",
    "/naver-oauth/",
];

// 공개 라우트 판별
function isPublicRoute(to: RouteLocationNormalized): boolean {
    const byName = to.name && PUBLIC_NAMES.has(String(to.name));
    const byPathPrefix = PUBLIC_PATH_PREFIXES.some((p) => String(to.path).startsWith(p));
    const inAdminAuthSection = to.matched.some((r) => r.meta?.section === "ADMIN_AUTH");
    return Boolean(byName || byPathPrefix || inAdminAuthSection);
}

// 관리자 보호 라우트 판별(부모 메타까지 매칭)
function isAdminRoute(to: RouteLocationNormalized): boolean {
    return to.matched.some((r) => r.meta?.requiresAdmin === true);
}

// 소셜로그인 화면 진입시 임시 토큰 필수 라우트
function isTempRequiredRoute(to: RouteLocationNormalized): boolean {
    return to.matched.some((r) => r.meta?.requiresTempAdmin === true);
}

export async function adminBeforeEach(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: NavigationGuardNext
) {
    // 0) 공개 라우트면 통과
    if (isPublicRoute(to)) return next();

    // A) socialLogin 라우트 보호: requiresTempAdmin
    if (isTempRequiredRoute(to)) {
        const temp = getTempAdminToken();
        if (!temp) {
            window.alert("관리자 코드 입력이 필요합니다."); // ✅ 안내
            return next({ name: "AdminAuthCode", query: { reason: "code_required" } });
        }
        return next();
    }

    // B) 관리자 앱 보호: requiresAdmin (부모 메타 포함)
    if (isAdminRoute(to)) {
        const userToken = getAdminUserToken();

        // 1) 최종 토큰 없음 → 플로우 위반
        if (!userToken) {
            const temp = getTempAdminToken();
            if (temp) {
                window.alert("관리자 소셜 로그인이 필요합니다."); // ✅ 안내
                return next({
                    name: "AdminAuthSocialLogin",
                    query: { reason: "admin_social_login_required" },
                });
            }
            window.alert("잘못된 접근입니다. 관리자 페이지 권한이 없습니다."); // ✅ 안내
            return next({ name: "VueAccountLogin", query: { reason: "forbidden_admin_page" } });
        }

        // 2) 세션 캐시 유효 → 통과(+선택 갱신)
        const cached = loadAdminSession();
        if (cached) {
            refreshAdminSession(); // 슬라이딩 TTL
            return next();
        }

        // 3) 서버 검증 → 성공 시 캐시 저장 후 통과
        try {
            const ok = await verifyAdminOnServer(userToken);
            if (ok) {
                saveAdminSession();
                return next();
            }
        } catch {
            // 네트워크/서버 예외는 실패로 처리
        }

        // 4) 실패 → 세션 정리 후 로그인으로 회송
        clearAdminSession();
        window.alert("잘못된 토큰이거나 권한이 없습니다. 다시 로그인해주세요."); // ✅ 안내
        return next({ name: "VueAccountLogin", query: { reason: "admin_verify_failed" } });
    }

    // 보호 조건이 없으면 통과
    return next();
}
