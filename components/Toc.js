import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Menu } from 'semantic-ui-react'

import { loadToc } from '../store/actions/content'
import { contentType, tocTreeType } from '../lib/propTypes'
import SectionLink from './SectionLink'
import ContentFragment from './ContentFragment'

const TocItem = ({ title, sectionId, subSections }) => {
  if (!subSections.length) {
    return (
      <SectionLink sectionId={sectionId}>
        <Menu.Item as="a">
          <ContentFragment content={title} />
        </Menu.Item>
      </SectionLink>
    )
  }
  return (
    <Menu.Item>
      <SectionLink sectionId={sectionId}>
        <a>
          <ContentFragment content={title} />
        </a>
      </SectionLink>
      <Menu.Menu>
        {
          subSections.map(
            (subSection, i) => (
              <TocItem
                title={subSection.title}
                sectionId={`${sectionId}/${subSection.id}`}
                subSections={subSection.children}
                key={i.toString()}
              />
            )
          )
        }
      </Menu.Menu>
    </Menu.Item>
  )
}
TocItem.propTypes = {
  title: contentType.isRequired,
  sectionId: PropTypes.string.isRequired,
  subSections: PropTypes.arrayOf(PropTypes.object),
}
TocItem.defaultProps = { subSections: [] }

class Toc extends React.Component {
  static propTypes = {
    toc: tocTreeType.isRequired,
    as: PropTypes.func.isRequired,
    dispatchLoadToc: PropTypes.func.isRequired,
  }

  static defaultProps = {
    ...React.Component.defaultProps,
    as: Menu,
    toc: {},
  }

  componentDidMount() {
    this.props.dispatchLoadToc()
  }

  render() {
    const {
      toc,
      as: ElementType,
      dispatchLoadToc,
      ...otherProps
    } = this.props

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
}

const mapStateToProps = state => ({ toc: state.content.toc })
const mapDispatchToProps = dispatch => ({
  dispatchLoadToc: () => dispatch(loadToc()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Toc)
