import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import classNames from 'classnames'
import { Button, Dropdown, Menu } from 'antd'
import { DownOutlined, GlobalOutlined } from '@ant-design/icons'

import { changeLanguage } from '@innodoc/client-store/src/actions/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'
import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { useTranslation } from '@innodoc/client-misc/src/i18n'

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
      <Button icon={<GlobalOutlined />}>
        {t('common.language')} <DownOutlined />
      </Button>
    </Dropdown>
  )
}

export default LanguageSwitcher