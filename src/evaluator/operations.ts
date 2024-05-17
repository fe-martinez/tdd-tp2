import { Value } from './types';

const equal = (args: Value[]): boolean =>
  args.every((value, i, arr) => i === 0 || value === arr[i - 1]);

const distinct = (args: Value[]): boolean =>
  new Set(args).size === args.length;

const sum = (args: Value[]): number =>
  (args as number[]).reduce((acc, val) => acc + val, 0);

const greaterThan = (args: Value[]): boolean =>
  args.every((value, i, arr) => i === 0 || (value as number) > (arr[i - 1] as number));

const lessThan = (args: Value[]): boolean =>
  args.every((value, i, arr) => i === 0 || (value as number) < (arr[i - 1] as number));

const greaterOrEqualThan = (args: Value[]): boolean =>
  args.every((value, i, arr) => i === 0 || (value as number) >= (arr[i - 1] as number));

const lessOrEqualThan = (args: Value[]): boolean =>
  args.every((value, i, arr) => i === 0 || (value as number) <= (arr[i - 1] as number));

const negate = (args: Value[]): number =>
  args.length === 1 ? -(args[0] as number) : NaN;

const subtract = (args: Value[]): number => {
  if (args.length === 2) {
    return (args[0] as number) - (args[1] as number)
  }
  throw new Error('Invalid number of arguments');
}

const defaultOperation = (...args: Value[]): never => {
  throw new Error('Unsupported operation');
};

export const getOperation = (name: string): ((args: Value[]) => Value) => {
  const operations: Record<string, (args: Value[]) => Value> = {
    '==': equal,
    'DISTINCT': distinct,
    '+': sum,
    '>': greaterThan,
    '<': lessThan,
    '>=': greaterOrEqualThan,
    '<=': lessOrEqualThan,
    'NEGATE': negate,
    '-': subtract,
  };

  const operation = operations[name] || defaultOperation;
  return operation;
};