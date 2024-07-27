import type { RouteMethod } from '../../interface'

export function Auth(target: object, propertyKey: string): void {
  // TODO: apply no duplicate decorator, and not GET POST PUT,... in the same method
  const routesMethod: RouteMethod[] = Reflect.getMetadata(
    'routes',
    target.constructor,
  )
  Reflect.defineMetadata(
    'routes',
    routesMethod.map(route => ({ ...route, auth: true })),
    target.constructor,
  )
}
