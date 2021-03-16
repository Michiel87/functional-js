import { pipe, reduce, concat, map } from '../'

describe('concat', () => {
  it('should concat arrays', () => {
    expect(reduce(concat, [], [[1],[2]])).toEqual([1,2])
  })
})
