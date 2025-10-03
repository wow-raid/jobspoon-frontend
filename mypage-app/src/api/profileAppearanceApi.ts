import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

/** 내 프로필 조회 응답 */
export interface ProfileAppearanceResponse {
    photoUrl: string | null;
    nickname: string;
    email: string;
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
        `${API_BASE_URL}/profile-appearance/photo/upload-url`,
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

// 프로필 사진 다운로드 Presigned URL 발급
export async function getDownloadUrl() {
    const res = await axios.get<string>(
        `${API_BASE_URL}/profile-appearance/photo/download-url`,
        { withCredentials: true }
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