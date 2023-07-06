import { Box, Container, Grid, Link, Stack, styled, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { FRAGMENT_TYPE_FOOTER_A, FRAGMENT_TYPE_FOOTER_B } from '#constants'
import { selectRouteInfo } from '#store/slices/appSlice'
import { useGetFragmentContentQuery } from '#store/slices/entities/fragments'
import builtInPages from '#ui/components/common/builtInPages'
import AppLink from '#ui/components/common/link/AppLink'
import PageLink from '#ui/components/common/link/PageLink'
import HastNode from '#ui/components/content/markdown/HastNode'
import { useSelector } from '#ui/hooks/store/store'
import useSelectCurrentCourse from '#ui/hooks/store/useSelectCurrentCourse'
import useSelectLinkedPages from '#ui/hooks/store/useSelectLinkedPages'

const builtInPagesNav = builtInPages.filter((page) => page.linked?.includes('footer'))

const FooterLink = styled(Link)(({ theme }) => ({
  alignItems: 'center',
  display: 'flex',
  lineHeight: theme.spacing(2.5),
  '& svg': { marginRight: theme.spacing(1) },
})) as typeof Link

function Footer() {
  const { t } = useTranslation()
  const { pages: coursePages } = useSelectLinkedPages('footer')
  const { course } = useSelectCurrentCourse()
  const { courseSlug, locale } = useSelector(selectRouteInfo)
  const { data: dataA } = useGetFragmentContentQuery(
    {
      courseSlug: courseSlug ?? '',
      locale,
      fragmentType: FRAGMENT_TYPE_FOOTER_A,
    },
    { skip: courseSlug === null }
  )
  const { data: dataB } = useGetFragmentContentQuery(
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

  const linkList = [
    ...coursePages.map((page) => (
      <FooterLink component={PageLink} key={`page-${page.id}`} page={page} />
    )),
    ...builtInPagesNav.map(({ icon, routeName, title }) => (
      <FooterLink component={AppLink} key={routeName} routeInfo={{ routeName }}>
        {icon}
        {t(title)}
      </FooterLink>
    )),
  ]

  return (
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
          <Grid item xs={12} md={3}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              {course.title}
            </Typography>
            <Stack spacing={1}>{linkList}</Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <HastNode hash={dataA?.hash} />
          </Grid>
          <Grid item xs={12} md={3}>
            <HastNode hash={dataB?.hash} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer
