import { Fade } from '@mui/material'
import { forwardRef, useEffect, useState } from 'react'
import type { ComponentType, ForwardedRef, ReactElement, ReactNode } from 'react'

import { changeRouteInfo, selectRouteTransitionInfo } from '@innodoc/store/slices/app'
import { selectIsProcessing } from '@innodoc/store/slices/hast'

import { useDispatch, useSelector } from '#hooks/redux'

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

/** Scroll to hash */
function scrollToHash() {
  let { hash } = window.location
  hash = hash.substring(1)
  if (!hash) {
    return
  }

  const el: HTMLElement | null = document.getElementById(hash)
  if (!el) {
    return
  }

  // If we call scrollIntoView() in here without a setTimeout it won't
  // scroll properly.
  window.setTimeout(() => {
    el.scrollIntoView()
  }, 0)
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

  const onEntering = () => {
    setIsExited(false)
    scrollToHash()
  }

  // Render old page on fade-out
  const content = fadeIn ? children : <PagePrev />

  return (
    <Fade
      appear={false}
      in={fadeIn}
      onEntering={onEntering}
      onExited={() => {
        setIsExited(true)
      }}
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
