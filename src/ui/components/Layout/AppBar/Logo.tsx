import { Typography } from '@mui/material'

import { selectCourseTitle } from '@/store/selectors/content'
import Icon from '@/ui/components/common/Icon'
import { useSelector } from '@/ui/hooks/store'

function Logo() {
  const title = useSelector(selectCourseTitle)

  return (
    <>
      <Icon name="school" sx={{ mr: 1 }} />
      <Typography variant="h6" color="inherit" noWrap>
        {title}
      </Typography>
    </>
  )
}

export default Logo
