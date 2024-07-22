import express, { NextFunction, Router } from "express";
import { Redis } from "ioredis";
import { DatabaseConnector } from "./database/database-connector";
import { Singleton } from "./decorator";
import { Request, Response, RouteMethod } from "./interface";
import { logger } from "./logger";
import { v4 as uuidv4 } from "uuid";
import { HttpError } from "./error";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
@Singleton()
export class KompactApp {
  private app = express();
  private router = new Map<string, Router>();
  private middlewares: Array<
    (req: Request, res: Response, next: NextFunction) => void
  > = [];
  constructor(private readonly controllers: any[]) {
    this.controllers.forEach((controller) => {
      const instance = new controller();
      const path: string = Reflect.getMetadata("path", controller);
      const routes: RouteMethod[] = Reflect.getMetadata("routes", controller);
      const router = express.Router();
      routes.forEach((route) => {
        // @ts-ignore
        router[route.method](route.path, (req: Request, res: Response) => {
          // @ts-ignore
          instance[route.action.name](req, res);
        });
      });
      this.router.set(path, router);
    });
    // this.app.get("/", (_, res) => {
    //   res.send(`Hello World`);
    // });
  }
  public addRedis(redisClient: Redis): this {
    redisClient.connect().catch(console.error);
    return this;
  }
  public addDatabase(database: DatabaseConnector): this {
    database.connect().then(console.log).catch(console.error);
    return this;
  }

  public start(port: number, callback?: () => void) {
    // init some utils middleware
    this.app.use(express.json()); // json body parser
    this.app.use(morgan("dev")); // morgan log
    this.app.use(helmet()); // help secure Express apps by setting HTTP response headers.
    this.app.use(compression()); // compress file
    this.middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });

    // logging
    this.app.use((req, _, next) => {
      const requestId = req.headers["x-request-id"];
      req.requestId = requestId ? requestId : uuidv4();
      logger.log(`Input params type ${req.method}`, {
        context: req.path,
        requestId: req.requestId,
        metadata: req.method === "POST" ? req.body : req.query,
      });
      next();
    });

    this.router.forEach((router, path) => {
      this.app.use(path, router);
    });

    // handling error, this middleware after a define routes
    this.app.use((_, __, next) => {
      const error = new HttpError("Not found", 404);
      next(error);
    });

    this.app.use(
      (error: HttpError, req: Request, res: Response, next: NextFunction) => {
        // Add log for error
        const errorMessage = `Error ${
          error.status
        } - ${Date.now()}ms - Response: ${JSON.stringify(error)}`;

        logger.error(errorMessage, {
          context: req.path,
          requestId: req.requestId || uuidv4(),
          metadata: { message: error.message },
        });

        res.status(error.status).json({
          status: "error",
          code: error.status,
          stack: error.stack, // for development env
          message: error.message || "Internal Server Error",
        });
      }
    );
    this.app.listen(port, callback);
  }
  public middleware(
    middleware: (req: Request, res: Response, next: NextFunction) => void
  ): this {
    this.middlewares.push(middleware);
    return this;
  }
}
