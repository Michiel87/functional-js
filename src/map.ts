import { curry } from './curry'

export function map<A, B> (f: (a: A) => B, fa: A[]): B[]
export function map<A, B> (f: (a: A) => B): (fa: A[]) => B[]

/**
 * @description Functor f => (a → b) → f a → f b
 */

export function map (...args: any) {
  return curry((f: any, fa: any) => fa.map(f))(...args)
}
