import { ConditionType } from "../evaluator/conditionTypeEnum";
import { Rule, RuleSet } from "../evaluator/types";
import fs from 'fs';


// Mock rules for testing
const mockRule1: RuleSet = {
    variables: {},
    rules: [
    {
      name: "FirstRuleFirstTest",
      condition: {
        type: ConditionType.CALL,
        name: ">",
        arguments: [
          {
            type: ConditionType.DATA,
            symbol: "BTC/USD",
            since: 7200,
            until: 0
          },
          {
            type: ConditionType.DATA,
            symbol: "ETH/USD",
            since: 3600,
            until: 0
          }
        ]
      },
      action: []
    },
    {
      name: "SecondRuleFirstTest",
      condition: {
        type: ConditionType.CALL,
        name: "AND",
        arguments: [
          {
            type: ConditionType.CALL,
            name: ">",
            arguments: [
              {
                type: ConditionType.DATA,
                symbol: "BTC/USD",
                since: 7200,
                until: 3600
              },
              {
                type: ConditionType.DATA,
                symbol: "BTC/USD",
                since: 10800,
                until: 7200
              }
            ]
          },
          {
            type: ConditionType.VARIABLE,
            name: "ALREADY_SOLD"
          }
        ]
      },
      action: []
    }
    ]
};
  
const mockRule2: RuleSet = {
    variables: {},
    rules: [
        {
            name: "FirstRuleSecondTest",
            condition: {
                type: ConditionType.CALL,
                name: ">",
                arguments: [
                    {
                        type: ConditionType.DATA,
                        symbol: "ETH/USD",
                        since: 7200,
                        until: 0
                    },
                    {
                        type: ConditionType.DATA,
                        symbol: "LTC/USD",
                        since: 3600,
                        until: 0
                    }
                ]
            },
            action: []
        }
    ]
};

const mockRule3: RuleSet = {
    variables: {},
    rules: [
        {
            name: "SecondRuleFirstTest",
            condition: {
                type: ConditionType.CALL,
                name: "AND",
                arguments: [
                    {
                        type: ConditionType.CALL,
                        name: ">",
                        arguments: [
                            {
                                type: ConditionType.CALL,
                                name: "NOT",
                                arguments: [
                                    {
                                        type: ConditionType.DATA,
                                        symbol: "BTC/USD",
                                        since: 7200,
                                        until: 0
                                    }
                                ]
                            },
                            {
                                type: ConditionType.DATA,
                                symbol: "ETH/USD",
                                since: 3600,
                                until: 0
                            }
                        ]
                    },
                    {
                        type: ConditionType.CALL,
                        name: "<",
                        arguments: [
                            {
                                type: ConditionType.DATA,
                                symbol: "LTC/USD",
                                since: 7200,
                                until: 0
                            },
                            {
                                type: ConditionType.DATA,
                                symbol: "XRP/USD",
                                since: 3600,
                                until: 0
                            }
                        ]
                    }
                ]
            },
            action: []
        }
    ]
};
  
describe('ConditionEvaluator', () => {
    
    it('should evaluate a simple condition', () => {
        const { ConditionEvaluator } = require('./conditionEvaluator');
        const RuleSet = JSON.parse(fs.readFileSync('src/rules.json', 'utf8'))
        const conditionEvaluator = new ConditionEvaluator(RuleSet);
        const result = conditionEvaluator.evaluateCondition('Escape', {});
        expect(result).toBe(true);
    });
  
    it('should evaluate a complex condition', () => {
        const { ConditionEvaluator } = require('./conditionEvaluator');
        const RuleSet = JSON.parse(fs.readFileSync('src/rules.json', 'utf8'))
        const conditionEvaluator = new ConditionEvaluator(RuleSet);
        const result = conditionEvaluator.evaluateCondition('Escape', { ALREADY_SOLD: true });
        expect(result).toBe(true);
    });
  
    it('should evaluate a condition from a different file', () => {
        const { ConditionEvaluator } = require('./conditionEvaluator');
        const RuleSet = JSON.parse(fs.readFileSync('src/rules.json', 'utf8'))
        const conditionEvaluator = new ConditionEvaluator(RuleSet);
        const result = conditionEvaluator.evaluateCondition('Escape', {});
        expect(result).toBe(true);
    });
  
    it('should evaluate a complex condition from a different file', () => {
        const { ConditionEvaluator } = require('./conditionEvaluator');
        const RuleSet = JSON.parse(fs.readFileSync('src/rules.json', 'utf8'))
        const conditionEvaluator = new ConditionEvaluator(RuleSet);
        const result = conditionEvaluator.evaluateCondition('Escape', {});
        expect(result).toBe(true);
    });
});

  