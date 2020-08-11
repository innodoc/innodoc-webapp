import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Button } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import SidebarToggleButton from '../../Layout/Sidebar/ToggleButton'
import { SectionLink } from '../links'

import css from './style.sss'

const SectionButton = ({ direction, sectionId }) => {
  const icon = direction === 'left' ? <ArrowLeftOutlined /> : <ArrowRightOutlined />
  const disabled = !sectionId
  const button = <Button className={css.affixButton} disabled={disabled} icon={icon} size="small" />
  if (disabled) {
    return button
  }
  return <SectionLink contentId={sectionId}>{button}</SectionLink>
}

SectionButton.defaultProps = { sectionId: null }

SectionButton.propTypes = {
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
  sectionId: PropTypes.string,
}

const AffixButtons = () => {
  const { prevId, nextId } = useSelector(sectionSelectors.getNextPrevSections)
  return (
    <div className={css.affixButtons}>
      <SectionButton direction="left" sectionId={prevId} />
      <SidebarToggleButton className={css.affixButton} />
      <SectionButton direction="right" sectionId={nextId} />
    </div>
  )
}

export { SectionButton } // for testing
export default AffixButtons
