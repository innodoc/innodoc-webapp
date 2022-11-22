import { Link, styled, Typography } from '@mui/material'

import SvgLogo from '#build/Logo'
import { selectCourseTitle } from '#store/selectors/content/course'
import HomeLink from '#ui/components/common/link/HomeLink'
import { useSelector } from '#ui/hooks/store'

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
  const title = useSelector(selectCourseTitle)

  const content =
    SvgLogo !== null ? (
      <StyledSvgLogo />
    ) : (
      <Typography variant="h6" color="inherit" noWrap>
        {title}
      </Typography>
    )

  return (
    <Link component={HomeLink} sx={{ display: 'inline-flex' }} title={title}>
      {content}
    </Link>
  )
}

export default Logo
