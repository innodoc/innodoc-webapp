import Icon, { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
import classNames from 'classnames'
import LanguageOutlineSvg from 'ionicons/dist/svg/language-outline.svg'
import { useTranslation } from 'next-i18next'
import { useSelector, useDispatch } from 'react-redux'

import { changeLanguage } from '@innodoc/store/actions/i18n'
import { getCurrentCourse } from '@innodoc/store/selectors/course'
import { getApp } from '@innodoc/store/selectors/misc'

import css from './LanguageSwitcher.module.sss'

function LanguageSwitcher() {
  const { t } = useTranslation()
  const course = useSelector(getCurrentCourse)
  const { language: currentLanguage } = useSelector(getApp)
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
