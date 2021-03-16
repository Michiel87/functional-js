import { curry } from './curry'

export function prepend <T> (a: T, fa: T[]): T[]
export function prepend <T> (a: T): (fa: T[]) => T[]

/**
 * @description a → [a] → [a]
 */

export function prepend (...args: any) {
  return curry((a: any, fa: any) => [a, ...fa])(...args)
}
