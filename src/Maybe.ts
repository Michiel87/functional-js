interface Apply<T> {

}

type Setoid = null | undefined | string | number | boolean

/**
 * @description equals :: Setoid a => a ~> a -> Boolean
 */
interface IsEqual<A extends Setoid> {
  equals: (a: A) => boolean
  notEquals: (a: A) => boolean
}

interface Functor<A> {
  map: <B>(fn: ((value: A) => B)) => Functor<B>
}

interface Monad<A> extends Functor<A> {
  chain: <B>(fn: ((value: A) => B)) => B
}

interface Maybe<A extends Setoid> extends Monad<A>, IsEqual<A> {
  isNothing: () => boolean
  ap: any
  toString: () => string
}

export const Maybe = <A extends Setoid>(value: A): Maybe<A> => ({
  isNothing: () => value === undefined || value === null,

  equals: (a: A) => value === a,

  notEquals: (a: A) => value !== a,

  map: <B extends Setoid>(fn: (value: A) => B) => {
    return Maybe.of(value).isNothing()
      ? Maybe.of(null)
      : Maybe.of(fn(value))
  },

  chain: <B>(fn: (value: A) => B) => fn(value),

  ap: (b: any) => b.chain((f: any) => Maybe.of(value).map(f)),

  toString: () => `Maybe(${value})`
})

Maybe.of = Maybe