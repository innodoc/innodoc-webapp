import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import AntCard from 'antd/lib/card'
import Icon from 'antd/lib/icon'

import css from './style.sass'
import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'

const Card = ({
  title,
  icon,
  cardType,
  content,
}) => {
  let iconElem = null
  if (icon) {
    if (typeof icon === 'string') {
      iconElem = <Icon type={icon} className={css.icon} />
    } else {
      iconElem = <Icon component={icon} className={css.icon} />
    }
  }

  const titleFragment = (
    <React.Fragment>
      {iconElem}
      {title}
    </React.Fragment>
  )

  return (
    <AntCard className={classNames(cardType, css[cardType])} title={titleFragment}>
      <div>
        <ContentFragment content={content} />
      </div>
    </AntCard>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  content: contentType.isRequired,
}

Card.defaultProps = {
  icon: null,
}

export default Card
