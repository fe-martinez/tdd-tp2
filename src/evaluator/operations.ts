import { Value } from './types';

const equal = (args: Value[]): boolean =>
  args.every((value, i, arr) => i === 0 || value === arr[i - 1]);

const distinct = (args: Value[]): boolean =>
  new Set(args).size === args.length;

const sum = (args: Value[]): number =>
  (args as number[]).reduce((acc, val) => acc + val, 0);

const defaultOperation = (...args: Value[]): never => {
  throw new Error('Unsupported operation');
};

export const getOperation = (name: string): ((args: Value[]) => Value) => {
  const operations: Record<string, (args: Value[]) => Value> = {
    '==': equal,
    'DISTINCT': distinct,
    '+': sum
  };

  const operation = operations[name] || defaultOperation;
  return operation;
};