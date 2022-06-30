import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { Menu } from 'antd'
import Icon from '@ant-design/icons'
import LanguageOutlineSvg from 'ionicons/dist/svg/language-outline.svg'

import { changeLanguage } from '@innodoc/client-store/src/actions/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { useTranslation } from 'next-i18next'

import css from './style.sss'
import cssActiveItem from '../LinkMenuItem/style.sss'

const LanguageSwitcher = (props) => {
  const { t } = useTranslation()
  const course = useSelector(courseSelectors.getCurrentCourse)
  const { language: currentLanguage } = useSelector(appSelectors.getApp)
  const dispatch = useDispatch()

  const titleText = t('common.language')
  const title = (
    <span title={titleText}>
      <Icon component={LanguageOutlineSvg} />
      <span className={css.menuLabel}>{titleText}</span>
    </span>
  )

  const languageList = course && course.languages ? course.languages : []
  const languageOptions = languageList.map((lang) => (
    <Menu.Item
      className={classNames({ [cssActiveItem.active]: lang === currentLanguage })}
      key={lang}
      onClick={() => dispatch(changeLanguage(lang, currentLanguage))}
    >
      {t(`languages.${lang}`)}
    </Menu.Item>
  ))

  return (
    <Menu.SubMenu
      title={title}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {languageOptions}
    </Menu.SubMenu>
  )
}

export default LanguageSwitcher
