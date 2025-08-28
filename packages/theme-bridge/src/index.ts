export type Theme = 'light' | 'dark';

let current: Theme = (typeof window !== 'undefined' && (localStorage.getItem('theme') as Theme)) || 'light';
const listeners = new Set<(t: Theme) => void>();

export const getTheme = () => current;

export function setTheme(t: Theme) {
    if (t === current) return;
    current = t;
    if (typeof window !== 'undefined') {
        localStorage.setItem('theme', t);
        document.documentElement.setAttribute('data-theme', t);
        (document.documentElement.style as any).colorScheme = t;
    }
    listeners.forEach(fn => fn(t));
}

export function onThemeChange(fn: (t: Theme) => void): () => void {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
}

/** ★ 선택: CSS 변수 스코프 주입기 */
export type ThemeVars = Record<Theme, Record<string, string>>;
export function attachThemeVars(target: Document | ShadowRoot | HTMLElement, vars: ThemeVars): () => void {
    const host =
        target instanceof Document ? target.documentElement :
            target instanceof ShadowRoot ? (target.host as HTMLElement) :
                target;

    const apply = (t: Theme) => {
        const table = vars[t]; for (const [k, v] of Object.entries(table)) host.style.setProperty(k, v);
        host.setAttribute('data-theme', t);
        (host.style as any).colorScheme = t;
    };
    apply(getTheme());
    return onThemeChange(apply);
}
