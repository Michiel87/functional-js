import { curry } from './curry'

export function filter<T, S extends T> (
  predicate: (value: T, index: number, array: T[]) => value is S
): (fa: T[]) => S[]

export function filter<T> (
  predicate: (value: T, index: number, array: T[]) => unknown
): (fa: T[]) => T[]

export function filter<T, S extends T> (
  predicate: (value: T, index: number, array: T[]) => value is S,
  fa: T[]
): S[]

export function filter<T> (
  predicate: (value: T, index: number, array: T[]) => unknown,
  fa: T[]
): T[]

/**
 * @description Filterable f => (a → Boolean) → f a → f a
 */

export function filter (...args: any) {
  return curry((predicate: any, fa?: any[]) => fa.filter(predicate))(...args)
}
