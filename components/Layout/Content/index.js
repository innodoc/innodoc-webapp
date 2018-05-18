import React from 'react'
import { Container } from 'semantic-ui-react'

import { childrenType } from '../../../lib/propTypes'
import css from './style.sass'

const Content = ({ children }) => (
  <Container className={css.content}>
    {children}
  </Container>
)

Content.propTypes = {
  children: childrenType.isRequired,
}

export default Content
