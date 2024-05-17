import { Value } from './types';

const equal = (args: Value[]): boolean =>
  args.every((value, i, arr) => i === 0 || value === arr[i - 1]);

const distinct = (args: Value[]): boolean =>
  new Set(args).size === args.length;

const sum = (args: Value[]): number =>
  (args as number[]).reduce((acc, val) => acc + val, 0);

const greaterThan = (args: Value[]): boolean =>
  args.every((value, i, arr) => i === 0 || (value as number) > (arr[i - 1] as number));

const defaultOperation = (...args: Value[]): never => {
  throw new Error('Unsupported operation');
};

const lessThan = (args: Value[]): boolean =>
  args.every((value, i, arr) => i === 0 || (value as number) < (arr[i - 1] as number));

const greaterOrEqualThan = (args: Value[]): boolean =>
  args.every((value, i, arr) => i === 0 || (value as number) >= (arr[i - 1] as number));

export const getOperation = (name: string): ((args: Value[]) => Value) => {
  const operations: Record<string, (args: Value[]) => Value> = {
    '==': equal,
    'DISTINCT': distinct,
    '+': sum,
    '>': greaterThan,
    '<': lessThan,
    '>=': greaterOrEqualThan,
  };

  const operation = operations[name] || defaultOperation;
  return operation;
};