import React from 'react'
import { Header, Placeholder } from 'semantic-ui-react'

import BreadcrumbPlaceholder from '../Breadcrumb/Placeholder'
import css from './style.sass'

const ContentPlaceholder = () => (
  <React.Fragment>
    <BreadcrumbPlaceholder />
    <Header>
      <Placeholder fluid>
        <Placeholder.Header>
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
    </Header>
    <div className={css.content}>
      <Placeholder fluid>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
      <Placeholder style={{ height: 200, width: 250 }}>
        <Placeholder.Image />
      </Placeholder>
      <Placeholder fluid>
        <Placeholder.Paragraph>
          <Placeholder.Line />
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Paragraph>
      </Placeholder>
    </div>
  </React.Fragment>
)

export default ContentPlaceholder
