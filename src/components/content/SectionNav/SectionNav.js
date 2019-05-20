import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Icon from 'antd/lib/icon'

import sectionSelectors from '../../../store/selectors/section'
import SectionLink from '../../SectionLink'
import css from './style.sass'

const SectionNav = ({ prevId, nextId }) => (
  <React.Fragment>
    {
      prevId
        ? (
          <SectionLink sectionId={prevId}>
            <a className={css.prev}>
              <Icon type="arrow-left" />
            </a>
          </SectionLink>
        )
        : null
    }
    {
      nextId
        ? (
          <SectionLink sectionId={nextId}>
            <a className={css.next}>
              <Icon type="arrow-right" />
            </a>
          </SectionLink>
        )
        : null
    }
  </React.Fragment>
)

SectionNav.propTypes = {
  prevId: PropTypes.string,
  nextId: PropTypes.string,
}

SectionNav.defaultProps = {
  prevId: undefined,
  nextId: undefined,
}

const mapStateToProps = state => sectionSelectors.getNextPrevSections(state)

export { SectionNav as BareSectionNav, mapStateToProps } // for testing
export default connect(mapStateToProps)(SectionNav)
