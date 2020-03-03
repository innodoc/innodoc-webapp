import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Menu } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import css from './style.sss'
import SidebarToggleButton from '../../Layout/Sidebar/ToggleButton'
import { SectionLink } from '../links'

const SectionButton = ({ sectionId, direction }) => {
  const icon =
    direction === 'left' ? <ArrowLeftOutlined /> : <ArrowRightOutlined />
  return sectionId ? (
    <SectionLink key={sectionId} contentId={sectionId}>
      <a>{icon}</a>
    </SectionLink>
  ) : (
    <span className={css.disabled} key={`__NON_EXISTENT_${direction}`}>
      {icon}
    </span>
  )
}

SectionButton.defaultProps = { sectionId: null }

SectionButton.propTypes = {
  sectionId: PropTypes.string,
  direction: PropTypes.oneOf(['left', 'right']).isRequired,
}

const AffixButtons = () => {
  const { prevId, nextId } = useSelector(sectionSelectors.getNextPrevSections)
  return (
    <Menu mode="horizontal">
      <Menu.Item disabled={!prevId}>
        <SectionButton direction="left" sectionId={prevId} />
      </Menu.Item>
      <Menu.Item>
        <SidebarToggleButton />
      </Menu.Item>
      <Menu.Item disabled={!nextId}>
        <SectionButton direction="right" sectionId={nextId} />
      </Menu.Item>
    </Menu>
  )
}

export { SectionButton }
export default AffixButtons
