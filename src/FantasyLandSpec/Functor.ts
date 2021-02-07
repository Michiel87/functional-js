export interface Functor<A> {
  map: <B>(fn: ((value: A) => B)) => Functor<B>
}
