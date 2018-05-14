import React from 'react'

import {Button, Icon} from 'semantic-ui-react'
import css from './style.sass'

export default class SidebarToggle extends React.Component {
  render() {
    const icon = <Icon name="content" />
    return (
      <div className={css.sidebarToggle}>
        <Button basic
                icon={icon}
                title="Kursinhalt einblenden"
                {...this.props}
        />
      </div>
    )
  }
}
