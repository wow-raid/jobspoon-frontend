// src/mf/boot.ts
import ReviewWidget from '$lib/ReviewWidget.svelte';

export function mount(el: HTMLElement, props?: Record<string, any>) {
    const app = new ReviewWidget({ target: el, props, hydrate: true }); // SSR 페이지 위 하이드레이트도 가능
    return () => app.$destroy();
}
