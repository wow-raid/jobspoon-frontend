{/* 인터뷰 상세 보기 */}

import React from "react";
import { useParams, Link } from "react-router-dom";

export default function InterviewResultDetail() {
    const { id } = useParams();

    // 추후 Django API로 id 기반 조회
    return (
        <div>
            <h2>면접 결과 상세 보기</h2>
            <p>면접 결과 ID: {id}</p>
            <p>여기에 Q/A, HexagonChart, 피드백 표시 예정</p>
            <Link to="/interview/history">← 목록으로 돌아가기</Link>
        </div>
    );
}
