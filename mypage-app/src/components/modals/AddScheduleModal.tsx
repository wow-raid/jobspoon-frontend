import styled from "styled-components";
import { useEffect, useState } from "react";
import { UserScheduleRequest } from "../../api/userScheduleApi.ts";

type Props = {
    onClose: () => void;
    onSubmit: (data: UserScheduleRequest) => Promise<void>;
    initialData?: any; // 수정용 데이터
};

export default function AddScheduleModal({ onClose, onSubmit, initialData }: Props) {
    const isEditMode = !!initialData; // 수정 모드 여부

    const [form, setForm] = useState({
        title: "",
        description: "",
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        location: "",
        allDay: false,
        color: "#3b82f6",
    });

    /** 초기값 설정 */
    useEffect(() => {
        if (isEditMode) {
            const start = new Date(initialData.startTime);
            const end = new Date(initialData.endTime);
            const formatDate = (d: Date) => d.toISOString().split("T")[0];
            const formatTime = (d: Date) => d.toTimeString().slice(0, 5);

            setForm({
                title: initialData.title || "",
                description: initialData.description || "",
                startDate: formatDate(start),
                startTime: initialData.allDay ? "" : formatTime(start),
                endDate: formatDate(end),
                endTime: initialData.allDay ? "" : formatTime(end),
                location: initialData.location || "",
                allDay: initialData.allDay || false,
                color: initialData.color || "#3b82f6",
            });
        } else {
            // 기존 "신규 등록" 기본값 로직 그대로 유지
            const now = new Date();
            const roundedStart = new Date(now);
            roundedStart.setMinutes(now.getMinutes() < 30 ? 30 : 0);
            if (now.getMinutes() >= 30) roundedStart.setHours(now.getHours() + 1);
            const roundedEnd = new Date(roundedStart);
            roundedEnd.setHours(roundedStart.getHours() + 1);
            const formatDate = (d: Date) => d.toISOString().split("T")[0];
            const formatTime = (d: Date) => d.toTimeString().slice(0, 5);

            setForm((prev) => ({
                ...prev,
                startDate: formatDate(roundedStart),
                startTime: formatTime(roundedStart),
                endDate: formatDate(roundedEnd),
                endTime: formatTime(roundedEnd),
            }));
        }
    }, [initialData]);

    /** ESC 키로 닫기 */
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [onClose]);

    /** 입력 핸들러 */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target;

        // ✅ 하루종일 토글 시 기존 날짜 유지 + react-big-calendar 인식 가능한 형태로 보정
        if (target instanceof HTMLInputElement && target.type === "checkbox" && target.name === "allDay") {
            const checked = target.checked;

            const now = new Date();
            const roundedStart = new Date(now);
            roundedStart.setMinutes(now.getMinutes() < 30 ? 30 : 0);
            if (now.getMinutes() >= 30) roundedStart.setHours(now.getHours() + 1);

            const roundedEnd = new Date(roundedStart);
            roundedEnd.setHours(roundedStart.getHours() + 1);
            const formatTime = (d: Date) => d.toTimeString().slice(0, 5);

            setForm((prev) => {
                const startDate = prev.startDate || new Date().toISOString().split("T")[0];
                const endDate = prev.endDate || startDate;

                if (!checked) {
                    // ✅ 하루종일 해제 시 → 현재 시각 기준 시간 자동 채우기
                    return {
                        ...prev,
                        allDay: false,
                        startDate,
                        endDate,
                        startTime: formatTime(roundedStart),
                        endTime: formatTime(roundedEnd),
                    };
                }

                // ✅ 하루종일 켜질 때 → 시간 비움
                return {
                    ...prev,
                    allDay: true,
                    startDate,
                    endDate,
                    startTime: "",
                    endTime: "",
                };
            });
            return;
        }

        // ✅ 일반 input / textarea 입력 처리
        if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
            const { name, value } = target;

            setForm((prev) => {
                const updated = { ...prev, [name]: value };

                /** ✅ 시작 날짜 변경 시 → 종료 날짜/시간 자동 보정 */
                if (name === "startDate" && value) {
                    const startDate = new Date(value);
                    const endDate = new Date(prev.endDate);

                    if (!prev.endDate || startDate > endDate) {
                        updated.endDate = value; // 종료일이 시작일보다 과거면 동기화
                    }

                    // 종료 시간이 비어있거나 시작보다 빠르면 +1시간 보정
                    if (prev.startTime && (!prev.endTime || prev.startTime >= prev.endTime)) {
                        const [h, m] = prev.startTime.split(":").map(Number);
                        const endTime = new Date();
                        endTime.setHours(h + 1, m);
                        updated.endTime = endTime.toTimeString().slice(0, 5);
                    }
                }

                /** ✅ 시작 시간 변경 시 → 종료 시간 +1시간 보정 */
                if (name === "startTime" && value) {
                    const [h, m] = value.split(":").map(Number);
                    const endTime = new Date();
                    endTime.setHours(h + 1, m);

                    // ✅ 기존 종료일을 기준으로 계산 (덮어쓰지 않음)
                    const currentEndDate = new Date(prev.endDate || prev.startDate);
                    const newEndDate = new Date(currentEndDate);

                    // ✅ 자정을 넘는 경우만 다음날로 이동
                    if (endTime.getHours() < h) {
                        newEndDate.setDate(newEndDate.getDate() + 1);
                    }

                    updated.startTime = value;
                    updated.endTime = endTime.toTimeString().slice(0, 5);
                    updated.endDate = newEndDate.toISOString().split("T")[0];
                }

                /** ✅ 종료 날짜 변경 시 → 시작 날짜/시간 자동 보정 */
                if (name === "endDate" && value) {
                    const startDate = new Date(prev.startDate);
                    const endDate = new Date(value);

                    if (!prev.startDate || endDate < startDate) {
                        updated.startDate = value; // 종료일이 더 앞이면 시작일 맞춰줌
                    }

                    // 시작 시간이 종료보다 느리면 -1시간 보정
                    if (prev.endTime && (!prev.startTime || prev.startTime >= prev.endTime)) {
                        const [h, m] = prev.endTime.split(":").map(Number);
                        const startTime = new Date();
                        startTime.setHours(h - 1, m);
                        updated.startTime = startTime.toTimeString().slice(0, 5);
                    }
                }

                /** ✅ 종료 시간 변경 시 → 시작 시간 -1시간 보정 */
                if (name === "endTime" && value) {
                    const [endH, endM] = value.split(":").map(Number);
                    const startTime = new Date();
                    startTime.setHours(endH - 1, endM);

                    // ✅ 기존 시작일을 기준으로 계산 (덮어쓰지 않음)
                    const currentStartDate = new Date(prev.startDate || prev.endDate);
                    const newStartDate = new Date(currentStartDate);

                    // ✅ 자정을 지나 전날로 이동하는 경우만 하루 빼기
                    if (startTime.getHours() > endH) {
                        newStartDate.setDate(newStartDate.getDate() - 1);
                    }

                    updated.endTime = value;
                    updated.startTime = startTime.toTimeString().slice(0, 5);
                    updated.startDate = newStartDate.toISOString().split("T")[0];
                }

                return updated;
            });
        }
    };

    /** 제출 핸들러 */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title) {
            alert("제목을 입력해주세요.");
            return;
        }

        const startTime = form.allDay
            ? `${form.startDate}T00:00:00` // ✅ null → 명시적 00:00
            : `${form.startDate}T${form.startTime || "00:00"}:00`;

        const endTime = form.allDay
            ? `${form.endDate}T23:59:59` // ✅ null → 명시적 23:59:59
            : `${form.endDate}T${form.endTime || "23:59"}:00`;

        const data: UserScheduleRequest = {
            ...form,
            startTime,
            endTime,
        };

        await onSubmit(data);

        if (initialData) {
            alert("일정이 수정되었습니다!");
        } else {
            alert("일정이 추가되었습니다!");
        }
    };


    return (
        <Backdrop onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <Header>
                    <h3>{isEditMode ? "일정 수정" : "일정 추가"}</h3>
                    <CloseBtn onClick={onClose}>×</CloseBtn>
                </Header>

                <Form onSubmit={handleSubmit}>
                    <label>
                        제목
                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            placeholder="일정 제목을 입력하세요"
                        />
                    </label>

                    <label>
                        설명
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="일정 설명을 입력하세요 (선택)"
                        />
                    </label>

                    {/* 시작/종료 날짜 + 시간 입력 */}
                    <TimeGroup>
                        <TimeRow>
                            <label>
                                시작 날짜
                                <input
                                    type="date"
                                    name="startDate"
                                    value={form.startDate}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                시작 시간
                                <input
                                    type="time"
                                    name="startTime"
                                    value={form.startTime}
                                    onChange={handleChange}
                                    required
                                    disabled={form.allDay}
                                />
                            </label>
                        </TimeRow>

                        <TimeRow>
                            <label>
                                종료 날짜
                                <input
                                    type="date"
                                    name="endDate"
                                    value={form.endDate}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                            <label>
                                종료 시간
                                <input
                                    type="time"
                                    name="endTime"
                                    value={form.endTime}
                                    onChange={handleChange}
                                    required
                                    disabled={form.allDay}
                                />
                            </label>
                        </TimeRow>

                        {/* 시간 바로 아래 종일 일정 배치 */}
                        <AllDayRow>
                            <label style={{ cursor: "pointer" }}>
                                하루 종일
                                {/* 실제 체크박스는 숨김 */}
                                <input
                                    type="checkbox"
                                    name="allDay"
                                    checked={form.allDay}
                                    onChange={handleChange}
                                    style={{ display: "none" }}
                                    id="allDayToggle"
                                />
                                {/* 시각적 토글 버튼 */}
                                <ToggleSwitch
                                    checked={form.allDay}
                                    onClick={() => {
                                        const input = document.getElementById("allDayToggle") as HTMLInputElement;
                                        if (input) input.click(); // ✅ 실제 input 클릭 이벤트 트리거
                                    }}
                                >
                                    <span>{form.allDay ? "종일" : "시간 지정"}</span>
                                </ToggleSwitch>
                            </label>
                        </AllDayRow>
                    </TimeGroup>

                    <label>
                        장소
                        <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="예: 강남 카페, 스터디룸 등"
                        />
                    </label>

                    <ColorSelectRow>
                        <span>색상</span>
                        <ColorPalette>
                            {["#A5D8FF", "#B2F2BB", "#FFD6A5", "#D0BFFF", "#FFADAD", "#FDFFB6", "#C8E7FF", "#E8C2FF"].map((c) => (
                                <ColorCircle
                                    key={c}
                                    color={c}
                                    selected={form.color === c}
                                    onClick={() => setForm((prev) => ({ ...prev, color: c }))}
                                />
                            ))}
                        </ColorPalette>
                    </ColorSelectRow>

                    <SubmitBtn type="submit">
                        {isEditMode ? "수정하기" : "등록하기"}
                    </SubmitBtn>
                </Form>
            </Modal>
        </Backdrop>
    );
}

/* ================== styled-components ================== */
const Backdrop = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    justify-content: center;
    align-items: center; /* 중앙 정렬로 변경 */
    overflow-y: auto;
    z-index: 999;
`;

const Modal = styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    width: 420px;
    max-width: 90vw; /* 작은 화면 대응 */
    max-height: 90vh; /* 스크롤 생기게 */
    overflow-y: auto;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    animation: fadeIn 0.25s ease;

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;

  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }
`;

const CloseBtn = styled.button`
  border: none;
  background: none;
  font-size: 22px;
  color: #6b7280;
  cursor: pointer;
`;

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 14px;

    label {
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #374151;
        gap: 4px;
    }

    input,
    textarea {
        border: 1px solid #d1d5db;
        border-radius: 6px;
        padding: 8px 10px;
        font-size: 14px;
        outline: none;
        width: 100%; /* input이 삐죽 안나오게 */
        box-sizing: border-box;
        &:focus {
            border-color: #3b82f6;
        }
    }
`;

const TimeGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const TimeRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;

  label {
    flex: 1;
    display: flex;
    flex-direction: column;
    font-size: 14px;
    gap: 4px;
  }

  input {
    padding: 6px 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    &:focus {
      border-color: #3b82f6;
    }
  }
`;

const AllDayRow = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 4px;

    label {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #374151;
        white-space: nowrap;
        cursor: pointer;
    }
`;

const ToggleSwitch = styled.button.attrs({ type: "button" })<{ checked: boolean }>`
    width: 70px;
    height: 28px;
    border-radius: 20px;
    background: ${({ checked }) => (checked ? "#60a5fa" : "#d1d5db")};
    border: none;
    cursor: pointer;
    position: relative;
    transition: background 0.25s ease;

    span {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        font-weight: 600;
        color: white;
        letter-spacing: -0.2px;
    }

    &:hover {
        background: ${({ checked }) => (checked ? "#3b82f6" : "#cbd5e1")};
    }
`;

const SubmitBtn = styled.button`
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 0;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  margin-top: 8px;
  transition: background 0.2s;
  &:hover {
    background: #2563eb;
  }
`;

const ColorSelectRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
  font-size: 14px;
  color: #374151;
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 8px;
`;

const ColorCircle = styled.button.attrs({ type: "button" })<{ color: string; selected: boolean }>`
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: ${({ selected }) => (selected ? "2px solid #334155" : "1px solid #d1d5db")};
    background-color: ${({ color }) => color};
    cursor: pointer;
    transition: transform 0.15s ease, border 0.15s ease;

    &:hover {
        transform: scale(1.15);
        border-color: #3b82f6;
    }
`;