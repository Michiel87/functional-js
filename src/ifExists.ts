import { exists } from './find'

// @todo type and work out
export const ifExists = (value: any) => exists(value)
  ? Promise.resolve(value)
  : Promise.reject(`Invalid value: ${value}`)
  