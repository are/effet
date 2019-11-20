import { Constructor } from './Constructor'

/**
 * This is the main juice of the library.
 * This function behaves similarily to `pipe` - it is a variadic function
 * that accepts operators as arguments.
 *
 * @param  {...[Operator]}
 * @return {Constructor}
 */
export const construct = (...operators) => new Constructor(operators)
export { Constructor }
