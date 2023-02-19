import { Link, Typography } from '@mui/material'

import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import HomeLink from '#ui/components/common/link/HomeLink'

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

  if (course === undefined) return null

  // const content = <StyledSvgLogo />
  const content = (
    <Typography variant="h6" color="inherit" noWrap>
      {course.title}
    </Typography>
  )

  return (
    <Link component={HomeLink} sx={{ display: 'inline-flex', mr: 2 }} title={course.title ?? ''}>
      {content}
    </Link>
  )
}

export default Logo
