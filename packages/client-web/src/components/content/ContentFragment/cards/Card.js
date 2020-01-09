import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Card as AntCard, Icon } from 'antd'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import css from './style.sss'
import ContentFragment from '..'

const Card = ({ title, icon, cardType, content, id }) => {
  let iconElem = null
  if (icon) {
    if (typeof icon === 'string') {
      iconElem = <Icon type={icon} className={css.icon} />
    } else {
      iconElem = <Icon component={icon} className={css.icon} />
    }
  }

  const titleFragment = (
    <>
      {iconElem}
      {title}
    </>
  )

  return (
    <AntCard
      id={id}
      className={classNames(cardType, css[cardType])}
      title={titleFragment}
    >
      <div>
        <ContentFragment content={content} />
      </div>
    </AntCard>
  )
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  cardType: PropTypes.string.isRequired,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.object]),
  content: contentType.isRequired,
  id: PropTypes.string,
}

Card.defaultProps = {
  icon: null,
  id: null,
}

export default Card
