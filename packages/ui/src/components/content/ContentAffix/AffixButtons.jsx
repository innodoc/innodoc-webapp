import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { selectNextPrevSections } from '@innodoc/store/selectors/sections'

import SidebarToggleButton from '../../layout/Sidebar/ToggleButton.jsx'
import SectionLink from '../links/SectionLink.js'

import css from './ContentAffix.module.sss'

function SectionButton({ direction, sectionId }) {
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

function AffixButtons() {
  const { prevId, nextId } = useSelector(selectNextPrevSections)
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
