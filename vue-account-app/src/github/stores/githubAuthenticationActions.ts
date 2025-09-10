import * as axiosUtility from "../../account/utility/axiosInstance";
// 공용 Axios 인스턴스 생성 유틸을 불러옴. (각 백엔드용 axios 인스턴스를 반환)

export const githubAuthenticationAction = {
    // Pinia actions 객체. GitHub 인증 및 세션 관련 동작 메서드들을 모음.

    // async requestAdminCodeToSpringBoot(adminCode: string): Promise<boolean> {
    //     // 관리자 코드 유효성 검증 요청. 유효하면 true, 아니면 false를 반환.
    //     console.log("requestAdminCodeToDjango") // 디버깅 로그.
    //
    //     const { djangoAxiosInstance, } = axiosUtility.createAxiosInstances()
    //     // Django 서버로 요청을 보낼 axios 인스턴스 획득.
    //
    //     try {
    //         const response = await djangoAxiosInstance.post('/github-oauth/request-admin-code-validation', {
    //             admin_code: adminCode  // 서버가 기대하는 필드명으로 관리자 코드 전송.
    //         });
    //         // POST /github-oauth/request-admin-code-validation
    //         // { admin_code: string } → { isValid: boolean } 형태의 응답을 가정.
    //
    //         console.log('response:', response) // 전체 응답 로깅.
    //         console.log('response,data:', response.data) // 응답 바디 로깅.
    //
    //         return response.data.isValid; // 서버 판단 결과를 반환.
    //     } catch (error) {
    //         console.error('관리자 코드 검증 실패:', error); // 예외 상황 로깅.
    //         return false; // 실패 시 안전하게 false 반환.
    //     }
    // },

    async requestGithubLoginToDjango(): Promise<void> {
        // GitHub 로그인 시작 URL을 Django에서 받아와, 해당 URL로 브라우저를 이동.
        console.log("requestGithubLoginToDjango") // 디버깅 로그.

        const { djangoAxiosInstance,springAxiosInstance } = axiosUtility.createAxiosInstances()
        // Django axios 인스턴스 획득.

        try {
            return springAxiosInstance.get('/github-authentication/request-login-url').then((res) => {
                console.log(`res: ${res}`) // 응답 객체 로깅.
                window.location.href = res.data.url // 서버가 제공한 GitHub OAuth 승인 URL로 리다이렉션.
            })
            // GET /github-oauth/request-login-url → { url: string }
            // 실제 브라우저 이동은 window.location.href로 수행.
        } catch (error) {
            console.log('requestGithubLoginToDjango() 중 에러:', error) // 예외 로깅.
        }
    },

    async requestAccessToken(code: string): Promise<string | null> {
        // GitHub 콜백에서 받은 code를 Django에 전달해 userToken(JWT 등)을 발급받음.
        const { djangoAxiosInstance,springAxiosInstance } = axiosUtility.createAxiosInstances();
        // Django axios 인스턴스 획득.

        try {
            const response = await springAxiosInstance.post('/github-authentication/login', code)
            // ⚠️ 현재 바디로 원시 문자열 code를 그대로 전송.
            // 서버가 { code: string } 형태를 기대한다면 { code }로 감싸야 함.

            return response.data.userToken // 서버에서 발급한 애플리케이션 사용자 토큰 반환.
        } catch (error) {
            console.log('Access Token 요청 중 문제 발생:', error) // 예외 로깅.
            throw error // 상위 호출부에서 에러 처리를 하도록 전파.
        }
    },
    //
    // async requestLogout(userToken: string): Promise<void> {
    //     // 서버에 로그아웃 요청(세션/리프레시 토큰 무효화 등).
    //     const { djangoAxiosInstance,springAxiosInstance } = axiosUtility.createAxiosInstances()
    //     // Django axios 인스턴스 획득.
    //
    //     try {
    //         await springAxiosInstance.post('/authentication/logout', { userToken })
    //         // POST /authentication/logout { userToken }
    //         // 서버 정책에 따라 Authorization 헤더 기반 로그아웃을 요구할 수도 있음.
    //     } catch (error) {
    //         console.log('requestLogout() 중 에러:', error) // 예외 로깅.
    //     }
    // },
    //
    // async requestValidationUserToken(userToken: string): Promise<boolean> {
    //     // 클라이언트 보유 userToken의 유효성 확인.
    //     const { djangoAxiosInstance } = axiosUtility.createAxiosInstances()
    //     // Django axios 인스턴스 획득.
    //
    //     try {
    //         const response = await djangoAxiosInstance.post('/authentication/validation', { userToken })
    //         // POST /authentication/validation { userToken } → { valid: boolean } 가정.
    //
    //         if (response.data && response.data.valid !== undefined) {
    //             return response.data.valid; // 유효성 결과 반환.
    //         } else {
    //             console.error('Invalid response structure:', response.data);
    //             // 응답 스키마가 예상과 다를 때 경고.
    //             return false; // 방어적 기본값.
    //         }
    //     } catch (error) {
    //         console.log('requestLogout() 중 에러:', error)
    //         // ⚠️ 로그 메시지 함수명 오타(Validation인데 Logout으로 표기됨).
    //         return false // 실패 시 false 반환.
    //     }
    // }
}

/*
==================================================
동작 구조

1) requestAdminCodeToDjango(adminCode)
   - 관리자 코드 문자열을 Django API에 보냄.
   - 서버가 검증 후 { isValid: true/false }로 응답.
   - true면 다음 단계(OAuth 로그인)로 진행, false면 중단/재입력 유도.

2) requestGithubLoginToDjango()
   - Django에 "GitHub 로그인 시작 URL"을 요청.
   - 서버가 GitHub 승인 URL을 내려주면, window.location.href로 즉시 이동.
   - 사용자는 GitHub에서 승인 후 redirect_uri로 되돌아옴(쿼리에 code 포함).

3) requestAccessToken(code)
   - redirect_uri 콜백 페이지에서 받은 code를 Django에 전달.
   - Django가 GitHub와 통신해 토큰을 교환한 뒤
     애플리케이션 전용 userToken(JWT 등)을 발급해 반환.
   - 호출부(스토어/컴포넌트)는 userToken을 localStorage 등에 저장하고 로그인 상태로 전환.

4) requestLogout(userToken)
   - 서버에 로그아웃(세션/리프레시 무효화)을 요청.
   - 성공 시 클라이언트는 로컬 저장소의 토큰을 삭제하고 인증 상태를 해제.

5) requestValidationUserToken(userToken)
   - 현재 보유한 userToken이 아직 유효한지 서버에 확인.
   - { valid: true/false }에 따라 로그인 유지/해제를 결정.
   - 앱 최초 로드 시나, 페이지 새로고침 후 재인증 판단에 사용.

최종흐름
   [관리자 코드 입력] → requestAdminCodeToDjango → OK →
   requestGithubLoginToDjango → (GitHub 승인) → redirect_uri?code=... →
   requestAccessToken(code) → userToken 저장/로그인 완료 →
   보호 라우트 접근 시 토큰 검증(requestValidationUserToken) →
   로그아웃 시 requestLogout

==================================================
*/
