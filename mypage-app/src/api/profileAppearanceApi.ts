import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** 공통 타입 **/
export interface TitleItem {
    id: number;
    code: string;
    displayName: string;
    acquiredAt: string; // ISO datetime
}

/** 내 프로필 조회 응답 */
export interface ProfileAppearanceResponse {
    photoUrl: string | null;
    nickname: string;
    email: string;
    title?: TitleItem;
    trustScore?: TrustScore; // null 가능하니 optional
    userLevel?: UserLevel;   // null 가능하니 optional
}

/** 신뢰 점수 */
export interface TrustScore {
    totalScore: number;
    attendanceRate: number;
    monthlyInterviews: number;
    monthlyProblems: number;
    monthlyPosts: number;
    monthlyStudyrooms: number;
    monthlyComments: number;
    calculatedAt: string; // ISO datetime
}

/** 레벨 */
export interface UserLevel {
    level: number;
    exp: number;
    totalExp: number;
}

/** 경험치 추가 요청 */
export interface AddExpRequest {
    amount: number;
}

/** ---------------------- API 함수 ---------------------- **/

// 내 프로필 조회
export async function fetchMyProfile() { // token 매개변수 제거
    const res = await axios.get<ProfileAppearanceResponse>(
        `${API_BASE_URL}/profile-appearance/my`,
        { withCredentials: true } // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
    );
    return res.data;
}

// 프로필 사진 업로드 (Presigned URL 방식)
export async function uploadProfilePhoto(file: File) { // token 매개변수 제거
    // 1. Presigned URL 요청
    const res = await axios.post<string>(
        `${API_BASE_URL}/profile-appearance/profile/photo/upload-url`,
        null,
        {
            params: {
                filename: file.name,
                contentType: file.type,
            },
            withCredentials: true // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
        }
    );

    const presignedUrl = res.data;
    console.log("📌 발급된 Presigned URL:", presignedUrl);

    // 2. S3에 직접 업로드
    try {
        const uploadRes = await axios.put(presignedUrl, file, {
            headers: {
                "Content-Type": file.type || "application/octet-stream",
            },
            withCredentials: false, // CORS 쿠키 차단
        });
        console.log("✅ S3 업로드 성공:", uploadRes.status);
    } catch (err) {
        console.error("❌ S3 업로드 실패:", err);
        throw err;
    }

    // 3. 완료되면 URL 반환
    return presignedUrl;
}

// 보유 칭호 조회
export async function fetchMyTitles(): Promise<TitleItem[]> { // token 매개변수 제거
    const res = await axios.get<TitleItem[]>(
        `${API_BASE_URL}/profile-appearance/title/my`,
        { withCredentials: true } // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
    );
    return res.data;
}

// 칭호 장착
export async function equipTitle(titleId: number): Promise<TitleItem> { // token 매개변수 제거
    const res = await axios.put<TitleItem>(
        `${API_BASE_URL}/profile-appearance/title/${titleId}/equip`,
        {},
        { withCredentials: true } // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
    );
    return res.data;
}

// 신뢰 점수 조회
export async function fetchTrustScore() { // token 매개변수 제거
    const res = await axios.get<TrustScore>(
        `${API_BASE_URL}/profile-appearance/trust-score`,
        { withCredentials: true } // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
    );
    return res.data;
}

// 레벨 조회
export async function fetchUserLevel() { // token 매개변수 제거
    const res = await axios.get<UserLevel>(
        `${API_BASE_URL}/profile-appearance/user-level`,
        { withCredentials: true } // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
    );
    return res.data;
}

// 경험치 추가
export async function addExperience(amount: number) { // token 매개변수 제거
    const res = await axios.post<UserLevel>(
        `${API_BASE_URL}/profile-appearance/user-level/experience`,
        { amount },
        { withCredentials: true } // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
    );
    return res.data;
}

// 회원 탈퇴 (Account API, 경로 다름)
export async function withdrawAccount() { // token 매개변수 제거
    const res = await axios.post(
        `${API_BASE_URL}/api/account/withdraw`,
        {},
        { withCredentials: true } // Authorization 헤더 제거, 쿠키 자동 전송 옵션 추가
    );
    return res.data;
}