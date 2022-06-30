import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { Button, Dropdown, Menu } from 'antd'
import Icon, { DownOutlined } from '@ant-design/icons'
import LanguageOutlineSvg from 'ionicons/dist/svg/language-outline.svg'

import { changeLanguage } from '@innodoc/client-store/src/actions/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { useTranslation } from 'next-i18next'

import css from './style.sss'

const LanguageSwitcher = () => {
  const { t } = useTranslation()
  const course = useSelector(courseSelectors.getCurrentCourse)
  const { language: currentLanguage } = useSelector(appSelectors.getApp)
  const dispatch = useDispatch()

  const languageList = course && course.languages ? course.languages : []
  const languageOptions = languageList.map((lang) => (
    <Menu.Item
      className={classNames({ [css.active]: lang === currentLanguage })}
      key={lang}
      onClick={() => dispatch(changeLanguage(lang, currentLanguage))}
    >
      {t(`languages.${lang}`)}
    </Menu.Item>
  ))

  const menu = <Menu>{languageOptions}</Menu>

  return (
    <Dropdown overlay={menu} trigger={['click']}>
      <Button icon={<Icon component={LanguageOutlineSvg} />}>
        {t('common.language')} <DownOutlined />
      </Button>
    </Dropdown>
  )
}

export default LanguageSwitcher
