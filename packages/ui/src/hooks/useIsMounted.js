import { useEffect, useRef } from 'react'

// Use to skip rendering on server
// https://github.com/vercel/next.js/issues/2473#issuecomment-580324241
const useIsMounted = () => {
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  return isMounted
}

export default useIsMounted
