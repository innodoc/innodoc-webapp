import { Grid, Link as MuiLink, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { selectCourseTitle, selectFooterPages } from '@/store/selectors/content'
import Icon from '@/ui/components/common/Icon'
import Link, { PageLink } from '@/ui/components/common/Link'
import { otherPagesFooter } from '@/ui/components/Layout/AppBar/otherPages'
import { useSelector } from '@/ui/hooks/store'

const linkSx = { alignItems: 'center', display: 'flex', '& svg': { mr: 1 } }

function Footer() {
  const { t } = useTranslation()
  const title = useSelector(selectCourseTitle)
  const coursePages = useSelector(selectFooterPages)

  const internalLinks = otherPagesFooter.map(({ icon, to, title }) => (
    <MuiLink component={Link} key={to} sx={linkSx} to={to} underline="hover">
      {icon}
      {t(title)}
    </MuiLink>
  ))

  const courseLinks = coursePages.map(({ icon, id, title }) => (
    <MuiLink component={PageLink} key={`page-${id}`} pageId={id} sx={linkSx} underline="hover">
      {icon !== undefined ? <Icon name={icon} /> : null}
      {title ? t(title) : null}
    </MuiLink>
  ))

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Typography variant="h5" gutterBottom>
          {title}
        </Typography>
        <Stack spacing={1}>{[...internalLinks, ...courseLinks]}</Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        <Typography variant="h5" gutterBottom>
          Über diesen Kurs
        </Typography>
      </Grid>
      <Grid item xs={12} md={3}>
        <Typography variant="h5" gutterBottom>
          Lizenz
        </Typography>
      </Grid>
    </Grid>
  )
}

export default Footer
