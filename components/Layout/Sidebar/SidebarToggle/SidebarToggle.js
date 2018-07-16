import React from 'react'

import { Button, Icon } from 'semantic-ui-react'
import css from './style.sass'

const SidebarToggle = (props) => {
  const icon = <Icon name="content" />
  return (
    <div className={css.sidebarToggle}>
      <Button basic icon={icon} {...props} />
    </div>
  )
}

export default SidebarToggle
