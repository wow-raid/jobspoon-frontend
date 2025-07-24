import React, { useRef, useEffect } from 'react'

// TypeScript용 선언이 필요하면 src/global.d.ts 에 아래 내용 추가:
// declare module 'nuxtApp/bootstrap' {
//   export function mount(el: Element): void
//   export function unmount(): void
// }

const VueNuxtAppWrapper: React.FC = () => {
  const hostRef = useRef<HTMLDivElement>(null)
  const unmountRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!hostRef.current) return

    // remoteEntry.js 가 이미 index.html 로드 시 주입됐으므로,
    // 이제 바로 dynamic import 가능
    import('nuxtApp/bootstrap').then(({ mount, unmount }) => {
      mount(hostRef.current!)
      unmountRef.current = unmount
    })

    return () => {
      unmountRef.current?.()
    }
  }, [])

  return <div ref={hostRef} style={{ width: '100%', height: '100%' }} />
}

export default VueNuxtAppWrapper