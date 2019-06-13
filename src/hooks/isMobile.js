import useMedia from 'use-media'

import css from '../style/media.sass'

const screenMd = parseInt(css['screen-md'], 10)
const useIsMobile = () => useMedia({ maxWidth: screenMd })

export default useIsMobile
