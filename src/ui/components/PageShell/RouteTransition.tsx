import { Fade } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import type { ComponentType, ReactElement, ForwardedRef, ReactNode } from 'react'

import { changeRouteInfo, selectRouteTransitionInfo } from '#store/slices/appSlice'
import { selectIsProcessing } from '#store/slices/hastSlice'
import { useDispatch, useSelector } from '#ui/hooks/store/store'

const TransitionChild = forwardRef(function TransitionChild(
  { children, ...props }: TransitionChildProps,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
})

interface TransitionChildProps {
  children: ReactNode
}

function RouteTransition({ children, pagePrev: PagePrev = () => null }: RouteTransitionProps) {
  const dispatch = useDispatch()
  const routeTransitionInfo = useSelector(selectRouteTransitionInfo)
  const isProcessing = useSelector(selectIsProcessing)

  const [fadeIn, setFadeIn] = useState(true)
  const [isExited, setIsExited] = useState(false)

  // Fade-out on user navigation
  useEffect(() => {
    if (routeTransitionInfo !== null) {
      setFadeIn(false)
    }
  }, [PagePrev, dispatch, routeTransitionInfo])

  // Trigger fade-in and route change when fade-out and Markdown processing completed
  useEffect(() => {
    if (!isProcessing && !fadeIn && isExited && routeTransitionInfo !== null) {
      setFadeIn(true)
      dispatch(changeRouteInfo(routeTransitionInfo)) // Do actual route change
    }
  }, [children, dispatch, fadeIn, isExited, isProcessing, routeTransitionInfo])

  // Render old page on fade-out
  const content = fadeIn ? children : <PagePrev />

  return (
    <Fade
      appear={false}
      in={fadeIn}
      onEntered={() => setIsExited(false)}
      onExited={() => setIsExited(true)}
    >
      <TransitionChild>{content}</TransitionChild>
    </Fade>
  )
}

interface RouteTransitionProps {
  children: ReactElement
  pagePrev?: ComponentType
}

export default RouteTransition
