import React from 'react'
import PropTypes from 'prop-types'
import Tree from 'antd/lib/tree'

import { contentType } from '../../lib/propTypes'
import SectionLink from '../SectionLink'
import ContentFragment from '../content/ContentFragment'

const Item = ({
  title,
  sectionPath: sectionPathFragment,
  subSections,
  sectionPrefix,
}) => {
  const sectionPath = `${sectionPrefix}${sectionPathFragment}`
  if (subSections.length < 1) {
    return <Tree.TreeNode title={title} />
    // <SectionLink sectionPath={sectionPath}>
    //   <ContentFragment content={title} />
    // </SectionLink>
  }
  const titleElem = (
    <SectionLink sectionPath={sectionPath}>
      <ContentFragment content={title} />
    </SectionLink>
  )
  return (
    <Tree.TreeNode title={titleElem} key={sectionPath}>
      {
        subSections.map(
          (subSection) => {
            const subSectionPath = `${sectionPath}/${subSection.id}`
            return (
              <Item
                title={subSection.title}
                sectionPath={subSectionPath}
                subSections={subSection.children}
                key={subSectionPath}
              />
            )
          }
        )
      }
    </Tree.TreeNode>
  )
}

Item.propTypes = {
  title: contentType.isRequired,
  sectionPath: PropTypes.string.isRequired,
  subSections: PropTypes.arrayOf(PropTypes.object),
  sectionPrefix: PropTypes.string,
}

Item.defaultProps = {
  subSections: [],
  sectionPrefix: '',
}

export default Item
