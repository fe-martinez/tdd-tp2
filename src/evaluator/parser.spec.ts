import fs from 'fs';
import { parseRules, collectPairsFromRuleSet, extractExchangePairs } from './parser';
import { RuleSet, Rule, Condition, CallCondition, DataCondition } from './types';
import {  ConditionType } from './conditionTypeEnum';
jest.mock('fs');

describe('parser.ts', () => {
  const mockRuleSet: RuleSet = {
    rules: [
      {
        name: 'rule1',
        condition: {
          type: ConditionType.CALL,
          name: 'someOperation',
          arguments: [
            {
              type: ConditionType.DATA,
              symbol: 'BTCUSD',
              since: 1577836800, 
              until: 1609459199, // timestamp 
            } as DataCondition,
            {
              type: ConditionType.CALL,
              name: 'nestedOperation',
              arguments: [
                {
                  type: ConditionType.DATA,
                  symbol: 'ETHUSD',
                  since: 1577836800, // timestamp 
                  until: 1609459199, // timestamp 
                } as DataCondition,
              ],
            } as CallCondition,
          ],
        },
        action: [
          {
            type: 'BUY_MARKET',
            symbol: 'BTCUSD',
            amount: {
              type: ConditionType.CONSTANT,
              value: 1
            } as Condition
          }
        ]
      } as Rule,
    ],
    variables: {},
  };

  beforeEach(() => {
    (fs.readFileSync as jest.Mock).mockReturnValue(JSON.stringify(mockRuleSet));
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('parseRules', () => {
    it('should parse rules from a JSON file', () => {
      const filePath = 'path/to/rules.json';
      const ruleSet = parseRules(filePath);
      expect(fs.readFileSync).toHaveBeenCalledWith(filePath, 'utf8');
      expect(ruleSet).toEqual(mockRuleSet);
    });
  });

  describe('collectPairsFromRuleSet', () => {
    it('should collect all exchange pairs from a rule set', () => {
      const pairs = collectPairsFromRuleSet(mockRuleSet);
      expect(pairs).toEqual(['BTCUSD', 'ETHUSD']);
    });
  });

  describe('extractExchangePairs', () => {
    it('should extract exchange pairs from a rule', () => {
      const rule: Rule = mockRuleSet.rules[0];
      const pairs = extractExchangePairs(rule);
      expect(pairs).toEqual(['BTCUSD', 'ETHUSD']);
    });
  });

  describe('traverse', () => {
    it('should traverse a CALL condition and collect pairs', () => {
      const condition: CallCondition = {
        type: ConditionType.CALL,
        name: 'someOperation',
        arguments: [
          {
            type: ConditionType.DATA,
            symbol: 'BTCUSD',
            since: 1577836800, // timestamp for 2020-01-01T00:00:00Z
            until: 1609459199, // timestamp for 2020-12-31T23:59:59Z
          } as DataCondition,
          {
            type: ConditionType.CALL,
            name: 'nestedOperation',
            arguments: [
              {
                type: ConditionType.DATA,
                symbol: 'ETHUSD',
                since: 1577836800, // timestamp for 2020-01-01T00:00:00Z
                until: 1609459199, // timestamp for 2020-12-31T23:59:59Z
              } as DataCondition,
            ],
          } as CallCondition,
        ],
      };
      const pairs: string[] = [];
      const traverse = jest.requireActual('./parser').traverse;
      traverse(condition, pairs);
      expect(pairs).toEqual(['BTCUSD', 'ETHUSD']);
    });

    it('should throw an error for an unknown condition type', () => {
      const condition: any = { type: 'UNKNOWN' };
      const pairs: string[] = [];
      const traverse = jest.requireActual('./parser').traverse;
      expect(() => traverse(condition, pairs)).toThrow();
    });
  });

  describe('handleCallCondition', () => {
    it('should handle call conditions and collect pairs', () => {
      const condition: CallCondition = {
        type: ConditionType.CALL,
        name: 'someOperation',
        arguments: [
          {
            type: ConditionType.DATA,
            symbol: 'BTCUSD',
            since: 1577836800, // timestamp for 2020-01-01T00:00:00Z
            until: 1609459199, // timestamp for 2020-12-31T23:59:59Z
          } as DataCondition,
          {
            type: ConditionType.CALL,
            name: 'nestedOperation',
            arguments: [
              {
                type: ConditionType.DATA,
                symbol: 'ETHUSD',
                since: 1577836800, // timestamp for 2020-01-01T00:00:00Z
                until: 1609459199, // timestamp for 2020-12-31T23:59:59Z
              } as DataCondition,
            ],
          } as CallCondition,
        ],
      };
      const pairs: string[] = [];
      const handleCallCondition = jest.requireActual('./parser').handleCallCondition;
      handleCallCondition(condition, pairs);
      expect(pairs).toEqual(['BTCUSD', 'ETHUSD']);
    });
  });

  describe('handleDataCondition', () => {
    it('should handle data conditions and collect pairs', () => {
      const condition: DataCondition = {
        type: ConditionType.DATA,
        symbol: 'BTCUSD',
        since: 1577836800, // timestamp for 2020-01-01T00:00:00Z
        until: 1609459199, // timestamp for 2020-12-31T23:59:59Z
      };
      const pairs: string[] = [];
      const handleDataCondition = jest.requireActual('./parser').handleDataCondition;
      handleDataCondition(condition, pairs);
      expect(pairs).toEqual(['BTCUSD']);
    });
  });
});
