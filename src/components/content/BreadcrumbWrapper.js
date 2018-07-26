import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Breadcrumb } from 'semantic-ui-react'

import { selectors } from '../../../store/reducers/content'

class BreadcrumbWrapper extends React.Component {
  static propTypes = {
    titles: PropTypes.array.isRequired,
  }

  static defaultProps = {
    titles: [],
  }

  render() {
    const sections = titles.map((title, idx, arr) => {
      return idx == arr.length - 1
        ? (
          <Breadcrumb.Section active key={idx.toString()}>
            title
          </Breadcrumb.Section>
        )
        : (
          <Breadcrumb.Section link key={idx.toString()}>
            title
          </Breadcrumb.Section>
        )
    })

    return (
      <Breadcrumb>
        {sections}
      </Breadcrumb>
    )
  }
}

const mapStateToProps = (state) => {
  return { titles: selectors.getCurrentTOCTitles(state) }
}

export default connect(mapStateToProps)(BreadcrumbWrapper)