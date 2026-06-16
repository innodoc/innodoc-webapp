// TODO: re-enable or remove RouteTransition

import type { ComponentType, ForwardedRef, PropsWithChildren, ReactElement } from 'react'
import { Fade } from '@mui/material'
import { useEffect, useReducer } from 'react'
import { assertNever } from '@innodoc/shared-core/typeguards'
import type { FrontendRouteInfo } from '@innodoc/shared-core/types'
import { changeRouteInfo, selectRouteTransitionInfo } from '@innodoc/shared-store/slices/app'
import { selectIsProcessing } from '@innodoc/shared-store/slices/hast'
import { useDispatch, useSelector } from '@innodoc/ui-shared/store-hooks'

const TransitionChild = function TransitionChild({ ref, children, ...props }: TransitionChildProps) {
  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  )
}

interface TransitionChildProps extends PropsWithChildren {
  ref?: ForwardedRef<HTMLDivElement> | undefined
}

/** Scroll to hash */
function scrollToHash() {
  let { hash } = globalThis.location
  hash = hash.slice(1)
  if (!hash) {
    return
  }

  const el: HTMLElement | null = document.querySelector(`#${hash}`)
  if (!el) {
    return
  }

  globalThis.queueMicrotask(() => {
    el.scrollIntoView()
  })
}

const DEFAULT_PAGE_PREV = () => null

type Phase = 'idle' | 'fadeOut' | 'waiting' | 'fadeIn'

interface State {
  phase: Phase
  routeInfo: FrontendRouteInfo | null
}

const NAVIGATE = Symbol('NAVIGATE')
const EXITED = Symbol('EXITED')
const PROCESSING_DONE = Symbol('PROCESSING_DONE')
const ENTERING = Symbol('ENTERING')

type Action =
  | { type: typeof NAVIGATE; routeInfo: FrontendRouteInfo }
  | { type: typeof EXITED }
  | { type: typeof PROCESSING_DONE }
  | { type: typeof ENTERING }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case NAVIGATE: {
      return { phase: 'fadeOut', routeInfo: action.routeInfo }
    }
    case EXITED: {
      // Only transition if we're fading out
      return state.phase === 'fadeOut' ? { ...state, phase: 'waiting' } : state
    }
    case PROCESSING_DONE: {
      // Only transition if we're waiting and have route info
      return state.phase === 'waiting' && state.routeInfo ? { ...state, phase: 'fadeIn' } : state
    }
    case ENTERING: {
      return { phase: 'idle', routeInfo: null }
    }
    default: {
      assertNever(action)
    }
  }
}

function RouteTransition({ children, pagePrev: PagePrev = DEFAULT_PAGE_PREV }: RouteTransitionProps) {
  const dispatch = useDispatch()
  const routeTransitionInfo = useSelector(selectRouteTransitionInfo)
  const isProcessing = useSelector(selectIsProcessing)

  const [state, dispatchLocal] = useReducer(reducer, { phase: 'idle', routeInfo: null })

  // Navigation initiated
  useEffect(() => {
    if (routeTransitionInfo !== null) {
      dispatchLocal({ type: NAVIGATE, routeInfo: routeTransitionInfo })
    }
  }, [routeTransitionInfo])

  // Processing completed
  useEffect(() => {
    if (!isProcessing && state.phase === 'waiting' && state.routeInfo) {
      dispatchLocal({ type: PROCESSING_DONE })
    }
  }, [isProcessing, state.phase, state.routeInfo])

  // Sync: dispatch route change when entering fadeIn phase
  useEffect(() => {
    if (state.phase === 'fadeIn' && state.routeInfo) {
      dispatch(changeRouteInfo(state.routeInfo))
    }
  }, [state.phase, state.routeInfo, dispatch])

  const fadeIn = state.phase === 'idle' || state.phase === 'fadeIn'
  const showPrev = state.phase === 'fadeOut' || state.phase === 'waiting'

  return (
    <Fade
      appear={false}
      in={fadeIn}
      onEntering={() => {
        dispatchLocal({ type: ENTERING })
        scrollToHash()
      }}
      onExited={() => {
        dispatchLocal({ type: EXITED })
      }}
    >
      <TransitionChild>{showPrev ? <PagePrev /> : children}</TransitionChild>
    </Fade>
  )
}

interface RouteTransitionProps {
  children: ReactElement
  pagePrev?: ComponentType
}

export default RouteTransition
