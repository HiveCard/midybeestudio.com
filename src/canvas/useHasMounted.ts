import { useEffect, useState } from 'react'

/** True only after the component has mounted in the browser. Lets us skip
 *  rendering the WebGL canvas during the vite-react-ssg Node pre-render. */
export function useHasMounted(): boolean {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return mounted
}
