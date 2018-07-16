import React from 'react'
import { Container } from 'semantic-ui-react'

import { childrenType } from '../../../lib/propTypes'
import css from './style.sass'

const Main = ({ children }) => (
  <Container className={css.content}>
    {children}
  </Container>
)

Main.propTypes = {
  children: childrenType.isRequired,
}

export default Main
