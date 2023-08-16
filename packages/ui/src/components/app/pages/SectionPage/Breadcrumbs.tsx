import { Breadcrumbs as MuiBreadcrumbs, styled, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { formatSectionTitle } from '@innodoc/utils/content'

import { HomeLink, SectionLink } from '#components/common/links'
import { Icon } from '#components/common/misc'
import { useSelectBreadcrumbSections } from '#hooks/select'

const StyledBreadcrumbs = styled(MuiBreadcrumbs)(({ theme }) => ({
  marginBottom: theme.spacing(1),
  '& .MuiBreadcrumbs-separator': {
    marginLeft: 0,
    marginRight: 0,
  },
  '& .MuiLink-root': {
    color: theme.vars.palette.text.secondary,
    textDecoration: 'none',
    transition: theme.transitions.create('color', { duration: theme.transitions.duration.short }),
  },
  '& .MuiLink-root:hover': {
    color: theme.vars.palette.primary.main,
  },
}))

function Breadcrumbs() {
  const { t } = useTranslation()
  const { sections } = useSelectBreadcrumbSections()
  const homeTitle = t('builtinPages.home.title')

  return (
    <StyledBreadcrumbs separator={<Icon name="mdi:chevron-right" />}>
      <HomeLink title={homeTitle}>
        <Icon fontSize="small" name="mdi:home" sx={{ verticalAlign: 'text-top' }} />
      </HomeLink>
      {sections.map((section, idx) =>
        idx < sections.length - 1 ? (
          <SectionLink key={section.id} preferShortTitle section={section} />
        ) : (
          <Typography component="span" key={section.id}>
            {formatSectionTitle(section, true)}
          </Typography>
        )
      )}
    </StyledBreadcrumbs>
  )
}

export default Breadcrumbs
