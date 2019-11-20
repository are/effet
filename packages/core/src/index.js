import { Construct } from './Construct'

/**
 * This is the main juice of the library.
 * This function behaves similarily to `pipe` - it is a variadic function
 * that accepts operators as arguments.
 *
 * @param  {...[Operator]}
 * @return {Construct}
 */
export const construct = (...operators) => new Construct(operators)
export { Construct }

/**
 * This is a test class.
 */
export class Test {}
