import http, { authHeader } from "../utils/http";

type FolderDTO = { id: number | string; folderName?: string; name?: string; sortOrder?: number };

export async function fetchUserFolders(): Promise<Array<{ id: string; name: string }>> {
    const res = await http.get("/api/user-terms/folders", {
        headers: { ...authHeader() }, // 반드시 토큰 전송
    });
    const data = res?.data;

    // 배열 or {items:[]} or {data:[]} 방어코드
    const items: FolderDTO[] =
        Array.isArray(data) ? data
            : Array.isArray((data as any)?.items) ? (data as any).items
                : Array.isArray((data as any)?.data) ? (data as any).data
                    : [];

    if (!Array.isArray(items)) {
        console.warn("[fetchUserFolders] Unexpected response shape:", data);
        return [];
    }

    return items.map((it) => ({
        id: String(it.id),
        name: it.folderName ?? it.name ?? "",
    }));
}

export async function patchReorderFolders(orderedIds: Array<string | number>) {
    // 서버가 숫자 id만 받는다면 여기서 숫자로 캐스팅해 전송
    const ids = orderedIds.map((v) => Number(v)).filter((n) => Number.isFinite(n));
    await http.patch(
        "/api/user-terms/folders/reorder",
        { ids },
        { headers: { ...authHeader() } }
    );
}
