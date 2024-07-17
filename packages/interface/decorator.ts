export type HttpMethodDecorator = (
  path?: string,
  body?: HttpMethodDecorator
) => (target: any, propertyKey: string) => void;

export type RouteMethod = {
  method: "get" | "post" | "put" | "patch";
  path: string;
  action: FunctionConstructor;
};
