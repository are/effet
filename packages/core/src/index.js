import { Constructor } from './Constructor'

export const construct = (...operators) => new Constructor(operators)
export { Constructor }
