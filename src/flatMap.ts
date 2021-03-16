import { curry } from './curry'

export function flatMap<A, B> (f: (a: A) => B[], fa: A[]): B[]
export function flatMap<A, B> (f: (a: A) => B[]): (fa: A[]) => B[]

/**
 * @description FlatMap m => (a → m b) → m a → m b
 */

export function flatMap (...args: any) {
  return curry((f: any, fa: any) => fa.flatMap(f))(...args)
}
