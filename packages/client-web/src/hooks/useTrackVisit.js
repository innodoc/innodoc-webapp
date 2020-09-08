import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { sectionVisit } from '@innodoc/client-store/src/actions/content'

const useTrackVisit = (sectionId) => {
  const dispatch = useDispatch()
  useEffect(() => {
    console.log('useTrackVisit', sectionId)
    if (sectionId) {
      const action = sectionVisit(sectionId)
      dispatch(action)
      console.log('useTrackVisit dispatched action:')
      console.log(action)
    }
  }, [dispatch, sectionId])
}

export default useTrackVisit
