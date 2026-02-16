import { Typography } from '@mui/material'

import { useSelectCurrentCourse } from '@innodoc/ui-shared/hooks'

import { AppLink, CourseHomeLink } from '@innodoc/ui-design-system/links'

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

  if (!course) {
    return <AppLink routeInfo={{ name: 'app:index' }} />
  }

  // const content = <StyledSvgLogo />
  const content = (
    <Typography variant="h6" color="inherit" noWrap>
      {course.title}
    </Typography>
  )

  return (
    <CourseHomeLink sx={{ display: 'inline-flex', mr: 2 }} title={course.title ?? ''}>
      {content}
    </CourseHomeLink>
  )
}

export default Logo
