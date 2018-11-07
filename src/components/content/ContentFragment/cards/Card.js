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
  iconType,
  cardType,
  content,
}) => {
  const icon = iconType
    ? <Icon type={iconType} className={css.icon} />
    : null

  const titleFragment = (
    <React.Fragment>
      {icon}
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
  iconType: PropTypes.string,
  content: contentType.isRequired,
}

Card.defaultProps = {
  iconType: null,
}

export default Card
