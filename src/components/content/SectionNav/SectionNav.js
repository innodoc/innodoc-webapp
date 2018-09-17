import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import classNames from 'classnames'

import { sectionType } from '../../../lib/propTypes'
import { astToString } from '../../../lib/util'
import contentSelectors from '../../../store/selectors/content'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const SectionNav = ({ prev, next }) => (
  <div>
    {
      prev ? (
        <SectionLink sectionPath={prev.path}>
          <a title={astToString(prev.title)} className={classNames(css.sbtn, css.prev)}>
            <Icon size="huge" name="angle left" />
          </a>
        </SectionLink>
      ) : null
    }
    {
      next ? (
        <SectionLink sectionPath={next.path}>
          <a title={astToString(next.title)} className={classNames(css.sbtn, css.next)}>
            <Icon size="huge" name="angle right" />
          </a>
        </SectionLink>
      ) : null
    }
  </div>
)

const mapStateToProps = state => contentSelectors.getNavSections(state)

SectionNav.propTypes = {
  prev: sectionType,
  next: sectionType,
}

SectionNav.defaultProps = {
  prev: undefined,
  next: undefined,
}

export { SectionNav } // for testing
export default connect(mapStateToProps)(SectionNav)
