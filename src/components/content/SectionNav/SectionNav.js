import React from 'react'
import { connect } from 'react-redux'
import { Icon } from 'semantic-ui-react'

import { sectionType } from '../../../lib/propTypes'
import { astToString } from '../../../lib/util'
import contentSelectors from '../../../store/selectors/content'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const SectionNav = ({ prev, next }) => (
  <div>
    {
      prev.path !== null && (
        <SectionLink sectionId={prev.path}>
          <a title={astToString(prev.title)} className={[css.sbtn, css.prev].join(' ')}>
            <Icon size="huge" name="angle left" />
          </a>
        </SectionLink>
      )
    }
    {
      next.path !== null && (
        <SectionLink sectionId={next.path}>
          <a title={astToString(next.title)} className={[css.sbtn, css.next].join(' ')}>
            <Icon size="huge" name="angle right" />
          </a>
        </SectionLink>
      )
    }
  </div>
)

// TODO: that is how it should look like after #29 is closed
// const mapStateToProps = (state) => {
//     prevSection: contentSelectors.getPrevSection(state),
//     nextSection: contentSelectors.getNextSection(state),
// }

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
