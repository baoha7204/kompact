// import { Request, RequestHandler, Response } from 'express'

// export function Body(): RequestHandler {
//   return (req: Request, _: Response, next) => {
//     Reflect.defineMetadata('body', req.body, req)
//     next()
//   }
// }

// export function GetBody(
//   target: any,
//   propertyKey: string,
//   parameterIndex: number,
// ) {
//   const existingParameters: number[] =
//     Reflect.getOwnMetadata('body', target, propertyKey) || []
//   existingParameters.push(parameterIndex)
//   Reflect.defineMetadata('body', existingParameters, target, propertyKey)
// }
