export function Controller(path: string): ClassDecorator
export function Controller(options: {
  path: string
  auth?: boolean
}): ClassDecorator

export function Controller(
  arg: string | { path: string; auth?: boolean },
): ClassDecorator {
  return (target: object) => {
    if (typeof arg === 'string') {
      Reflect.defineMetadata('path', `/${arg}`, target)
    } else {
      Reflect.defineMetadata('path', `/${arg.path}`, target)
      if (arg.auth) {
        Reflect.defineMetadata('auth', arg.auth, target)
      }
    }
  }
}
