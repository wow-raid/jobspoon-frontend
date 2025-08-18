import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function hasToken() {
    try { return !!localStorage.getItem("userToken"); } catch { return false; }
}

export default function RequireToken({
    children,
    loginPath = "/vue-account/account/login",
}: {
    children: JSX.Element;
    loginPath?: string;
}) {
    const [allowed, setAllowed] = useState<boolean | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (hasToken()) {
            setAllowed(true);
            return;
        }
        // 알럿 후 로그인으로
        setAllowed(false);
        setTimeout(() => {
            alert("로그인 후 이용할 수 있습니다. 로그인 페이지로 이동합니다.");
            // 로그인 완료 후 돌아올 수 있게 from 전달(옵션)
            navigate(`${loginPath}`, {
                replace: true,
                state: { from: location.pathname + location.search },
            });
        }, 0);
    }, [location, navigate, loginPath]);

    if (allowed === null) return null; // 초기 체크 순간엔 렌더 안함(깜빡임 방지)
    if (allowed === false) return null; // 알럿 후 네비게이션 예정

    return children;
}
