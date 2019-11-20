export function unwrap<T>(p: T | undefined | null) {
  return p as T;
}
