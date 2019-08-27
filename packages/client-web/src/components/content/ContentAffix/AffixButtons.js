import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import css from './style.sass'
import SidebarToggleButton from '../../Layout/Sidebar/ToggleButton'
import { SectionLink } from '../links'

const SectionButton = ({ sectionId, direction }) => {
  const iconType = `arrow-${direction}`
  return sectionId
    ? (
      <SectionLink key={sectionId} contentId={sectionId}>
        <a>
          <Icon type={iconType} />
        </a>
      </SectionLink>
    )
    : (
      <Icon
        key={`__NON_EXISTENT_${direction}`}
        className={css.disabled}
        type={iconType}
      />
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
