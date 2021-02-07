import { Functor } from './Functor'

export interface Monad<A> extends Functor<A> {
  chain: <B>(fn: ((value: A) => B)) => B
}
