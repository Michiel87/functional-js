import { setoid } from '../FantasyLandSpec'
import { Maybe } from '../Maybe'

describe('Maybe', () => {
  describe('setoid laws', () => {
    const laws = setoid(Maybe)
    
    it('should respect reflexivity', () => {
      expect(laws.reflexivity(10)).toBeTruthy()
    })

    it('should respect symmetry/commutativity ', () => {
      expect(laws.symmetry(10, 10)).toBeTruthy()
    })

    it('should respect transitivity', () => {
      expect(laws.transitivity(10, 10, 10)).toBeTruthy()
    })
  })

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


  // it('should protect against empty values', () => {
  //   const double = (x: number) => x * 2

  //   expect(Maybe(10).map(double).chain(x => x)).toBe(20)
  //   expect(Maybe(null).map(double).chain(x => x)).toBeNull()
  //   expect(Maybe(undefined).map(double).chain(x => x)).toBeNull()
  // })
})