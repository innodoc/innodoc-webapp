import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import Button from 'antd/lib/button'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'

import css from './style.sass'
import { SectionLink } from '../links'
import appSelectors from '../../../store/selectors'
import sectionSelectors from '../../../store/selectors/section'
import { toggleSidebar } from '../../../store/actions/ui'
import { useTranslation } from '../../../lib/i18n'

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
  const { t } = useTranslation()
  const { prevId, nextId } = useSelector(sectionSelectors.getNextPrevSections)
  const { sidebarVisible } = useSelector(appSelectors.getApp)
  const dispatch = useDispatch()

  return (
    <Menu mode="horizontal">
      <Menu.Item disabled={!prevId}>
        <SectionButton direction="left" sectionId={prevId} />
      </Menu.Item>
      <Menu.Item>
        <Button
          className={classNames(css.sidebarToggleButton, sidebarVisible ? 'active' : null)}
          ghost
          icon="read"
          onClick={() => dispatch(toggleSidebar())}
          title={t(sidebarVisible ? 'content.hideToc' : 'content.showToc')}
        />
      </Menu.Item>
      <Menu.Item disabled={!nextId}>
        <SectionButton direction="right" sectionId={nextId} />
      </Menu.Item>
    </Menu>
  )
}

export { SectionButton }
export default AffixButtons
