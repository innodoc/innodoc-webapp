import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { sectionVisit } from '@innodoc/store/actions/content'

const useTrackVisit = (sectionId) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (sectionId) {
      dispatch(sectionVisit(sectionId))
    }
  }, [dispatch, sectionId])
}

export default useTrackVisit
