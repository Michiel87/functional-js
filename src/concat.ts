import { curry } from "./curry"

import { curry } from './curry'

export function concat<A> (groupA: A[], groupB: A[]): A[]
export function concat<A> (groupA: A[]): (groupB: A[]) => A[]

/**
 * @description [a] → [a] → [a] | String → String → String
 */

export function concat<A> (...args: any) {
  return curry((groupA: A[], groupB: A[]) => groupA.concat(groupB))(...args)
}
