import http, { authHeader } from "../utils/http";

export type RenameFolderResponse = {
    id: number;
    folderName: string;
    sortOrder: number;
    updatedAt?: string;
};

export async function renameUserFolder(folderId: string | number, folderName: string): Promise<RenameFolderResponse> {
    const { data } = await http.patch<RenameFolderResponse>(
        `/api/me/folders/${Number(folderId)}`,
        { folderName },
        { headers: { ...authHeader() } }
    );
    return data;
}

/** 단일 폴더 삭제 */
export async function deleteUserFolder(
    folderId: string | number,
    mode: "purge" | "detach" | "move" = "purge",
    targetFolderId?: string | number
): Promise<void> {
    const params: Record<string, any> = { mode };
    if (mode === "move" && targetFolderId != null) params.targetFolderId = targetFolderId;

    await http.delete(`/api/me/folders/${folderId}`, {
        headers: { ...authHeader() },
        params,
    })
}

/** 여러 폴더 일괄 삭제 */
export async function deleteUserFoldersBulk(
    folderIds: Array<string | number>,
    mode: "purge" | "detach" | "move" = "purge",
    targetFolderId?: string | number
): Promise<{ deletedCount: number }> {
    const body: Record<string, any> = {
        folderIds: folderIds.map(Number),
        mode,
    };
    if (mode === "move" && targetFolderId != null) body.targetFolderId = Number(targetFolderId);

    // axios는 DELETE + body 지원 (http.request 사용)
    const { data } = await http.request({
        method: "DELETE",
        url: "/api/me/folders:bulk",
        headers: { ...authHeader() },
        data: body,
    });

    return data ?? { deletedCount: 0 };
}
