export type PartialType<T> = {
  [P in keyof T]?: T[P]
}
