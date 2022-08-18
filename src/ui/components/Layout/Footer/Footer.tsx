import { Grid, Link as MuiLink, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { CONTENT_NAME_FOOTER_A, CONTENT_NAME_FOOTER_B } from '@/constants'
import { selectCourseTitle, selectFooterPages } from '@/store/selectors/content'
import { selectLocale } from '@/store/selectors/ui'
import { useGetContentQuery } from '@/store/slices/contentApi'
import Icon from '@/ui/components/common/Icon'
import InternalLink from '@/ui/components/common/link/InternalLink'
import PageLink from '@/ui/components/common/link/PageLink'
import ContentTree from '@/ui/components/content/ContentTree'
import { otherPagesFooter } from '@/ui/components/Layout/AppBar/otherPages'
import { useSelector } from '@/ui/hooks/store'

const linkSx = { alignItems: 'center', display: 'flex', '& svg': { mr: 1 } }

function Footer() {
  const { t } = useTranslation()
  const courseTitle = useSelector(selectCourseTitle)
  const coursePages = useSelector(selectFooterPages)
  const locale = useSelector(selectLocale)
  const { data: blocksFooterA } = useGetContentQuery({ locale, path: CONTENT_NAME_FOOTER_A })
  const { data: blocksFooterB } = useGetContentQuery({ locale, path: CONTENT_NAME_FOOTER_B })

  const internalLinks = otherPagesFooter.map(({ icon, to, title }) => (
    <MuiLink component={InternalLink} key={to} sx={linkSx} to={to} underline="hover">
      {icon}
      {t(title)}
    </MuiLink>
  ))

  const courseLinks = coursePages.map(({ icon, id, title }) => (
    <MuiLink component={PageLink} key={`page-${id}`} pageId={id} sx={linkSx} underline="hover">
      {icon !== undefined ? <Icon name={icon} /> : null}
      {title || null}
    </MuiLink>
  ))

  const contentFooterA =
    blocksFooterA !== undefined ? <ContentTree content={blocksFooterA} /> : null
  const contentFooterB =
    blocksFooterB !== undefined ? <ContentTree content={blocksFooterB} /> : null

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Typography variant="h4" gutterBottom>
          {courseTitle}
        </Typography>
        <Stack spacing={1}>{[...internalLinks, ...courseLinks]}</Stack>
      </Grid>
      <Grid item xs={12} md={6}>
        {contentFooterA}
      </Grid>
      <Grid item xs={12} md={3}>
        {contentFooterB}
      </Grid>
    </Grid>
  )
}

export default Footer
