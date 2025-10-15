import styled from "styled-components";
import { useEffect, useState } from "react";
import { UserScheduleRequest } from "../../api/userScheduleApi.ts";

type Props = {
    onClose: () => void;
    onSubmit: (data: UserScheduleRequest) => Promise<void>;
};

export default function AddScheduleModal({ onClose, onSubmit }: Props) {
    const [form, setForm] = useState<UserScheduleRequest>({
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        location: "",
        allDay: false,
        color: "#3b82f6",
    });

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

        if (target instanceof HTMLInputElement) {
            const { name, value, type, checked } = target;
            setForm((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        } else {
            // textarea인 경우
            const { name, value } = target;
            setForm((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    /** 제출 핸들러 */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title || !form.startTime || !form.endTime) {
            alert("제목과 시작/종료 시간을 입력해주세요.");
            return;
        }

        // 서버에서 ISO 포맷 요구 시 :00 추가
        const formattedData: UserScheduleRequest = {
            ...form,
            startTime: form.startTime.endsWith(":00") ? form.startTime : form.startTime + ":00",
            endTime: form.endTime.endsWith(":00") ? form.endTime : form.endTime + ":00",
        };

        await onSubmit(formattedData);
        alert("일정이 등록되었습니다!");
    };

    return (
        <Backdrop onClick={onClose}>
            <Modal onClick={(e) => e.stopPropagation()}>
                <Header>
                    <h3>일정 추가</h3>
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

                    <TimeRow>
                        <label>
                            시작
                            <input
                                type="datetime-local"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                                required
                                disabled={form.allDay} // 종일 일정이면 비활성화
                            />
                        </label>
                        <label>
                            종료
                            <input
                                type="datetime-local"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                                required
                                disabled={form.allDay}
                            />
                        </label>
                    </TimeRow>

                    <label>
                        장소
                        <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="예: 강남 카페, 스터디룸 등"
                        />
                    </label>

                    <OptionRow>
                        <label>
                            <input
                                type="checkbox"
                                name="allDay"
                                checked={form.allDay}
                                onChange={handleChange}
                            />
                            종일 일정
                        </label>

                        <label>
                            색상
                            <input
                                type="color"
                                name="color"
                                value={form.color}
                                onChange={handleChange}
                            />
                        </label>
                    </OptionRow>

                    <SubmitBtn type="submit">등록하기</SubmitBtn>
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
    align-items: flex-start; /* ✅ 위쪽 여유 확보 */
    padding-top: 5vh;
    overflow-y: auto;
    z-index: 999;
`;

const Modal = styled.div`
    background: #fff;
    border-radius: 12px;
    padding: 24px;
    width: 420px;
    max-width: 90vw; /* ✅ 작은 화면 대응 */
    max-height: 90vh; /* ✅ 스크롤 생기게 */
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
        width: 100%; /* ✅ input이 삐죽 안나오게 */
        box-sizing: border-box;
        &:focus {
            border-color: #3b82f6;
        }
    }
`;

const TimeRow = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 12px;

    label {
        flex: 1;
        min-width: 0; /* ✅ overflow 방지 */
    }
`;

const OptionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
