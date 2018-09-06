import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react'

import { tocTreeType } from '../../lib/propTypes'
import TocItem from './Item'

const Toc = ({
  toc,
  as: ElementType,
  dispatch,
  header,
  sectionPrefix,
  ...otherProps
}) => {
  const sections = toc.map(
    (section, i) => (
      <TocItem
        sectionPath={section.id}
        title={section.title}
        subSections={section.children}
        sectionPrefix={sectionPrefix}
        key={i.toString()}
      />
    )
  )

  const headerItem = header
    ? (
      <Menu.Item header>
        {header}
      </Menu.Item>
    )
    : null

  return (
    <ElementType {...otherProps}>
      {headerItem}
      {sections}
    </ElementType>
  )
}

Toc.propTypes = {
  toc: tocTreeType.isRequired,
  as: PropTypes.func,
  dispatch: PropTypes.func,
  header: PropTypes.string,
  sectionPrefix: PropTypes.string,
}

Toc.defaultProps = {
  ...React.Component.defaultProps,
  as: Menu,
  sectionPrefix: '',
  header: null,
}

export default Toc
