import React from 'react'
import { useSelector } from 'react-redux'
import Icon from 'antd/lib/icon'

import css from './style.sass'
import SectionLink from '../../SectionLink'
import sectionSelectors from '../../../store/selectors/section'

const SectionNav = () => {
  const { prevId, nextId } = useSelector(sectionSelectors.getNextPrevSections)

  const prev = prevId
    ? (
      <SectionLink sectionId={prevId}>
        <a className={css.prev}>
          <Icon type="arrow-left" />
        </a>
      </SectionLink>
    )
    : null

  const next = nextId
    ? (
      <SectionLink sectionId={nextId}>
        <a className={css.next}>
          <Icon type="arrow-right" />
        </a>
      </SectionLink>
    )
    : null

  return (
    <React.Fragment>
      {prev}
      {next}
    </React.Fragment>
  )
}

export default SectionNav
