import Icon from '@ant-design/icons'
import { Menu } from 'antd'
import classNames from 'classnames'
import LanguageOutlineSvg from 'ionicons/dist/svg/language-outline.svg'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'

import { selectCourse } from '@innodoc/store/selectors/content'

import cssActiveItem from '../LinkMenuItem/LinkMenuItem.module.sss'

import css from './SecondMenu.module.sss'

function LanguageSwitcher(props) {
  const { t, i18n } = useTranslation()
  const { changeLanguage, language } = i18n

  const course = useSelector(selectCourse)

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
      className={classNames({ [cssActiveItem.active]: lang === language })}
      key={lang}
      onClick={() => changeLanguage(lang)}
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
