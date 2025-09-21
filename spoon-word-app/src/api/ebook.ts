import axiosInstance from "../api/axiosInstance";

export type PdfMeta = {
    ebookId: string | null;
    ebookFilename: string | null;
    ebookCount: number | null;
    ebookSkipped: number | null;
    cdFilename: string | null; // Content-Disposition에서 파싱한 파일명
    mismatch: boolean;         // 파일명 검증 결과
};

export async function generatePdfByTermIds(params: { termIds: (number|string)[]; title?: string }) {
    const res = await axiosInstance.post("/api/pdf/generate", params, {
        responseType: "blob",           // 중요: PDF 바이너리 수신
        // 필요 시: validateStatus: () => true,
    });

    // 에러일 때도 헤더 확인 가능
    if (res.status < 200 || res.status >= 300) {
        const errCode = res.headers["ebook-error"] ?? "UNKNOWN_ERROR";
        throw new Error(String(errCode));
    }

    const ebookId = res.headers["ebook-id"] ?? null;
    const ebookFilename = res.headers["ebook-filename"] ?? null;
    const ebookCount = res.headers["ebook-count"] ? Number(res.headers["ebook-count"]) : null;
    const ebookSkipped = res.headers["ebook-skipped"] ? Number(res.headers["ebook-skipped"]) : null;

    const cd = res.headers["content-disposition"] ?? "";
    const match = /filename\*=UTF-8''([^;]+)|filename="?([^";]+)"?/i.exec(cd);
    const cdFilename = decodeURIComponent(match?.[1] || match?.[2] || "");

    const mismatch = !!(ebookFilename && cdFilename && ebookFilename !== cdFilename);

    return {
        blob: res.data as Blob,
        meta: { ebookId, ebookFilename, ebookCount, ebookSkipped, cdFilename, mismatch } as PdfMeta,
    };
}
