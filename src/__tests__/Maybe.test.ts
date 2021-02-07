import { Maybe } from '../Maybe'

describe('Maybe', () => {
  describe('monad laws', () => {
    it('should respect left identity law', () => {
      const double = (x: number) => x * 2

      expect(Maybe(10).chain(double)).toBe(double(10))
    })

    it('should respect right identity law', () => {
      expect(Maybe(10).chain(Maybe.of).toString()).toEqual(Maybe(10).toString())
    })

    it('should respect associativity identity law', () => {
      const double = (x: number) => Maybe(x * 2)
      const increment = (x: number) => Maybe(x + 1)

      expect(Maybe(10).chain(double).chain(increment).toString())
        .toEqual(Maybe(10).chain(x => double(x).chain(increment)).toString())
    })
  })

  describe('setoid laws', () => {
    it('should respect reflexivity', () => {
      const a = 10
      expect(Maybe(a).equals(a)).toBeTruthy()
    })

    it('should respect symmetry/commutativity ', () => {
      const a = 10
      const b = 10
      expect(Maybe(a).equals(b)).toBeTruthy()
      expect(Maybe(b).equals(a)).toBeTruthy()
    })

    it('should respect transitivity', () => {
      const a = 10
      const b = 10
      const c = 10
      expect(Maybe(a).equals(b)).toBeTruthy()
      expect(Maybe(b).equals(c)).toBeTruthy()
      expect(Maybe(a).equals(c)).toBeTruthy()
    })
  })


  it('should protect against empty values', () => {
    const double = (x: number) => x * 2

    expect(Maybe(10).map(double).chain(x => x)).toBe(20)
    expect(Maybe(null).map(double).chain(x => x)).toBeNull()
    expect(Maybe(undefined).map(double).chain(x => x)).toBeNull()
  })
})