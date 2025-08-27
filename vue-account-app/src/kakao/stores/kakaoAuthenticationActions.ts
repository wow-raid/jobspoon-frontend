import * as axiosUtility from "../../account/utility/axiosInstance";
import env from "navigation-bar-app/src/env.ts";

export const kakaoAuthenticationAction = {
    async requestKakaoLoginToDjango(router: any): Promise<void> {
        const { djangoAxiosInstance,springAxiosInstance} = axiosUtility.createAxiosInstances();
        try {
            const res = await springAxiosInstance.get("/kakao-authentication/kakao/link");
            console.log("res.data:", res.data);
            const loginType = "KAKAO";

            if (!res.data) {
                throw new Error("응답에 URL이 없습니다.");
            }

            // 팝업으로 열기
            const popup = window.open(res.data, '_blank', 'width=500,height=600');
            if (!popup) {
                alert('팝업 차단되어 있습니다. 팝업 허용 후 다시 시도하세요.');
                return;
            }

            // 팝업 메시지 받기
            const receiveMessage = (event: MessageEvent) => {
                console.log('📨 받은 메시지:', event.origin, event.data);

                // if (!event.origin.startsWith(env.origin)) {
                //     console.warn('❌ 허용되지 않은 origin:', event.origin);
                //     return;
                // }

                sessionStorage.setItem("tempLoginType", loginType);
                const { accessToken, isNewUser, user } = event.data;


                if (!accessToken) {
                    console.warn('❌ accessToken 없음');
                    return;
                }

                localStorage.setItem('userToken', accessToken);
                window.dispatchEvent(new Event("user-token-changed"));

                window.removeEventListener('message', receiveMessage);

             

                try {
                    popup.close();
                } catch (e) {
                    console.warn('팝업 닫기 실패:', e);
                }
            };

            window.addEventListener('message', receiveMessage);




        } catch (error) {
            console.log("requestKakaoOauthRedirectionToDjango() 중 에러:", error);
            throw error;
        }
    },


    async requestKakaoWithdrawToDjango(): Promise<void> {
        const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
        const userToken = localStorage.getItem("userToken");
        try {
            const res = await djangoAxiosInstance.post(
                `/kakao-oauth/request-withdraw-url`,
                {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            console.log("카카오 탈퇴 응답:", res.data);

            if (res.data && res.data.url && res.data.url.id) {
                alert("카카오 계정 탈퇴가 완료되었습니다.");
                window.location.href = "/"; // 탈퇴 후 홈으로 이동
            } else {
                console.error("❌ 탈퇴 실패 - 잘못된 응답:", res.data);
            }
        } catch (error) {
            console.error("🚨 카카오 탈퇴 요청 중 오류 발생:", error);
        }
    },

    async requestAccessToken(payload: { code: string }): Promise<string | null> {
        const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
        const res = await djangoAxiosInstance.post(
            "/kakao-oauth/kakao-access-token",  // ← 하이픈/경로 주의
            payload                                // ← { code }
        );
        return res.data.userToken;
    },
    async requestLogout(userToken: string): Promise<void> {
        const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();

        try {
            await djangoAxiosInstance.post("/authentication/logout", { userToken });
        } catch (error) {
            console.log("requestLogout() 중 에러:", error);
        }
    },
    async requestValidationUserToken(userToken: string): Promise<boolean> {
        const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();

        try {
            const response = await djangoAxiosInstance.post(
                "/authentication/validation",
                { userToken }
            );

            if (response.data && response.data.valid !== undefined) {
                return response.data.valid;
            } else {
                console.error("Invalid response structure:", response.data);
                return false;
            }
        } catch (error) {
            console.log("requestLogout() 중 에러:", error);
            return false;
        }
    },
};
