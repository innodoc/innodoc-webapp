import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { sectionVisit } from '@innodoc/client-store/src/actions/content'

const useTrackVisit = (sectionId) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (sectionId) {
      dispatch(sectionVisit(sectionId))
    }
  })
}

export default useTrackVisit
