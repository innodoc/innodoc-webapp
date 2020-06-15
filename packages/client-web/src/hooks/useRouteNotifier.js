import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Router from 'next/router'

import { routeChangeStart } from '@innodoc/client-store/src/actions/content'

const useRouteNotifier = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const handleRouteChange = () => dispatch(routeChangeStart())
    Router.events.on('routeChangeStart', handleRouteChange)
    return () => Router.events.off('routeChangeStart', handleRouteChange)
  }, [dispatch])
}

export default useRouteNotifier
