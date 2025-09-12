{/* 인터뷰 목록 보기 */}

import React from "react";
import { Link } from "react-router-dom";

const mockResults = [
    { id: 1, date: "2025-09-01", topic: "백엔드", grade: "A" },
    { id: 2, date: "2025-08-15", topic: "프론트엔드", grade: "B" },
];

export default function InterviewResultList() {
    return (
        <div>
            <h2>면접 기록 보관함</h2>
            <ul>
                {mockResults.map((item) => (
                    <li key={item.id}>
                        {item.date} | {item.topic} | {item.grade} |{" "}
                        <Link to={`/mypage/interview/history/${item.id}`}>상세보기</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
