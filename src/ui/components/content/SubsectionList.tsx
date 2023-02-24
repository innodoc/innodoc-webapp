import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from '@mui/material'
import { useTranslation } from 'react-i18next'

import useSelectSectionChildren from '#store/hooks/useSelectSectionChildren'
import type { TranslatedSection } from '#types/entities/section'
import Icon from '#ui/components/common/Icon'
import SectionLink from '#ui/components/common/link/SectionLink'

function SubsectionList({ sectionId }: SubsectionListProps) {
  const { t } = useTranslation()
  const { sections: children } = useSelectSectionChildren(sectionId)

  if (children.length === 0) {
    return null
  }

  return (
    <Card elevation={2} sx={{ mb: 4 }}>
      <CardHeader
        avatar={<Icon name="mdi:list-box-outline" />}
        title={t('content.subsections')}
        titleTypographyProps={{ variant: 'h4' }}
      />
      <CardContent sx={{ '&:last-child': { py: 1 } }}>
        <List dense sx={{ py: 0 }}>
          {children.map((section) => (
            <ListItem key={section.id} sx={{ p: 0 }}>
              <ListItemText
                primary={<SectionLink section={section} sx={{ typography: 'subtitle1' }} />}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  )
}

interface SubsectionListProps {
  sectionId: TranslatedSection['id']
}

export default SubsectionList