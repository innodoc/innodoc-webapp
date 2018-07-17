import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react'

import { tocTreeType } from '../../lib/propTypes'
import TocItem from './Item'

const Toc = ({
  toc,
  as: ElementType,
  dispatch,
  ...otherProps
}) => {
  const sections = toc.map(
    (section, i) => (
      <TocItem
        sectionId={section.id}
        title={section.title}
        subSections={section.children}
        key={i.toString()}
      />
    )
  )

  return (
    <ElementType {...otherProps}>
      {sections}
    </ElementType>
  )
}

Toc.propTypes = {
  toc: tocTreeType.isRequired,
  as: PropTypes.func,
  dispatch: PropTypes.func,
}

Toc.defaultProps = {
  ...React.Component.defaultProps,
  as: Menu,
}

export default Toc
