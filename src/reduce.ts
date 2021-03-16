import { curry } from './curry'

export function reduce <A, B, C extends (acc: A, next: B) => A>(fn: C, init: A, data: B[]): A
export function reduce <A, B, C extends (acc: A, next: B) => A>(fn: C, init: A): (data: B[]) => A
export function reduce <A, B, C extends (acc: A, next: B) => A>(
  fn: C
): (init: A) => (data: B[]) => A

/**
 * @description ((a, b) → a) → a → [b] → a
 */
export function reduce (...args: any) {
  return curry((fn: any, init: any, data: any) => data.reduce(fn, init))(...args)
}
