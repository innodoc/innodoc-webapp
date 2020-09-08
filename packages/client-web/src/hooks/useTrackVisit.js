import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { sectionVisit } from '@innodoc/client-store/src/actions/content'

const useTrackVisit = (sectionId) => {
  const dispatch = useDispatch()
  useEffect(() => {
    console.log('useTrackVisit', sectionId)
    if (sectionId) {
      dispatch(sectionVisit(sectionId))
      console.log('useTrackVisit dispatched sectionVisit')
    }
  })
}

export default useTrackVisit
