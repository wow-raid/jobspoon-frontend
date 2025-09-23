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
