export interface Setoid<A = any> {
/**
 * @description equals :: Setoid a => a ~> a -> Boolean
 */
  equals: (a: A) => boolean

/**
 * @description notEquals :: Setoid a => a ~> a -> Boolean
 */
  notEquals?: (a: A) => boolean
}

export const setoid = <
  A, 
  B extends (arg: A) => Setoid<A>
> (setoid: B) => ({
  reflexivity: (b: A) => setoid(b).equals(b) === true,

  symmetry: (a: A, b: A) => setoid(a).equals(b) === setoid(b).equals(a),

  transitivity: (a: A, b: A, c: A) => (
    setoid(a).equals(b) 
    && setoid(b).equals(c) 
    && setoid(a).equals(c)
  )
})
