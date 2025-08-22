export type Theme = 'light' | 'dark';

let current: Theme = (localStorage.getItem('theme') as Theme) || 'light';
const listeners = new Set<(t: Theme) => void>();

export const getTheme = () => current;

export function setTheme(t: Theme) {
  if (t === current) return;
  current = t;
  localStorage.setItem('theme', t);
  document.documentElement.setAttribute('data-theme', t);
  (document.documentElement.style as any).colorScheme = t;
  listeners.forEach(fn => fn(t));
}

export function onThemeChange(fn: (t: Theme) => void): () => void {
    listeners.add(fn);
    return () => {
        listeners.delete(fn); // ← 반환값을 버려서 void
    };
}
