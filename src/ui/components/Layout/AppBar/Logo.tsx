import { Link, styled, Typography } from '@mui/material'

import SvgLogo from '#build/Logo'
import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import HomeLink from '#ui/components/common/link/HomeLink'

const StyledSvgLogo =
  SvgLogo !== null
    ? styled(SvgLogo)({
        color: 'var(--mui-palette-text-primary)',
        height: '1em',
        userSelect: 'none',
        width: 'auto',
        fill: 'currentColor',
      })
    : () => null

function Logo() {
  const { course } = useSelectCurrentCourse()

  if (course === undefined) return null

  const content =
    SvgLogo !== null ? (
      <StyledSvgLogo />
    ) : (
      <Typography variant="h6" color="inherit" noWrap>
        {course.title}
      </Typography>
    )

  return (
    <Link component={HomeLink} sx={{ display: 'inline-flex' }} title={course.title}>
      {content}
    </Link>
  )
}

export default Logo
