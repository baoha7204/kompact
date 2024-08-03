import { PARAM_KEY } from '../decorator'
import { Request, Response, RouteMethod } from '../interface'

export const extractReqParams = (
  instanceController: any,
  route: RouteMethod,
  req: Request,
  res: Response,
) => {
  const prototype: object = Object.getPrototypeOf(instanceController)
  const paramMetadata = Reflect.getMetadata(
    PARAM_KEY,
    prototype,
    route.methodName,
  )
  const args: any[] = []
  paramMetadata.forEach(({ index, name }: { index: number; name: string }) => {
    // incase if name is undefined = @Param() params: object
    args[index] = req.params[name] || req.params
  })
  instanceController[route.action.name](...args, res)
}
