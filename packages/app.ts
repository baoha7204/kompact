import express from "express";
import { Singleton } from "./decorator";

@Singleton()
export class BespokeApp {
  private app = express();
  constructor(private readonly controllers: any[]) {
    this.controllers.forEach((controller) => {
      const instance = new controller();
      const path = Reflect.getMetadata("path", controller);
      console.log(`path `, path);
      const routes = Reflect.getMetadata("routes", controller);
      const router = express.Router();
      routes.forEach((route: any) => {
        console.log(controller);
        // @ts-ignore
        router[route.method](route.path, (req: Request, res: Response) => {
          // @ts-ignore
          instance[route.action.name](req, res);
        });
      });

      this.app.use(path, router);
    });
  }
  public start(port: number, callback?: () => void) {
    this.app.listen(port, callback);
  }
}
