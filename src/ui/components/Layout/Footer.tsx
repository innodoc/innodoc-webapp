import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material'
import getTextDecoration from '@mui/material/Link/getTextDecoration'
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  styled,
  useColorScheme,
} from '@mui/material/styles'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { FRAGMENT_TYPE_FOOTER_A, FRAGMENT_TYPE_FOOTER_B } from '#constants'
import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetFragmentContentQuery } from '#store/slices/entities/fragments'
import builtInPages from '#ui/components/common/builtInPages'
import InternalLink from '#ui/components/common/link/InternalLink'
import PageLink from '#ui/components/common/link/PageLink'
import MarkdownNode from '#ui/components/content/mdast/MarkdownNode'
import defaultTheme, { baseThemeOpts, makeTheme } from '#ui/components/PageShell/theme'
import { useSelector } from '#ui/hooks/store'
import useGenerateUrl from '#ui/hooks/useGenerateUrl'
import useSelectCurrentCourse from '#ui/hooks/useSelectCurrentCourse'
import useSelectLinkedPages from '#ui/hooks/useSelectLinkedPages'

const builtInPagesNav = builtInPages.filter((page) => page.linked.includes('footer'))

// TODO: refactor into multiple files, use different list component as icon is
// mis-aligned

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

const StyledGrid = styled(Grid)(({ theme }) => ({
  '& > :first-of-type': {
    marginTop: 0,
    marginBottom: theme.spacing(3),
  },
}))

const StyledLink = styled(Link)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  lineHeight: theme.spacing(2.5),
  '& svg': { marginRight: theme.spacing(1) },
})) as typeof Link

function Footer() {
  const generateUrl = useGenerateUrl()
  const { t } = useTranslation()
  const { mode } = useColorScheme()
  const { pages: coursePages } = useSelectLinkedPages('footer')
  const { course } = useSelectCurrentCourse()
  const { courseSlug, locale } = useSelector(selectRouteInfo)
  const { data: contentA } = useGetFragmentContentQuery(
    {
      courseSlug: courseSlug ?? '',
      locale,
      fragmentType: FRAGMENT_TYPE_FOOTER_A,
    },
    { skip: courseSlug === null }
  )
  const { data: contentB } = useGetFragmentContentQuery(
    {
      courseSlug: courseSlug ?? '',
      locale,
      fragmentType: FRAGMENT_TYPE_FOOTER_B,
    },
    { skip: courseSlug === null }
  )

  if (course === undefined) {
    return null
  }

  const internalLinks = builtInPagesNav.map(({ icon, routeName, title }) => (
    <StyledLink component={InternalLink} key={routeName} to={generateUrl({ routeName })}>
      {icon}
      {t(title)}
    </StyledLink>
  ))

  const courseLinks = coursePages.map((page) => (
    <StyledLink component={PageLink} key={`page-${page.id}`} page={page} />
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
            <StyledGrid item xs={12} md={3}>
              <Typography variant="h4">{course.title}</Typography>
              <Stack spacing={1}>{[...internalLinks, ...courseLinks]}</Stack>
            </StyledGrid>
            <StyledGrid item xs={12} md={6}>
              {contentFooterA}
            </StyledGrid>
            <StyledGrid item xs={12} md={3}>
              {contentFooterB}
            </StyledGrid>
          </Grid>
        </Container>
      </Box>
    </CssVarsProvider>
  )
}

export default memo(Footer)
