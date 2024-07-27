import type { RouteMethod } from '../../interface'

export function Auth(
  target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor,
): void {
  const method = descriptor.value

  descriptor.value = function (req: Request, _: Response) {
    const currentUserIndexes: number[] =
      Reflect.getOwnMetadata('currentUser', target, propertyKey) || []

    // eslint-disable-next-line prefer-rest-params
    const args = Array.from(arguments)
    currentUserIndexes.forEach(index => {
      // @ts-expect-error: This assigned user when user is auth
      args[index] = req.user
    })

    return method.apply(this, args)
  }
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
