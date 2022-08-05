import { Typography } from '@mui/material'

import { selectCourseLogo, selectCourseTitle } from '@/store/selectors/content'
import Icon from '@/ui/components/common/Icon'
import { useSelector } from '@/ui/hooks/store'

function Logo() {
  const title = useSelector(selectCourseTitle)
  const logo = useSelector(selectCourseLogo)

  const logoComponent = logo !== undefined ? <Icon name={logo} sx={{ mr: 1 }} /> : undefined

  return (
    <>
      {logoComponent}
      <Typography variant="h6" color="inherit" noWrap>
        {title}
      </Typography>
    </>
  )
}

export default Logo
