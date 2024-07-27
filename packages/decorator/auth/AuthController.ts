export function AuthController() {
  return (target: object) => {
    Reflect.defineMetadata('auth', true, target)
  }
}
