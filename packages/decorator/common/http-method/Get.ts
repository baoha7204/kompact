export function Get(path?: string): ReturnType<HttpMethodDecorator> {
  return function (target: any, propertyKey: string) {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }
    const routes = Reflect.getMetadata("routes", target.constructor);
    routes.push({
      method: "get",
      path: path || "",
      action: target[propertyKey],
    });
  };
}
