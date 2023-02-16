import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material'
import getTextDecoration from '@mui/material/Link/getTextDecoration'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
} from '@mui/material/styles'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { FRAGMENT_TYPE_FOOTER_A, FRAGMENT_TYPE_FOOTER_B } from '#constants'
import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import useSelectLinkedPages from '#store/hooks/useSelectLinkedPages'
import { useGetFragmentContentQuery } from '#store/slices/entities/fragments'
import { selectLocale } from '#store/slices/uiSlice'
import InternalLink from '#ui/components/common/link/InternalLink'
import PageLink from '#ui/components/common/link/PageLink'
import MarkdownNode from '#ui/components/content/mdast/MarkdownNode'
import { otherPagesFooter } from '#ui/components/Layout/AppBar/otherPages'
import defaultTheme, { baseThemeOpts, makeTheme } from '#ui/components/PageShell/theme'
import { useSelector } from '#ui/hooks/store'

// Override link color on light theme for better readability
const footerTheme = makeTheme({
  ...baseThemeOpts,
  components: {
    ...baseThemeOpts.components,
    MuiLink: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          color: theme.vars.palette.primary.light,
          textDecorationColor: getTextDecoration({
            theme,
            ownerState: { ...ownerState, color: 'primary.light' },
          }),
        }),
      },
    },
  },
})

const linkSx = { alignItems: 'center', display: 'flex', '& svg': { mr: 1 } }

function Footer() {
  const { t } = useTranslation()
  const { mode } = useColorScheme()
  const { pages: coursePages } = useSelectLinkedPages('footer')
  const { course } = useSelectCurrentCourse()
  const locale = useSelector(selectLocale)
  const { data: contentA } = useGetFragmentContentQuery(
    {
      courseId: course?.id ?? 0,
      locale,
      fragmentType: FRAGMENT_TYPE_FOOTER_A,
    },
    { skip: course === undefined }
  )
  const { data: contentB } = useGetFragmentContentQuery(
    {
      courseId: course?.id ?? 0,
      locale,
      fragmentType: FRAGMENT_TYPE_FOOTER_B,
    },
    { skip: course === undefined }
  )

  if (course === undefined) return null

  const internalLinks = otherPagesFooter.map(({ icon, to, title }) => (
    <Link component={InternalLink} key={to} sx={linkSx} to={to}>
      {icon}
      {t(title)}
    </Link>
  ))

  const courseLinks = coursePages.map((page) => (
    <Link component={PageLink} key={`page-${page.id}`} page={page} sx={linkSx} />
  ))

  const contentFooterA = contentA !== undefined ? <MarkdownNode content={contentA} /> : null
  const contentFooterB = contentB !== undefined ? <MarkdownNode content={contentB} /> : null

  return (
    <CssVarsProvider theme={mode === 'light' ? footerTheme : defaultTheme}>
      <Box
        component="footer"
        sx={(theme) => ({
          color: theme.vars.palette.common.white,
          py: 5,
          mt: 'auto',
          backgroundColor: theme.vars.palette.Footer.bg,
          boxShadow: theme.vars.shadowFooter,
        })}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={3} sx={{ mb: 3 }}>
              <Typography variant="h4" gutterBottom>
                {course.title}
              </Typography>
              <Stack spacing={1}>{[...internalLinks, ...courseLinks]}</Stack>
            </Grid>
            <Grid item xs={12} md={6} sx={{ mb: 3 }}>
              {contentFooterA}
            </Grid>
            <Grid item xs={12} md={3} sx={{ mb: 3 }}>
              {contentFooterB}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </CssVarsProvider>
  )
}

export default memo(Footer)
