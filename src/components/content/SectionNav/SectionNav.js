import React from 'react'
import { useSelector } from 'react-redux'
import Icon from 'antd/lib/icon'

import css from './style.sass'
import SectionLink from '../../SectionLink'
import sectionSelectors from '../../../store/selectors/section'

const SectionNav = () => {
  const { prevId, nextId } = useSelector(sectionSelectors.getNextPrevSections)
  const arrows = [
    [prevId, 'left'],
    [nextId, 'right'],
  ].map(([sectionId, dir]) => {
    const iconType = `arrow-${dir}`
    return sectionId
      ? (
        <SectionLink key={sectionId} sectionId={sectionId}>
          <a>
            <Icon type={iconType} />
          </a>
        </SectionLink>
      )
      : (
        <Icon
          key={`__NON_EXISTENT_${dir}`}
          className={css.disabled}
          type={iconType}
        />
      )
  })
  return <div className={css.sectionNav}>{arrows}</div>
}

export default SectionNav
