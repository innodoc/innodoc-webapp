import { Box, Container, Grid, Link as MuiLink, Stack, Typography } from '@mui/material'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { CONTENT_NAME_FOOTER_A, CONTENT_NAME_FOOTER_B } from '@/constants'
import { selectCourseTitle } from '@/store/selectors/content/course'
import { selectFooterPages } from '@/store/selectors/content/page'
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
    <MuiLink component={InternalLink} key={to} sx={linkSx} to={to}>
      {icon}
      {t(title)}
    </MuiLink>
  ))

  const courseLinks = coursePages.map(({ icon, id, title }) => (
    <MuiLink component={PageLink} key={`page-${id}`} pageId={id} sx={linkSx}>
      {icon !== undefined ? <Icon name={icon} /> : null}
      {title || null}
    </MuiLink>
  ))

  const contentFooterA =
    blocksFooterA !== undefined ? <ContentTree content={blocksFooterA} /> : null
  const contentFooterB =
    blocksFooterB !== undefined ? <ContentTree content={blocksFooterB} /> : null

  return (
    <Box
      component="footer"
      sx={(theme) => ({
        color: 'white',
        py: 5,
        mt: 'auto',
        bgcolor: 'background.footer',
        boxShadow:
          theme.palette.mode === 'light'
            ? 'inset 0 1rem 0.4rem -0.5rem rgba(0 0 0 / 35%)'
            : 'inset 0 1rem 0.4rem -0.5rem rgba(0 0 0 / 5%)',
        '& .MuiLink-root': {
          color: theme.palette.mode === 'light' ? 'primary.light' : 'primary.main',
        },
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
