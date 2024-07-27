import type express from 'express'

export type Request = express.Request
export type Response = express.Response
export type NextFunction = express.NextFunction
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export type AuthRequest<T extends any> = express.Request & { user: T }
export type Next = express.NextFunction
export type Middleware = (req: Request, res: Response, next: Next) => void
export type Class = new (...args: any[]) => any
