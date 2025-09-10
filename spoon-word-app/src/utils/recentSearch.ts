// 최대 10개, 최신순. 중복은 맨 앞으로 당기고 1회만 유지.
export const RECENT_KEY = "spoon:recent_searches";
const MAX_ITEMS = 10;

function safeGetStorage(): Storage | null {
    try {
        if (typeof window === "undefined") return null;
        return window.localStorage;
    } catch {
        return null;
    }
}

export function getRecent(): string[] {
    const ls = safeGetStorage();
    if (!ls) return [];
    try {
        const raw = ls.getItem(RECENT_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) return [];
        // 문자열만 통과
        return arr.filter((v) => typeof v === "string");
    } catch {
        return [];
    }
}

export function saveRecent(list: string[]) {
    const ls = safeGetStorage();
    if (!ls) return;
    try {
        ls.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
    } catch {
        /* ignore quota errors */
    }
}

export function addRecent(term: string): string[] {
    const t = term.trim();
    if (!t) return getRecent();

    const cur = getRecent();
    // 대소문자 무시 중복 제거(표시는 원문 유지)
    const lower = t.toLowerCase();
    const dedup = cur.filter((x) => x.toLowerCase() !== lower);

    const next = [t, ...dedup].slice(0, MAX_ITEMS);
    saveRecent(next);
    return next;
}

export function removeRecent(term: string): string[] {
    const lower = term.toLowerCase();
    const next = getRecent().filter((x) => x.toLowerCase() !== lower);
    saveRecent(next);
    return next;
}

export function clearRecent() {
    saveRecent([]);
}
