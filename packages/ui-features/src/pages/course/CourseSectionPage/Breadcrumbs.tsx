import { Breadcrumbs as MuiBreadcrumbs, styled, Typography } from '@mui/material'
import { CourseHomeLink, SectionLink } from '@innodoc/ui-design-system/links'
import { Icon } from '@innodoc/ui-design-system/misc'
import { formatSectionTitle } from '@innodoc/ui-design-system/utils'
import { useSelectBreadcrumbSections } from '@innodoc/ui-store/hooks'

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
      <CourseHomeLink>
        <Icon fontSize="small" name="mdi:home" sx={{ verticalAlign: 'text-top' }} />
      </CourseHomeLink>
      {sections.map((section, index) =>
        index < sections.length - 1 ? (
          <SectionLink key={section.id} preferShortTitle section={section} />
        ) : (
          <Typography component="span" key={section.id}>
            {formatSectionTitle(section, true)}
          </Typography>
        ),
      )}
    </StyledBreadcrumbs>
  )
}

export default Breadcrumbs
