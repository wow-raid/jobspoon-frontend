import React, { useState } from "react";
import styled from "styled-components";
import WithdrawalConfirmModal from "../components/modals/WithdrawalConfirmModal.tsx";
import ServiceModal from "../components/modals/ServiceModal.tsx";

export default function AccountWithdrawal() {
    const [reason, setReason] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const [showServiceModal, setShowServiceModal] = useState(false);

    const handleWithdrawalClick = () => {
        if (!reason.trim()) {
            alert("탈퇴 사유를 선택하거나 입력해주세요.");
            return;
        }
        setShowConfirm(true);
    };

    const handleConfirm = () => {
        setShowConfirm(false);
        setShowServiceModal(true);
    };

    return (
        <Section>
            <Title>회원탈퇴</Title>

            <WarningBox>
                <h3>탈퇴 전 꼭 확인하세요</h3>
                <p>
                    회원탈퇴 시 모든 데이터가 삭제되며, 복구가 불가능합니다. <br />
                    정말 떠나시겠습니까? 😢
                </p>
            </WarningBox>

            <p>탈퇴 사유를 선택해주세요.</p>

            <Form>
                <Option onClick={() => setReason("서비스가 기대에 미치지 못함")} active={reason === "서비스가 기대에 미치지 못함"}>
                    서비스가 기대에 미치지 못함
                </Option>
                <Option onClick={() => setReason("사용 빈도가 낮음")} active={reason === "사용 빈도가 낮음"}>
                    사용 빈도가 낮음
                </Option>
                <Option onClick={() => setReason("개인정보 보호 우려")} active={reason === "개인정보 보호 우려"}>
                    개인정보 보호 우려
                </Option>
                <OtherBox>
                    기타:
                    <input
                        type="text"
                        placeholder="직접 입력"
                        value={reason.startsWith("기타:") ? reason.replace("기타:", "") : ""}
                        onChange={(e) => setReason(`기타:${e.target.value}`)}
                    />
                </OtherBox>
            </Form>

            <ButtonGroup>
                <CancelButton onClick={() => history.back()}>취소</CancelButton>
                <DangerButton onClick={handleWithdrawalClick}>회원탈퇴</DangerButton>
            </ButtonGroup>

            {/* 모달 영역 */}
            {showConfirm && (
                <WithdrawalConfirmModal
                    onClose={() => setShowConfirm(false)}
                    onConfirm={handleConfirm}
                />
            )}
            {showServiceModal && (
                <ServiceModal
                    isOpen={showServiceModal}
                    onClose={() => setShowServiceModal(false)}
                />
            )}
        </Section>
    );
}

/* ================== styled ================== */

const Section = styled.section`
    padding: 24px;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: rgb(17, 24, 39);
`;

const WarningBox = styled.div`
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;

  h3 {
    margin: 0 0 8px 0;
    font-weight: 700;
    font-size: 16px;
  }
  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
  }
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OtherBox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;

  input {
    flex: 1;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 6px 8px;
  }
`;

const Option = styled.div<{ active: boolean }>`
    padding: 14px 18px;
    border: 2px solid ${({ active }) => (active ? "#dc2626" : "#e5e7eb")};
    border-radius: 10px;
    cursor: pointer;
    background: white;  /* ✅ 항상 흰색 유지 */
    font-size: 15px;
    font-weight: 500;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &:hover {
        background: #f9fafb;  /* ✅ hover만 살짝 회색 */
        box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
`;

const CancelButton = styled.button`
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`;

const DangerButton = styled.button`
  background: #dc2626;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(220,38,38,0.3);

  &:hover {
    background: #b91c1c;
  }
`;

