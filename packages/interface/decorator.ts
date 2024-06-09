type HttpMethodDecorator = (
  path?: string,
  body?: HttpMethodDecorator
) => (target: any, propertyKey: string) => void;
