import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Router from 'next/router'

import { routeChangeStart } from '@innodoc/client-store/src/actions/content'

// Notify store about Next.js route changes
const RouteNotifier = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const handleRouteChange = () => dispatch(routeChangeStart())
    Router.events.on('routeChangeStart', handleRouteChange)
    return () => Router.events.off('routeChangeStart', handleRouteChange)
  }, [dispatch])
  return null
}

export default RouteNotifier
