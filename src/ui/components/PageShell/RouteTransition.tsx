import { Box, styled } from '@mui/material'
import {
  type ComponentType,
  type ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'

import {
  changeRouteInfo,
  changeRouteTransitionInfo,
  selectIsHydration,
  selectRouteTransitionInfo,
} from '#store/slices/appSlice'
import RouteTransitionContext from '#ui/contexts/RouteTransitionContext'
import { useDispatch, useSelector } from '#ui/hooks/store/store'

interface FadeBoxProps {
  anim: 'fadeIn' | 'fadeOut' | undefined
}

const FadeBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'anim',
})<FadeBoxProps>(({ anim, theme }) => ({
  '@keyframes fadeOut': {
    from: { opacity: 1 },
    to: { opacity: 0 },
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  animationName: anim,
  animationDuration: `${
    theme.transitions.duration[anim === 'fadeOut' ? 'leavingScreen' : 'enteringScreen']
  }ms`,
  animationTimingFunction: theme.transitions.easing.easeInOut,
  animationFillMode: 'forwards',
  overflowX: 'hidden',
}))

function RouteTransition({ children, pagePrev: PagePrev }: RouteTransitionProps) {
  const dispatch = useDispatch()
  const routeTransitionInfo = useSelector(selectRouteTransitionInfo)
  const isHydration = useSelector(selectIsHydration)
  const { addToken, pageReady, removeToken } = useContext(RouteTransitionContext)

  const rafRef = useRef<number>()
  const chanRef = useRef<MessageChannel>(new MessageChannel())
  const wrapperEl = useRef<HTMLDivElement>()

  const [anim, setAnim] = useState<FadeBoxProps['anim']>()

  // Fade-in only when browser rendered pixels
  // https://www.webperf.tips/tip/measuring-paint-time/
  const rafCallback = useCallback(() => {
    setAnim('fadeIn')
    dispatch(changeRouteTransitionInfo(null))
  }, [dispatch])
  useEffect(() => {
    const chan = chanRef.current

    if (
      pageReady &&
      !isHydration // Prevent animation on initial page load
    ) {
      rafRef.current = requestAnimationFrame(() => {
        chan.port1.addEventListener('message', rafCallback)
        chan.port1.start()
        chan.port2.postMessage(undefined)
      })
    }

    return () => {
      chan.port1.removeEventListener('message', rafCallback)
      if (rafRef.current !== undefined) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [dispatch, isHydration, pageReady, rafCallback])

  // Do actual route change when fadeOut anim ended
  const animationListener = useCallback(
    (event: AnimationEvent) => {
      if (event.animationName === 'fadeOut' && routeTransitionInfo !== null) {
        // Needed so that `pageReady` triggers above effect even if no other
        // tokens are used
        removeToken('route-anim')

        dispatch(changeRouteInfo(routeTransitionInfo))
        // TODO: prevent vite-plugin-ssr to scroll to top
        // TODO: scoll to URL hash if present
      }
    },
    [dispatch, removeToken, routeTransitionInfo]
  )
  useEffect(() => {
    let currentWrapperEl: HTMLDivElement
    if (wrapperEl.current) {
      currentWrapperEl = wrapperEl.current
      currentWrapperEl.addEventListener('animationend', animationListener)
    }
    return () => {
      currentWrapperEl.removeEventListener('animationend', animationListener)
    }
  }, [animationListener])

  // Start fade out anim on page navigation
  useEffect(() => {
    if (routeTransitionInfo !== null) {
      addToken('route-anim')
      setAnim('fadeOut')
    }
  }, [addToken, routeTransitionInfo])

  return (
    <>
      <FadeBox anim={anim} ref={wrapperEl}>
        {anim === 'fadeOut' && PagePrev ? <PagePrev /> : children}
      </FadeBox>
    </>
  )
}

interface RouteTransitionProps {
  children: ReactElement
  pagePrev?: ComponentType
}

export default RouteTransition
