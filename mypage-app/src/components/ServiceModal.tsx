import React from "react";

interface ServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ServiceModal({ isOpen, onClose }: ServiceModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)] z-50">
            <div className="bg-white rounded-[12px] shadow-lg p-[24px] w-[320px] text-center">
                <h2 className="text-[18px] font-[600] mb-[12px]">서비스 준비 중</h2>
                <p className="text-[14px] text-gray-600 mb-[20px]">
                    해당 기능은 현재 준비 중입니다. <br /> 곧 만나보실 수 있어요 😊
                </p>
                <button
                    onClick={onClose}
                    className="px-[16px] py-[8px] bg-[rgb(59,130,246)] text-white rounded-[6px]
                     hover:bg-[rgb(37,99,235)] transition-colors duration-200"
                >
                    닫기
                </button>
            </div>
        </div>
    );
}