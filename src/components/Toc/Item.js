import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react'

import { contentType } from '../../lib/propTypes'
import SectionLink from '../SectionLink'
import ContentFragment from '../content/ContentFragment'

const Item = ({
  title,
  sectionId,
  subSections,
  sectionPrefix,
}) => {
  const fullSectionId = `${sectionPrefix}${sectionId}`
  if (!subSections.length) {
    return (
      <SectionLink sectionId={fullSectionId}>
        <Menu.Item as="a">
          <ContentFragment content={title} />
        </Menu.Item>
      </SectionLink>
    )
  }
  return (
    <Menu.Item>
      <SectionLink sectionId={fullSectionId}>
        <a>
          <ContentFragment content={title} />
        </a>
      </SectionLink>
      <Menu.Menu>
        {
          subSections.map(
            (subSection, i) => (
              <Item
                title={subSection.title}
                sectionId={`${fullSectionId}/${subSection.id}`}
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

Item.propTypes = {
  title: contentType.isRequired,
  sectionId: PropTypes.string.isRequired,
  subSections: PropTypes.arrayOf(PropTypes.object),
  sectionPrefix: PropTypes.string,
}

Item.defaultProps = {
  subSections: [],
  sectionPrefix: '',
}

export default Item
