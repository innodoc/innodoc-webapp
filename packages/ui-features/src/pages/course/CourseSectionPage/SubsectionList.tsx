import { Card, CardContent, CardHeader, List, ListItem, ListItemText } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { TranslatedSection } from '@innodoc/shared-core/types'
import { SectionLink } from '@innodoc/ui-design-system/links'
import { Icon } from '@innodoc/ui-design-system/misc'
import { useSelectSectionChildren } from '@innodoc/ui-shared/store-hooks'

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
        slotProps={{ title: { variant: 'h4' } }}
      />
      <CardContent sx={{ '&:last-child': { py: 1 } }}>
        <List sx={{ py: 0, '& .MuiListItem-root': { minHeight: 36 } }}>
          {children.map((section) => (
            <ListItem key={section.id} disablePadding>
              <ListItemText primary={<SectionLink section={section} sx={{ typography: 'subtitle1' }} />} />
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
