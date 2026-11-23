/**
 * Make all properties in T optional, but now seriously. Similar to Partial<>
 */
export type Optional<T> = {
  [P in keyof T]: T[P] | null | undefined;
};
