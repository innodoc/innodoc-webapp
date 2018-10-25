import React from 'react'
import { Placeholder, Segment } from 'semantic-ui-react'

import css from './style.sass'

const BreadcrumbPlaceholder = () => (
  <Segment basic className={css.breadcrumbSegment}>
    <Placeholder>
      <Placeholder.Paragraph>
        <Placeholder.Line />
      </Placeholder.Paragraph>
    </Placeholder>
  </Segment>
)

export default BreadcrumbPlaceholder
