import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { themeAtom } from './state/themeAtom';
import { setTheme, getTheme } from '@jobspoon/theme-bridge';

export default function ThemeSync() {
    const mode = useRecoilValue(themeAtom);

    // Recoil 값이 바뀔 때마다 브리지/DOM에 반영
    useEffect(() => {
        setTheme(mode);
    }, [mode]);

    // 최초 렌더 시 한 번 더 보정
    useEffect(() => {
        setTheme(getTheme());
    }, []);

    return null;
}
