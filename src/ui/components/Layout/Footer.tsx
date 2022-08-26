import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { CONTENT_NAME_FOOTER_A, CONTENT_NAME_FOOTER_B } from '@/constants'
import { selectCourseTitle } from '@/store/selectors/content/course'
import { selectFooterPages } from '@/store/selectors/content/page'
import { selectLocale } from '@/store/selectors/ui'
import { useGetContentQuery } from '@/store/slices/contentApi'
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
    <Link component={InternalLink} key={to} sx={linkSx} to={to}>
      {icon}
      {t(title)}
    </Link>
  ))

  const courseLinks = coursePages.map((page) => (
    <Link component={PageLink} key={`page-${page.id}`} page={page} sx={linkSx} />
  ))

  const contentFooterA =
    blocksFooterA !== undefined ? <ContentTree content={blocksFooterA} /> : null
  const contentFooterB =
    blocksFooterB !== undefined ? <ContentTree content={blocksFooterB} /> : null

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        color: theme.vars.palette.common.white,
        py: 5,
        mt: 'auto',
        backgroundColor: theme.vars.palette.Footer.defaultBg,
        boxShadow: theme.vars.shadowFooter,
      })}
    >
      <Container maxWidth="lg">
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
      </Container>
    </Box>
  )
}

export default memo(Footer)
