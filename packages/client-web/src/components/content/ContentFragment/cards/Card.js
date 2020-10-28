import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Card as AntCard } from 'antd'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import css from './style.sss'
import ContentFragment from '..'

const Card = ({ cardType, content, extra, icon, id, title }) => {
  const titleFragment = (
    <>
      {icon ? <span className={css.icon}>{icon}</span> : null}
      {title}
    </>
  )

  return (
    <AntCard
      id={id}
      className={classNames(cardType, css[cardType])}
      extra={extra}
      title={titleFragment}
    >
      <div>
        <ContentFragment content={content} />
      </div>
    </AntCard>
  )
}

Card.defaultProps = {
  extra: null,
  icon: null,
  id: null,
}

Card.propTypes = {
  cardType: PropTypes.string.isRequired,
  content: contentType.isRequired,
  extra: PropTypes.node,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.object]),
  id: PropTypes.string,
  title: PropTypes.string.isRequired,
}

export default Card
