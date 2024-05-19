import { ConditionType } from "../model/conditionTypeEnum";
import { Rule, RuleSet } from "../model/types";
import { ConditionEvaluator } from "./conditionEvaluator";
import { executeRuleSet } from "./rulesEvaluator";

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

const ruleSet2: RuleSet = {
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
                                value: 67000
                            },
                            {
                                type: ConditionType.CONSTANT,
                                value: 40000
                            },
                            {
                                type: ConditionType.CONSTANT,
                                value: 55000
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
                    type: "SET_VARIABLE",
                    name: "LIMIT_VALUE_BTC/USDT",
                    value: {
                        type: ConditionType.CONSTANT,
                        value: 70000
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

    it('should evaluate true the first time and false the second time', () => {
        const { ConditionEvaluator } = require('./conditionEvaluator');
        const ruleSet: RuleSet = ruleSet2;
        console.log(ruleSet);
        const conditionEvaluator: ConditionEvaluator = new ConditionEvaluator(ruleSet);
        let result = conditionEvaluator.evaluateCondition('Escape');
        expect(result).toBe(true);
        executeRuleSet(conditionEvaluator);
        let variableValue = conditionEvaluator.getVariable('LIMIT_VALUE_BTC/USDT');
        expect(variableValue).toBe(70000);

        result = conditionEvaluator.evaluateCondition('Escape');
        expect(result).toBe(false);
    });

});

