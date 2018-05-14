import React from 'react'
import PropTypes from 'prop-types'
import {translate} from 'react-i18next'

import {Button, Icon} from 'semantic-ui-react'
import css from './style.sass'

class SidebarToggle extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  render() {
    const {t} = this.props
    const icon = <Icon name="content" />
    return (
      <div className={css.sidebarToggle}>
        <Button basic
                icon={icon}
                title={t('showMenu')}
                {...this.props}
        />
      </div>
    )
  }
}

export default translate('common')(SidebarToggle)
