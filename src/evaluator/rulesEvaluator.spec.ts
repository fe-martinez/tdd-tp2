import { evaluateRules, executeAction } from './rulesEvaluator';
import { Condition,  Action, RuleSet, Value } from './types';
import {  ConditionType } from './conditionTypeEnum';

describe('rulesEvaluator', () => {
  describe('evaluateRules', () => {
    it('should evaluate rules and execute actions', () => {
      const mockRuleSet: RuleSet = {
        rules: [
          {
            name: 'rule1',
            condition: {
              type: ConditionType.CONSTANT,
              value: true,
            },
            action: [
              {
                type: 'BUY_MARKET',
                symbol: 'BTCUSD',
                amount: {
                  type: ConditionType.CONSTANT,
                  value: 1,
                },
              },
            ],
          },
          {
            name: 'rule2',
            condition: {
              type: ConditionType.CONSTANT,
              value: false,
            },
            action: [
              {
                type: 'SELL_MARKET',
                symbol: 'ETHUSD',
                amount: {
                  type: ConditionType.CONSTANT,
                  value: 0.5,
                },
              },
            ],
          },
        ],
        variables: {},
      };

      const consoleSpy = jest.spyOn(console, 'log');

      evaluateRules(mockRuleSet);

      expect(consoleSpy).toHaveBeenCalledWith('Compre BTCUSD!');
      expect(consoleSpy).not.toHaveBeenCalledWith('Vendi ETHUSD!');

      consoleSpy.mockRestore();
    });
  });

  describe('executeAction', () => {
    it('should execute a BUY_MARKET action', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const action: Action = {
        type: 'BUY_MARKET',
        symbol: 'BTCUSD',
        amount: {
          type: ConditionType.CONSTANT,
          value: 2,
        },
      };
      const variables: { [name: string]: Value } = {};

      executeAction(action, variables);

      expect(consoleSpy).toHaveBeenCalledWith('Compre BTCUSD!');

      consoleSpy.mockRestore();
    });

    it('should execute a SELL_MARKET action', () => {
      const consoleSpy = jest.spyOn(console, 'log');
      const action: Action = {
        type: 'SELL_MARKET',
        symbol: 'ETHUSD',
        amount: {
          type: ConditionType.CONSTANT,
          value: 0.5,
        },
      };
      const variables: { [name: string]: Value } = {};

      executeAction(action, variables);

      expect(consoleSpy).toHaveBeenCalledWith('Vendi ETHUSD!');

      consoleSpy.mockRestore();
    });

    it('should execute a SET_VARIABLE action', () => {
        const action: Action = {
          type: 'SET_VARIABLE',
          name: 'myVariable',
          value: {
            type: ConditionType.CONSTANT,
            value: 42,
          },
        };
      
        const variables: { [name: string]: Value } = {};
        executeAction(action, variables);
      
        expect(variables['myVariable']).toEqual(42);
      });

    it('should throw an error for an unsupported action type', () => {
      const action: any = {
        type: 'UNSUPPORTED_ACTION',
        symbol: 'BTCUSD',
        amount: {
          type: ConditionType.CONSTANT,
          value: 1,
        },
      };
      const variables: { [name: string]: Value } = {};

      expect(() => executeAction(action, variables)).toThrow('Unsupported action type');
    });
  });
});