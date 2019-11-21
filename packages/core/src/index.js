import { Effect } from './Effect'

/**
 * This is the main juice of the library.
 * This function behaves similarily to `pipe` - it is a variadic function
 * that accepts operators as arguments.
 *
 * @param  {...[Operator]}
 * @return {Effect}
 */
export const construct = (...operators) => {
    const effect = new Effect()
    effect.operators = operators

    return effect
}

export { Effect }
