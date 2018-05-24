import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react'

import { contentType } from '../../lib/propTypes'
import SectionLink from '../SectionLink'
import ContentFragment from '../Content/ContentFragment'

const Item = ({ title, sectionId, subSections }) => {
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
              <Item
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

Item.propTypes = {
  title: contentType.isRequired,
  sectionId: PropTypes.string.isRequired,
  subSections: PropTypes.arrayOf(PropTypes.object),
}

Item.defaultProps = { subSections: [] }

export default Item
