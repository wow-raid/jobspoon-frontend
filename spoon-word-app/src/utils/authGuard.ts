export const AUTH_ALERT_MSG = "로그인을 하신 후 이용해 주시기 바랍니다.";
export const DEFAULT_LOGIN_BASE = "/login";

let _authGuardBusy = false;

export type AuthGuardOptions = {
    isLoggedIn?: boolean;
    navigate?: (to: any, opts?: { replace?: boolean }) => void;
    getCurrentUrl?: () => string;
    tokenKeys?: string[];
    /** 'alert' | 'confirm' : confirm이면 [확인]=로그인 이동, [취소]=그대로 유지 */
    promptType?: "alert" | "confirm";
    useReplace?: boolean;
    loginBase?: string; // 기본값: /login
};

export function ensureAuthOrAlertRedirect(
    message: string = AUTH_ALERT_MSG,
    loginBase: string = DEFAULT_LOGIN_BASE,
    options?: AuthGuardOptions
): boolean {
    // 1) 로그인 여부 추론
    const tokenKeys = options?.tokenKeys ?? ["userToken","accessToken"];
    const inferred =
        options?.isLoggedIn ??
        tokenKeys.some(
            (k) =>
                !!(typeof window !== "undefined" && window.localStorage?.getItem(k)) ||
                !!(typeof window !== "undefined" && window.sessionStorage?.getItem(k))
        );
    if (inferred) return true;

    // 2) 중복 방지
    if (_authGuardBusy) return false;
    _authGuardBusy = true;

    try {
        const promptType = options?.promptType ?? "alert";
        let proceed = true;

        if (promptType === "confirm") {
            // 브라우저/OS 언어에 맞춰 버튼이 '확인/취소'로 표시됨
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
                    ? window.location.pathname + window.location.search + window.location.hash
                    : "/") || "/");

        const base = options?.loginBase ?? loginBase;
        const dest = `${base}?returnUrl=${encodeURIComponent(getCurrentUrl())}`;

        if (options?.navigate) options.navigate(dest, { replace: options?.useReplace });
        else if (typeof window !== "undefined") window.location.href = dest;
    } finally {
        setTimeout(() => {
            _authGuardBusy = false;
        }, 500);
    }

    // 비로그인 흐름에서는 항상 원동작 중단
    return false;
}
