import { RouteMethod } from "../../../interface";

export function Get(path?: string) {
  return function (target: any, propertyKey: string) {
    // target is {}, target.constructor to get its class
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }
    const routes: RouteMethod[] = Reflect.getMetadata(
      "routes",
      target.constructor
    );
    routes.push({
      method: "get",
      path: path || "",
      action: target[propertyKey],
    });
  };
}
