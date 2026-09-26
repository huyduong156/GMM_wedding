import { marketingRoutes, statusRoutes, studioRoutes } from '../../../shared/config/routes'

export type StatusKind = 'unauthorized' | 'forbidden' | 'not-found' | 'server-error'

export const statusPathToKind: Record<string, StatusKind> = {
  [statusRoutes.unauthorized]: 'unauthorized',
  [statusRoutes.forbidden]: 'forbidden',
  [statusRoutes.notFound]: 'not-found',
  [statusRoutes.serverError]: 'server-error',
}

export const statusHome = (kind: StatusKind) =>
  kind === 'unauthorized' ? marketingRoutes.login : studioRoutes.home
