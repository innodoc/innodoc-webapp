import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'antd/lib/icon'
import Menu from 'antd/lib/menu'

import { changeLanguage } from '../../../../store/actions/i18n'
import appSelectors from '../../../../store/selectors'
import courseSelectors from '../../../../store/selectors/course'
import { useTranslation } from '../../../../lib/i18n'

const LanguageSwitcher = (props) => {
  const { t } = useTranslation()
  const course = useSelector(courseSelectors.getCurrentCourse)
  const { language: currentLanguage } = useSelector(appSelectors.getApp)
  const dispatch = useDispatch()

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
      <Menu.Item key={`language-${lang}`} onClick={() => dispatch(changeLanguage(lang, currentLanguage))}>
        {t(`languages.${lang}`)}
      </Menu.Item>
    )
  )

  return (
    <Menu.SubMenu title={title} {...props}>
      {languageOptions}
    </Menu.SubMenu>
  )
}

export default LanguageSwitcher
