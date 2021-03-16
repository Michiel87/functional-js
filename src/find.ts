import { curry } from './curry'

export const exists = <T>(x: T) => x != null

export function find<T> (predicate: (a: T) => boolean, list: T[]): T[]
export function find<T> (predicate: (a: T) => boolean): (list: T[]) => T[]

/**
 * @description (a → Boolean) → [a] → [a]
 * find returns a single result encapsulated in array.
 *
 * @example
 * // If result will log 10
 * find(x => x === 10)).map(console.log)
 */

export function find (...args: any) {
  return curry((predicate: any, list: any) => [list.find(predicate)].filter(exists))(...args)
}
