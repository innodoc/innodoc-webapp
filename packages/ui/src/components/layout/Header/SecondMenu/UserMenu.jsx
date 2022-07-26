import {
  LockOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Menu } from 'antd'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'

import LinkMenuItem from '../LinkMenuItem/LinkMenuItem.jsx'

import css from './SecondMenu.module.sss'

const menuItems = {
  loggedIn: [
    {
      href: '/change-password',
      Icon: LockOutlined,
      title: 'user.changePassword.title',
    },
    {
      href: '/delete-account',
      Icon: UserDeleteOutlined,
      title: 'user.deleteAccount.title',
    },
    {
      href: '/logout',
      Icon: LogoutOutlined,
      title: 'user.logout.title',
    },
  ],
  loggedOut: [
    {
      href: '/login',
      Icon: LoginOutlined,
      title: 'user.login.title',
    },
    {
      href: '/register',
      Icon: UserAddOutlined,
      title: 'user.registration.title',
    },
  ],
}

function UserMenu(props) {
  const loggedInEmail = undefined

  const router = useRouter()
  const { t } = useTranslation()

  const titleText = loggedInEmail || t('common.account')
  const titleLabel = loggedInEmail ? <strong>{titleText}</strong> : titleText
  const menuTitle = (
    <span title={titleText}>
      <UserOutlined />
      <span className={css.menuLabel}>{titleLabel}</span>
    </span>
  )

  const items = menuItems[loggedInEmail ? 'loggedIn' : 'loggedOut'].map(({ href, Icon, title }) => (
    <LinkMenuItem
      href={href}
      icon={<Icon />}
      itemActive={router.pathname === href}
      key={href}
      title={t(title)}
    />
  ))

  return (
    <Menu.SubMenu
      title={menuTitle}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {items}
    </Menu.SubMenu>
  )
}

export default UserMenu
