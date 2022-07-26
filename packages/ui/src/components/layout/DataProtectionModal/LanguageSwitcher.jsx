import Icon, { DownOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
import classNames from 'classnames'
import LanguageOutlineSvg from 'ionicons/dist/svg/language-outline.svg'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'

import { selectCourse } from '@innodoc/store/selectors/content'

import css from './LanguageSwitcher.module.sss'

function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const { language: currentLanguage } = i18n
  const course = useSelector(selectCourse)

  const languageList = course && course.languages ? course.languages : []
  const languageOptions = languageList.map((lang) => (
    <Menu.Item
      className={classNames({ [css.active]: lang === currentLanguage })}
      key={lang}
      onClick={() => i18n.changeLanguage(lang)}
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
