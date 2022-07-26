import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { sectionVisited } from '@innodoc/store/actions/content'

const useTrackVisit = (sectionId) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (sectionId) {
      dispatch(sectionVisited(sectionId))
    }
  }, [dispatch, sectionId])
}

export default useTrackVisit
