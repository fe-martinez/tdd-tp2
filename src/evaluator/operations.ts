import { Value } from './types';

const equal = (args: Value[]): boolean =>
  args.length > 0
  ? args.every((value, i, arr) => i === 0 || value === arr[i - 1])
  : (() => { throw new Error('Invalid number of arguments') })();

const distinct = (args: Value[]): boolean =>
  args.length > 0
  ? new Set(args).size === args.length
  : (() => { throw new Error('Invalid number of arguments') })();

const sum = (args: Value[]): number =>
  args.length > 0
  ? (args as number[]).reduce((acc, val) => acc + val, 0)
  : (() => { throw new Error('Invalid number of arguments') })();

const greaterThan = (args: Value[]): boolean =>
  args.length > 0
  ? args.every((value, i, arr) => i === 0 || (value as number) > (arr[i - 1] as number))
  : (() => { throw new Error('Invalid number of arguments') })();

const lessThan = (args: Value[]): boolean =>
  args.length > 0
  ? args.every((value, i, arr) => i === 0 || (value as number) < (arr[i - 1] as number))
  : (() => { throw new Error('Invalid number of arguments') })();

const greaterOrEqualThan = (args: Value[]): boolean =>
  args.length > 0
  ? args.every((value, i, arr) => i === 0 || (value as number) >= (arr[i - 1] as number))
  : (() => { throw new Error('Invalid number of arguments') })();

const lessOrEqualThan = (args: Value[]): boolean =>
  args.length > 0
  ? args.every((value, i, arr) => i === 0 || (value as number) <= (arr[i - 1] as number))
  : (() => { throw new Error('Invalid number of arguments') })();

const negate = (args: Value[]): number =>
  args.length === 1 ? -(args[0] as number) : NaN;

const subtract = (args: Value[]): number =>
  args.length === 2
  ? (args[0] as number) - (args[1] as number)
  : (() => { throw new Error('Invalid number of arguments') })();

const divide = (args: Value[]): number =>
  args.length === 2
  ? (args[0] as number) / (args[1] as number)
  : (() => { throw new Error('Invalid number of arguments') })();

const multiply = (args: Value[]): number => 
  args.length > 0
  ? (args as number[]).reduce((acc, val) => acc * val, 1)
  : (() => { throw new Error('Invalid number of arguments') })();

const min = (args: Value[]): number => 
  args.length > 0
  ? Math.min(...(args as number[]))
  : (() => { throw new Error('Invalid number of arguments') })();

const max = (args: Value[]): number =>
  args.length > 0
  ? Math.max(...(args as number[]))
  : (() => { throw new Error('Invalid number of arguments') })();

const first = (args: Value[]): Value =>
  args.length > 0
  ? args[0]
  : (() => { throw new Error('Invalid number of arguments') })();
  
const last = (args: Value[]): Value =>
  args.length > 0
  ? args[args.length - 1]
  : (() => { throw new Error('Invalid number of arguments') })();
  
const not = (args: Value[]): boolean =>
  args.length === 1
  ?
  !args[0] as boolean
  : (() => { throw new Error('Invalid number of arguments') })();

const and = (args: Value[]): boolean =>
  args.length > 0
  ? args.every(val => typeof val === 'boolean' ? val : false)
  : (() => { throw new Error('Invalid number of arguments') })();

const or = (args: Value[]): boolean =>
  args.length === 0
  ? (() => { throw new Error('Invalid number of arguments') })()
  : args.some(val => typeof val === 'boolean' ? val : false);

const average = (args: Value[]): number =>
  sum(args) / args.length;
  
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
    '/': divide,
    '*': multiply,
    'MIN': min,
    'MAX': max,
    'FIRST': first,
    'LAST': last,
    'NOT': not,
    'AND': and,
    'OR': or,
    'AVERAGE': average,
  };

  const operation = operations[name] || defaultOperation;
  return operation;
};