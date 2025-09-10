// src/mf/boot.ts
import ReviewWidget from '$lib/ReviewWidget.svelte';

export function mount(el: HTMLElement, props?: Record<string, any>) {
    const app = new ReviewWidget({ target: el, props, hydrate: true });
    return () => app.$destroy();
}
