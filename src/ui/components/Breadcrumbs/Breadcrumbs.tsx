import { Breadcrumbs as MuiBreadcrumbs, Link, styled, Typography } from '@mui/material'

import useSelectBreadcrumbSections from '#store/hooks/useSelectBreadcrumbSections'
import Icon from '#ui/components/common/Icon'
import HomeLink from '#ui/components/common/link/HomeLink'
import SectionLink from '#ui/components/common/link/SectionLink'
import { formatSectionTitle } from '#utils/content'

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
  const { sections } = useSelectBreadcrumbSections()

  return (
    <StyledBreadcrumbs separator={<Icon name="mdi:chevron-right" />}>
      <Link component={HomeLink}>
        <Icon fontSize="small" name="mdi:home" sx={{ verticalAlign: 'text-top' }} />
      </Link>
      {sections.map((section, idx) =>
        idx < sections.length - 1 ? (
          <Link component={SectionLink} key={section.id} preferShortTitle section={section} />
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
