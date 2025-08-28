import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { themeAtom } from '@jobspoon/app-state';
import { setTheme, getTheme, onThemeChange } from '@jobspoon/theme-bridge';

export default function ThemeSync() {
    const [mode, setMode] = useRecoilState(themeAtom);

    // Recoil → Bridge
    useEffect(() => { setTheme(mode); }, [mode]);

    // 초기 Bridge(localStorage) → Recoil
    useEffect(() => { setMode(getTheme()); }, [setMode]);

    // 외부(Vue/Svelte/다른 탭) → Bridge → Recoil
    useEffect(() => onThemeChange(setMode), [setMode]);

    return null;
}
