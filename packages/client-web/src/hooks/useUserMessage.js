import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { closeMessages } from '@innodoc/client-store/src/actions/ui'
import userMessageSelectors from '@innodoc/client-store/src/selectors/userMessage'

const useUserMessage = (types) => {
  const dispatch = useDispatch()
  const getLatest = useMemo(() => userMessageSelectors.makeGetLatest(types), [
    types,
  ])
  useEffect(() => {
    dispatch(closeMessages(types))
  }, [dispatch, types])
  return useSelector(getLatest)
}

export default useUserMessage
