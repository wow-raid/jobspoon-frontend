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

/** 프로필 사진 응답 */
export interface PhotoResponse {
    photoUrl: string;
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

// 프로필 사진 교체
export async function updateProfilePhoto(token: string, photoUrl: string) {
    const res = await axios.put<PhotoResponse>(
        `${API_BASE_URL}/profile-appearance/photo`,
        { photoUrl },
        { headers: { Authorization: token } }
    );
    return res.data;
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