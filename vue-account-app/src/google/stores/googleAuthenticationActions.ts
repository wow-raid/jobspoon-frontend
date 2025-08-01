import * as axiosUtility from "../../account/utility/axiosInstance";

export const googleAuthenticationAction = {
    async requestGoogleLoginToDjango(): Promise<void> {
        const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
        try {
            const res = await djangoAxiosInstance.get("/google-oauth/request-login-url");
            console.log("res.data:", res.data);

            if (!res.data?.url) {
                throw new Error("응답에 URL이 없습니다.");
            }

            window.location.href = res.data.url;
        } catch (error) {
            console.log("requestGoogleOauthRedirectionToDjango() 중 에러:", error);
            throw error;
        }
    },

    async requestGoogleWithdrawToDjango(this: any): Promise<void> {
        const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
        const userToken = localStorage.getItem("userToken");
        try {
            const res = await djangoAxiosInstance.post(
                `/google-oauth/request-withdraw-url`,
                {},
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            console.log("구글 탈퇴 응답:", res.data);

            if (res.data && res.data.message === "구글 연결 해제 성공") {
                alert("구글 계정 탈퇴가 완료되었습니다.");
                this.userToken = '';
                this.isAuthenticated = false;
                localStorage.removeItem('userToken');
                window.location.href = "/";
            } else {
                console.error("❌ 탈퇴 실패 - 잘못된 응답:", res.data);
            }
        } catch (error) {
            console.error("🚨 구글 탈퇴 요청 중 오류 발생:", error);
            throw error;
        }
    },

    async requestAccessToken({ code }: { code: string }): Promise<{ accessToken: string; email: string; userId: string }> {
        const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();
        try {
            const response = await djangoAxiosInstance.post(
                "/google-oauth/redirect-access-token",
                { code }
            );
            return {
                accessToken: response.data.accessToken,
                email: response.data.email,
                userId: response.data.userId
            };
        } catch (error) {
            console.log("Access Token 요청 중 문제 발생:", error);
            throw error;
        }
    },

    async requestLogout(this: any, userToken: string): Promise<void> {
        const { djangoAxiosInstance } = axiosUtility.createAxiosInstances();

        try {
            await djangoAxiosInstance.post("/authentication/logout", { userToken });
            this.userToken = '';
            this.isAuthenticated = false;
            localStorage.removeItem("userToken");
        } catch (error) {
            console.log("requestLogout() 중 에러:", error);
            throw error;
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
            console.log("requestValidationUserToken() 중 에러:", error);
            return false;
        }
    }
};
