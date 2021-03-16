import groupBy from 'lodash/groupBy'

import { curry } from './curry'

export function partitionBy <A> (by: keyof A, data: A[]): A[][]
export function partitionBy <A> (by: keyof A): (data: A[]) => A[][]

/**
 * @description String -> [a] -> [[a]]
 */

export function partitionBy (...args: any) {
  return curry((by: any, data: any) => Object.values(groupBy(data, by)))(...args)
}
