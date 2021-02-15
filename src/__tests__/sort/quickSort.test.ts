import { quickSort } from '../../sort'

const Ord = (value: number) => ({
  ['fantasy-land/equals']: (num: number) => value === num,
  equals (num: number) {
    return this['fantasy-land/equals'](num)
  },
  ['fantasy-land/lte']: (num: number) => value <= num,
  lte (num: number) {
    return this['fantasy-land/lte'](num)
  },
  valueOf: () => value
})

Ord.of = Ord

describe('quickSort', () => {
  var items = [5,3,7,6,2,9].map(Ord)

  it('should sort Ord items', () => {
    expect(quickSort(items).map(item => item.valueOf())).toEqual([2,3,5,6,7,9])
  }, 10000)
})