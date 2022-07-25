import { Card as AntCard } from 'antd'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { contentType } from '@innodoc/misc/propTypes'

import ContentFragment from '../ContentFragment.jsx'

import css from './Card.module.sss'

function Card({ actions, cardType, content, extra, icon, id, title }) {
  const titleFragment = (
    <>
      {icon ? <span className={css.icon}>{icon}</span> : null}
      {title}
    </>
  )

  return (
    <AntCard
      actions={actions}
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
  actions: null,
  extra: null,
  icon: null,
  id: null,
}

Card.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.node),
  cardType: PropTypes.string.isRequired,
  content: contentType.isRequired,
  extra: PropTypes.node,
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.func, PropTypes.object]),
  id: PropTypes.string,
  title: PropTypes.node.isRequired,
}

export default Card
