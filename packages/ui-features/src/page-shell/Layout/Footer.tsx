import { Box, Container, Grid, Link, Stack, styled, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { FRAGMENT_TYPE_FOOTER_A, FRAGMENT_TYPE_FOOTER_B } from '@innodoc/shared-core/constants'
import { isCourseRouteInfo } from '@innodoc/shared-core/typeguards'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import getFragmentsApi from '@innodoc/shared-store/slices/content/fragments'
import HastNode from '@innodoc/ui-content'
import { AppLink, PageLink } from '@innodoc/ui-design-system/links'
import pageLinks from '@innodoc/ui-design-system/page-links'
import { useRouteManager } from '@innodoc/ui-shared/hooks'
import { useSelectCurrentCourse, useSelectLinkedPages, useSelector } from '@innodoc/ui-shared/store-hooks'

const pageLinksFooter = pageLinks.filter((page) => page.linked?.includes('footer'))

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
  const routeInfo = useSelector(selectRouteInfo)
  const { locale } = routeInfo
  const courseSlug = isCourseRouteInfo(routeInfo) ? routeInfo.courseSlug : undefined
  const routeManager = useRouteManager()
  const fragments = getFragmentsApi(routeManager)

  const { data: dataA } = fragments.useGetFragmentContentQuery(
    {
      courseSlug: courseSlug ?? '',
      locale,
      fragmentType: FRAGMENT_TYPE_FOOTER_A,
    },
    { skip: courseSlug === undefined },
  )
  const { data: dataB } = fragments.useGetFragmentContentQuery(
    {
      courseSlug: courseSlug ?? '',
      locale,
      fragmentType: FRAGMENT_TYPE_FOOTER_B,
    },
    { skip: courseSlug === undefined },
  )

  if (course === undefined) {
    return null
  }

  const linkList = [
    ...coursePages.map((page) => <FooterLink component={PageLink} key={`page-${String(page.id)}`} page={page} />),
    ...pageLinksFooter.map(({ icon, routeName, title }) => (
      <FooterLink component={AppLink} key={routeName} routeInfo={{ name: routeName }}>
        {icon}
        {title ? t(title) : null}
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
          <Grid size={{ xs: 12, md: 3 }}>
            <Typography variant="h4" sx={{ mb: 3 }}>
              {course.title}
            </Typography>
            <Stack spacing={1}>{linkList}</Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <HastNode hash={dataA?.hash} />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <HastNode hash={dataB?.hash} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer
