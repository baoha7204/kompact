import express, { NextFunction, Router } from "express";
import { Redis } from "ioredis";
import { DatabaseConnector } from "./database/database-connector";
import { Singleton } from "./decorator";
import { Request, Response } from "./interface";

@Singleton()
export class KompactApp {
  private app = express();
  private router = new Map<string, Router>();
  public middlewares: Array<
    (req: Request, res: Response, next: NextFunction) => void
  > = [];
  constructor(private readonly controllers: any[]) {
    this.controllers.forEach((controller) => {
      const instance = new controller();
      const path: string = Reflect.getMetadata("path", controller);
      const routes: string[] = Reflect.getMetadata("routes", controller);
      const router = express.Router();
      routes.forEach((route: any) => {
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
    this.middlewares.forEach((middleware) => {
      this.app.use(middleware);
    });
    this.router.forEach((router, path) => {
      this.app.use(path, router);
    });
    this.app.listen(port, callback);
  }
  public middleware(
    middleware: (req: Request, res: Response, next: NextFunction) => void
  ): this {
    this.middlewares.push(middleware);
    return this;
  }
}
