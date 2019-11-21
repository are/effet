import { Chain } from './Chain'

/**
 * This is the main juice of the library.
 * This function behaves similarily to `pipe` - it is a variadic function
 * that accepts operators as arguments.
 *
 * @param  {...[Operator]}
 * @return {Chain}
 */
export const construct = (...operators) => new Chain(operators)
export { Chain }
