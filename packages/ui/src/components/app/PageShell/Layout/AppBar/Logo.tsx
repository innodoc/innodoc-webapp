import { Typography } from '@mui/material'

import { HomeLink } from '#components/common'
import { useSelectCurrentCourse } from '#hooks/store'

// TODO: save logo in database?

// const StyledSvgLogo =
//   SvgLogo !== null
//     ? styled(SvgLogo)({
//         color: 'var(--mui-palette-text-primary)',
//         height: '1em',
//         userSelect: 'none',
//         width: 'auto',
//         fill: 'currentColor',
//       })
//     : null

function Logo() {
  const { course } = useSelectCurrentCourse()

  if (course === undefined) {
    return null
  }

  // const content = <StyledSvgLogo />
  const content = (
    <Typography variant="h6" color="inherit" noWrap>
      {course.title}
    </Typography>
  )

  return (
    <HomeLink sx={{ display: 'inline-flex', mr: 2 }} title={course.title ?? ''}>
      {content}
    </HomeLink>
  )
}

export default Logo
