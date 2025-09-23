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
export async function fetchMyProfile(token: string) {
    const res = await axios.get<ProfileAppearanceResponse>(
        `${API_BASE_URL}/profile-appearance/my`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 프로필 사진 업로드 (Presigned URL 방식)
export async function uploadProfilePhoto(token: string, file: File) {
    try {
        // 1. Presigned URL 요청
        const res = await axios.post<string>(
            `${API_BASE_URL}/profile-appearance/profile/photo/upload-url`,
            null,
            {
                params: {
                    filename: file.name,
                    contentType: file.type,
                },
                headers: { Authorization: token },
            }
        );

        const presignedUrl = res.data;
        console.log("Presigned URL 발급 성공:", presignedUrl);

        // 2. S3에 직접 업로드
        await axios.put(presignedUrl, file, {
            headers: { "Content-Type": file.type },
        });
        console.log("S3 업로드 성공");

        // 3. 완료되면 URL 반환
        return presignedUrl;
    } catch (err) {
        console.error("프로필 사진 업로드 실패:", err);
        throw err;
    }
}

// 보유 칭호 조회
export async function fetchMyTitles(token: string): Promise<TitleItem[]> {
    const res = await axios.get<TitleItem[]>(
        `${API_BASE_URL}/profile-appearance/title/my`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 칭호 장착
export async function equipTitle(token: string, titleId: number): Promise<TitleItem> {
    const res = await axios.put<TitleItem>(
        `${API_BASE_URL}/profile-appearance/title/${titleId}/equip`,
        {},
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 신뢰 점수 조회
export async function fetchTrustScore(token: string) {
    const res = await axios.get<TrustScore>(
        `${API_BASE_URL}/profile-appearance/trust-score`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 레벨 조회
export async function fetchUserLevel(token: string) {
    const res = await axios.get<UserLevel>(
        `${API_BASE_URL}/profile-appearance/user-level`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 경험치 추가
export async function addExperience(token: string, amount: number) {
    const res = await axios.post<UserLevel>(
        `${API_BASE_URL}/profile-appearance/user-level/experience`,
        { amount },
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 회원 탈퇴 (Account API, 경로 다름)
export async function withdrawAccount(token: string) {
    const res = await axios.post(
        `${API_BASE_URL}/api/account/withdraw`,
        {},
        { headers: { Authorization: token } }
    );
    return res.data;
}