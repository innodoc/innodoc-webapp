import Icon from '@ant-design/icons'
import { Menu } from 'antd'
import classNames from 'classnames'
import LanguageOutlineSvg from 'ionicons/dist/svg/language-outline.svg'
import { useTranslation } from 'next-i18next'
import { useSelector, useDispatch } from 'react-redux'

import { changeLanguage } from '@innodoc/store/actions/i18n'
import { getCurrentCourse } from '@innodoc/store/selectors/course'
import { getApp } from '@innodoc/store/selectors/misc'

import cssActiveItem from '../LinkMenuItem/LinkMenuItem.module.sss'

import css from './SecondMenu.module.sss'

function LanguageSwitcher(props) {
  const { t } = useTranslation()
  const course = useSelector(getCurrentCourse)
  const { language: currentLanguage } = useSelector(getApp)
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
