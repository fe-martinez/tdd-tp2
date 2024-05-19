import { evaluateCondition } from "./conditionsEvaluator";
import { Condition } from "../model/types";
import { ConditionType } from "../model/conditionTypeEnum";

jest.mock('./operations', () => ({
  getOperation: jest.fn().mockImplementation((name) => {
    if (name === '==') {
      return (args: any[]) => args[0] === args[1];
    } else if  (name === '+') {
      return (args: any[]) => (args as number[]).reduce((acc, val) => acc + val, 0);
    }
  }),
}));

describe('evaluateCondition', () => {
  it('should evaluate a CONSTANT condition', () => {
    const condition: Condition = { type: ConditionType.CONSTANT, value: 42 };
    const result = evaluateCondition(condition, {});
    expect(result).toBe(42);
  });

  it('should evaluate a VARIABLE condition', () => {
    const condition: Condition = { type: ConditionType.VARIABLE, name: 'x' };
    const variables = { x: 42 };
    const result = evaluateCondition(condition, variables);
    expect(result).toBe(42);
  });

  it('should evaluate a CALL condition', () => {
    const condition: Condition = {
      type: ConditionType.CALL,
      name: '==',
      arguments: [
        { type: ConditionType.CONSTANT, value: 20 },
        { type: ConditionType.CONSTANT, value: 20 }
      ]
    };
    const result = evaluateCondition(condition, {});
    expect(result).toBe(true);
  });

  it('should throw an error for an unknown condition type', () => {
    const condition: any = { type: 'MATE' };
    expect(() => evaluateCondition(condition, {})).toThrow();
  });

  it('should evaluate a CALL condition with nested arguments', () => {
    const condition: Condition = {
      type: ConditionType.CALL,
      name: '+',
      arguments: [
        {
          type: ConditionType.CALL,
          name: '+',
          arguments: [
            {
              type: ConditionType.CALL,
              name: '+',
              arguments: [
                { type: ConditionType.CONSTANT, value: 10 },
                { type: ConditionType.CONSTANT, value: 5 }
              ]
            },
            {
              type: ConditionType.CALL,
              name: '+',
              arguments: [
                { type: ConditionType.CONSTANT, value: 20 },
                { type: ConditionType.CONSTANT, value: 30 }
              ]
            }
          ]
        },
        { type: ConditionType.CONSTANT, value: 50 }
      ]
    };
    const result = evaluateCondition(condition, {});
    expect(result).toBe(115);
  });

  it('should evaluate a false CALL condition correctly', () => {
    const condition: Condition = {
      type: ConditionType.CALL,
      name: '==',
      arguments: [
        { type: ConditionType.CONSTANT, value: 10 },
        { type: ConditionType.CONSTANT, value: 20 }
      ]
    };
    const result = evaluateCondition(condition, {});
    expect(result).toBe(false);
  });

  it('should throw an error for a CALL condition with an undefined operation', () => {
    const condition: Condition = {
      type: ConditionType.CALL,
      name: 'undefined',
      arguments: [
        { type: ConditionType.CONSTANT, value: 10 },
        { type: ConditionType.CONSTANT, value: 20 }
      ]
    };
    expect(() => evaluateCondition(condition, {})).toThrow();
  });

  it('should handle a CALL condition with no arguments', () => {
    const condition: Condition = { type: ConditionType.CALL, name: '+', arguments: [] };
    const result = evaluateCondition(condition, {});
    expect(result).toBe(0);
  });

  it('should handle a CALL condition with more than two arguments', () => {
    const condition: Condition = {
      type: ConditionType.CALL,
      name: '+',
      arguments: [
        { type: ConditionType.CONSTANT, value: 1 },
        { type: ConditionType.CONSTANT, value: 2 },
        { type: ConditionType.CONSTANT, value: 3 },
        { type: ConditionType.CONSTANT, value: 4 },
        { type: ConditionType.CONSTANT, value: 5 },
      ],
    };
    const result = evaluateCondition(condition, {});
    expect(result).toBe(15);
  });



});