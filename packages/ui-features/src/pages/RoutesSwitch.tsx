import type { ComponentType } from 'react'
import { Redirect, Route, Switch } from 'wouter'
import type { RouteManager } from '@innodoc/shared-core/routes'
import type { FrontendRouteName } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import { useSelector } from '@innodoc/ui-shared/store-hooks'
import CourseContentPage from './course/CourseContentPage.js'
import CourseHomeRedirect from './course/CourseHomeRedirect.js'
import CourseProgressPage from './course/CourseProgressPage.js'
import CourseSectionPage from './course/CourseSectionPage/CourseSectionPage.js'
import CourseTocPage from './course/CourseTocPage.js'
import ErrorPage from './ErrorPage.js'
import IndexPage from './IndexPage.js'
import LoginPage from './user/LoginPage.js'

interface RouteEntry<C extends ComponentType = ComponentType> {
  component: C
}

type RouteRegistry = Record<FrontendRouteName, RouteEntry>

const routeRegistry: RouteRegistry = {
  'app:course:index': { component: CourseHomeRedirect },
  'app:index': { component: IndexPage },
  'app:course:glossary': { component: () => null }, // TODO
  'app:course:page': { component: CourseContentPage },
  'app:course:progress': { component: CourseProgressPage },
  'app:course:section': { component: CourseSectionPage },
  'app:course:toc': { component: CourseTocPage },
  'app:user:login': { component: LoginPage },
  'app:user:forgot-password': { component: ErrorPage }, // TODO
  'app:user:sign-up': { component: ErrorPage }, // TODO
}

interface RoutesSwitchProps {
  routeManager: RouteManager
}

interface PageComponentProps {
  routeName: FrontendRouteName
}

function PageComponent({ routeName }: PageComponentProps) {
  const Component = routeRegistry[routeName].component

  return <Component />
}

/**
 * The root path (`/`) has no locale. Server-side this is handled with a 302;
 * this covers client-side navigations to `/` by redirecting to the current
 * locale (which the server/client then route to index or course home).
 */
function RootRedirect() {
  const routeInfo = useSelector(selectRouteInfo)
  return <Redirect to={`/${routeInfo.locale}`} replace />
}

function RoutesSwitch({ routeManager }: RoutesSwitchProps) {
  const frontendRoutes = routeManager.getFrontendRoutes()
  const routeEntries = Object.entries(frontendRoutes) as [FrontendRouteName, string][]

  const routes = routeEntries.map(([name, path]) => (
    <Route key={name} path={path}>
      <PageComponent routeName={name} />
    </Route>
  ))

  return (
    <Switch>
      <Route path="/">
        <RootRedirect />
      </Route>
      {routes}
    </Switch>
  )
}

export default RoutesSwitch
