import http, { authHeader } from "../utils/http";

export async function deleteFavoriteTerm(favoriteTermId: number | string) {
    return http.delete(`api/me/favorite-terms/${favoriteTermId}`, {
        headers: { ...authHeader() },
    })
}