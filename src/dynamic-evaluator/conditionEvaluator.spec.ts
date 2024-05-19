import { ConditionType } from "../evaluator/conditionTypeEnum";
import { Rule, RuleSet } from "../evaluator/types";
import fs from 'fs';
import { ConditionEvaluator } from "./conditionEvaluator";

const ruleSet1: RuleSet = {
    variables: {
      "LIMIT_VALUE_BTC/USDT": 65000
    },
    rules: [
      {
        name: "Escape",
        condition: {
          type: ConditionType.CALL,
          name: "<",
          arguments: [
            {
              type: ConditionType.CALL,
              name: "MAX",
              arguments: [
                {
                  type: ConditionType.CONSTANT,
                  value: 5000
                },
                {
                    type: ConditionType.CONSTANT,
                    value: 3000
                }
              ]
            },
            {
              type: ConditionType.VARIABLE,
              name: "LIMIT_VALUE_BTC/USDT"
            }
          ]
        },
        action: [
          {
            type: "SELL_MARKET",
            symbol: "BTC/USDT",
            amount: {
              type: ConditionType.CONSTANT,
              value: 1
            }
          }
        ]
      }
    ]
};

jest.mock('fs', () => ({
    readFileSync: jest.fn((filePath) => {
      switch (filePath) {
        case 'src/rules.json':
          return JSON.stringify({ rules: ruleSet1 });
        default:
          return null;
      }
    }),
  }));
  

describe('ConditionEvaluator', () => {
    
    it('should evaluate a simple condition', () => {
        const { ConditionEvaluator } = require('./conditionEvaluator');
        const ruleSet: RuleSet = ruleSet1;
        console.log(ruleSet);
        const conditionEvaluator: ConditionEvaluator = new ConditionEvaluator(ruleSet);
        const result = conditionEvaluator.evaluateCondition('Escape');
        expect(result).toBe(false);
    });
});

  