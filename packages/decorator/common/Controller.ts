export function Controller(path: string) {
  return function (target: any) {
    Reflect.defineMetadata("path", `/${path}`, target);
  };
}
