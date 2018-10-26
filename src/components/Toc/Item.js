import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react'

import { contentType } from '../../lib/propTypes'
import SectionLink from '../SectionLink'
import ContentFragment from '../content/ContentFragment'

const Item = ({
  title,
  language,
  sectionPath: sectionPathFragment,
  subSections,
  sectionPrefix,
}) => {
  const sectionPath = `${sectionPrefix}${sectionPathFragment}`
  if (subSections.length < 1) {
    return (
      <SectionLink sectionPath={sectionPath}>
        <Menu.Item as="a">
          <ContentFragment content={title} />
        </Menu.Item>
      </SectionLink>
    )
  }
  return (
    <Menu.Item>
      <SectionLink sectionPath={sectionPath}>
        <a>
          <ContentFragment content={title} />
        </a>
      </SectionLink>
      <Menu.Menu>
        {
          subSections.map(
            (subSection, i) => (
              <Item
                title={subSection.title[language]}
                sectionPath={`${sectionPath}/${subSection.id}`}
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
  language: PropTypes.string.isRequired,
  sectionPath: PropTypes.string.isRequired,
  subSections: PropTypes.arrayOf(PropTypes.object),
  sectionPrefix: PropTypes.string,
}

Item.defaultProps = {
  subSections: [],
  sectionPrefix: '',
}

export default Item
