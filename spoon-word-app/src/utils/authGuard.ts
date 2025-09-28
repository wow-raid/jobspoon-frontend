// src/utils/authGuard.ts
export const AUTH_ALERT_MSG = "로그인을 하신 후 이용해 주시기 바랍니다.";
export const DEFAULT_LOGIN_BASE = "/login";

let _authGuardBusy = false;

export type AuthGuardOptions = {
    /** 현재 로그인 여부를 상위에서 이미 판단했다면 직접 넘길 수 있음 */
    isLoggedIn?: boolean;
    /** React Router navigate 함수 주입 */
    navigate?: (to: any, opts?: { replace?: boolean }) => void;
    /** 현재 URL 제공자. 기본은 window.location.* 합성 */
    getCurrentUrl?: () => string;
    /** 레거시 용: 로컬/세션 스토리지에서 토큰 키를 찾아 로그인 추론 */
    tokenKeys?: string[];
    /**
     * 새 정책: 로컬스토리지에 존재 여부만 확인하는 플래그 키
     * 기본값: "isLoggedIn"
     */
    flagKey?: string;
    /** 'alert' | 'confirm' : confirm이면 [확인]=로그인 이동, [취소]=그대로 유지 */
    promptType?: "alert" | "confirm";
    /** navigate 시 replace 사용 여부 */
    useReplace?: boolean;
    /** 로그인 베이스 경로. 기본 /login */
    loginBase?: string;
};

/**
 * 로그인 여부를 보장하거나, 아니라면 안내 후 로그인 페이지로 리다이렉트한다.
 * 반환값: true = 로그인 상태이므로 원동작 진행, false = 비로그인 처리로 원동작 중단
 */
export function ensureAuthOrAlertRedirect(
    message: string = AUTH_ALERT_MSG,
    loginBase: string = DEFAULT_LOGIN_BASE,
    options?: AuthGuardOptions
): boolean {
    // 1) 로그인 여부 추론
    // 1-1. 상위에서 명시 전달이 있으면 최우선
    if (typeof options?.isLoggedIn === "boolean") {
        if (options.isLoggedIn) return true;
    } else {
        // 1-2. 새 정책: flagKey 존재 여부로 판단 (기본 "isLoggedIn")
        const flagKey = options?.flagKey ?? "isLoggedIn";
        const hasFlag =
            typeof window !== "undefined" &&
            !!window.localStorage?.getItem(flagKey);

        if (hasFlag) return true;

        // 1-3. 레거시 백업 경로: tokenKeys 중 하나라도 존재하면 로그인으로 간주
        const legacyKeys = options?.tokenKeys; // 기본값 없음(명시 전달시에만 사용)
        if (legacyKeys?.length) {
            const legacyHit =
                typeof window !== "undefined" &&
                legacyKeys.some(
                    (k) =>
                        !!window.localStorage?.getItem(k) ||
                        !!window.sessionStorage?.getItem(k)
                );
            if (legacyHit) return true;
        }
    }

    // 2) 중복 방지
    if (_authGuardBusy) return false;
    _authGuardBusy = true;

    try {
        const promptType = options?.promptType ?? "alert";
        let proceed = true;

        if (promptType === "confirm") {
            proceed = confirm(message); // 확인:true / 취소:false
        } else {
            alert(message);
            proceed = true;
        }

        // 취소: 아무 것도 하지 않고 원동작 중단(현재 페이지 유지)
        if (!proceed) return false;

        // 확인: 로그인 페이지로 이동 (returnUrl 현재 위치 보존)
        const getCurrentUrl =
            options?.getCurrentUrl ??
            (() =>
                (typeof window !== "undefined"
                    ? window.location.pathname +
                    window.location.search +
                    window.location.hash
                    : "/") || "/");

        const base = options?.loginBase ?? loginBase;
        const dest = `${base}?returnUrl=${encodeURIComponent(getCurrentUrl())}`;

        if (options?.navigate) {
            options.navigate(dest, { replace: options?.useReplace });
        } else if (typeof window !== "undefined") {
            window.location.href = dest;
        }
    } finally {
        setTimeout(() => {
            _authGuardBusy = false;
        }, 500);
    }

    // 비로그인 흐름에서는 항상 원동작 중단
    return false;
}
