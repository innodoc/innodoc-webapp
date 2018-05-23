import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'

import { getToc } from '../../store/reducers/content'
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
  as: PropTypes.func.isRequired,
  dispatch: PropTypes.func,
}

Toc.defaultProps = {
  ...React.Component.defaultProps,
  as: Menu,
  toc: {},
}

const mapStateToProps = state => ({ toc: getToc(state) })

export default connect(mapStateToProps)(Toc)
