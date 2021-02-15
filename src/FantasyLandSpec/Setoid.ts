export interface Setoid<A = any> {
/**
 * @description equals :: Setoid a => a ~> a -> Boolean
 */
  ['fantasy-land/equals']: (a: A) => boolean
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
  reflexivity: (b: A) => setoid(b)['fantasy-land/equals'](b) === true,

  symmetry: (a: A, b: A) => setoid(a)['fantasy-land/equals'](b) === setoid(b)['fantasy-land/equals'](a),

  transitivity: (a: A, b: A, c: A) => (
    setoid(a)['fantasy-land/equals'](b) 
    && setoid(b)['fantasy-land/equals'](c) 
    && setoid(a)['fantasy-land/equals'](c)
  )
})
