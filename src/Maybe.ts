import { Apply, Monad, Setoid } from './FantasyLandSpec'


interface Maybe<A> extends Apply<A>, Monad<A>, Setoid<A> {
  isNothing: () => boolean
  toString: () => string
}

export const Maybe = <A>(value: A): Maybe<A> => ({
  isNothing: () => value === undefined || value === null,

  equals: (a: A) => value === a,

  notEquals: (a: A) => value !== a,

  map: <B>(fn: (value: A) => B) => {
    return Maybe.of(value).isNothing()
      ? Maybe.of(null)
      : Maybe.of(fn(value))
  },

  chain: <B>(fn: (value: A) => B) => fn(value),

  ap: (b: any) => b.chain((f: any) => Maybe.of(value).map(f)),

  toString: () => `Maybe(${value})`
})

Maybe.of = Maybe