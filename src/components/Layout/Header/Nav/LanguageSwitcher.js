import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'
import { useTranslation } from 'react-i18next'

import { changeLanguage } from '../../../../store/actions/i18n'
import { courseType } from '../../../../lib/propTypes'
import courseSelectors from '../../../../store/selectors/course'

const LanguageSwitcher = ({
  course,
  dispatchChangeLanguage,
  ...otherProps
}) => {
  const { t } = useTranslation()

  const title = (
    <span>
      <Icon type="global" />
      <span>
        {t('header.language')}
      </span>
    </span>
  )

  const languageList = course && course.languages ? course.languages : []
  const languageOptions = languageList.map(
    lang => (
      <Menu.Item key={`language-${lang}`} onClick={() => dispatchChangeLanguage(lang)}>
        {t(`languages.${lang}`)}
      </Menu.Item>
    )
  )

  return (
    <Menu.SubMenu title={title} {...otherProps}>
      {languageOptions}
    </Menu.SubMenu>
  )
}

LanguageSwitcher.propTypes = {
  course: courseType,
  dispatchChangeLanguage: PropTypes.func.isRequired,
}

LanguageSwitcher.defaultProps = {
  course: null,
}

const mapStateToProps = state => ({
  course: courseSelectors.getCurrentCourse(state),
})

const mapDispatchToProps = {
  dispatchChangeLanguage: changeLanguage,
}

export { LanguageSwitcher as BareLanguageSwitcher } // for testing
export default connect(mapStateToProps, mapDispatchToProps)(LanguageSwitcher)
