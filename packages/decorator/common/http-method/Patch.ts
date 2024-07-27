export function Patch(path?: string) {
  return (target: object, propertyKey: string) => {
    if (!Reflect.hasMetadata('routes', target.constructor)) {
      Reflect.defineMetadata('routes', [], target.constructor)
    }
    const routes = Reflect.getMetadata('routes', target.constructor)
    routes.push({
      method: 'patch',
      path: path ?? '',
      action: target[propertyKey as keyof typeof target],
    })
  }
}
