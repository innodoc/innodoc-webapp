import { School } from '@mui/icons-material'
import { Typography } from '@mui/material'

import { selectCourseTitle } from '@/store/selectors/content'
import { useSelector } from '@/ui/hooks/store'

function Logo() {
  const title = useSelector(selectCourseTitle)

  return (
    <>
      <School sx={{ mr: 1 }} />
      <Typography variant="h6" color="inherit" noWrap>
        {title}
      </Typography>
    </>
  )
}

export default Logo
