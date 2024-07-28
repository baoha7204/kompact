import type express from 'express'

export type Request = express.Request
export type Response = express.Response
export type NextFunction = express.NextFunction
export type Next = express.NextFunction
export type Middleware = (req: Request, res: Response, next: Next) => void
export type Class = new (...args: any[]) => any
