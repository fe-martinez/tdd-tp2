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
                name: ">",
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
                name: ">",
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

// Create an interesting rule set with multiple rules involving different currencies and conditions
const ruleSet3: RuleSet = {
    variables: {
        "LIMIT_VALUE_BTC/USDT": 65000,
        "LIMIT_VALUE_ETH/USDT": 3000
    },
    rules: [
        {
            name: "Rule1",
            condition: {
                type: ConditionType.CALL,
                name: ">",
                arguments: [
                    {
                        type: ConditionType.CALL,
                        name: "-",
                        arguments: [
                            {
                                type: ConditionType.CONSTANT,
                                value: 107000
                            },
                            {
                                type: ConditionType.CONSTANT,
                                value: 40000
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
        },
        {
            name: "Rule2Data",
            condition: {
                type: ConditionType.CALL,
                name: ">",
                arguments: [
                    {
                        type: ConditionType.CALL,
                        name: "MAX",
                        arguments: [
                            {
                                type: ConditionType.DATA,
                                symbol: "ETH/USDT",
                                since: 3600,
                                until: 0
                            }
                        ]
                    },
                    {
                        type: ConditionType.VARIABLE,
                        name: "LIMIT_VALUE_ETH/USDT"
                    }
                ]
            },
            action: [
                {
                    type: "SELL_MARKET",
                    symbol: "ETH/USDT",
                    amount: {
                        type: ConditionType.CONSTANT,
                        value: 1
                    }
                },
                {
                    type: "SET_VARIABLE",
                    name: "LIMIT_VALUE_ETH/USDT",
                    value: {
                        type: ConditionType.CONSTANT,
                        value: 8000
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

// Mock the getHistoricalData function
jest.mock('../data/database', () => ({
    getHistoricalPairValues: jest.fn((symbol, since, until) => {
        return [1000, 2000, 3000, 4000, 5000, 6000, 7000];
    }),
}));

jest.mock('../notifier/notificationSender', () => {
    return jest.fn().mockImplementation(() => {
        return {notify: jest.fn()};
    });
});

describe('ConditionEvaluator', () => {
    const MessageNotifier = require('../notifier/notificationSender');

    it('should evaluate a simple condition', () => {
        const { ConditionEvaluator } = require('./conditionEvaluator');
        const ruleSet: RuleSet = ruleSet1;
        const conditionEvaluator: ConditionEvaluator = new ConditionEvaluator(ruleSet);
        const result = conditionEvaluator.evaluateCondition('Escape');
        expect(result).toBe(false);
    });

    it('should evaluate true the first time and false the second time', () => {
        const { ConditionEvaluator } = require('./conditionEvaluator');
        const ruleSet: RuleSet = ruleSet2;
        const conditionEvaluator: ConditionEvaluator = new ConditionEvaluator(ruleSet);
        let result = conditionEvaluator.evaluateCondition('Escape');
        expect(result).toBe(true);

        conditionEvaluator.setVariable('LIMIT_VALUE_BTC/USDT', 70000);
        result = conditionEvaluator.evaluateCondition('Escape');

        expect(result).toBe(false);
    });

    it('should evaluate a condition with historical data correctly in different instances without recompiling', () => {
        const { ConditionEvaluator } = require('./conditionEvaluator');
        const ruleSet: RuleSet = ruleSet3;
        const conditionEvaluator: ConditionEvaluator = new ConditionEvaluator(ruleSet);
        const result = conditionEvaluator.evaluateCondition("Rule2Data");
        expect(result).toBe(true);
        conditionEvaluator.setVariable('LIMIT_VALUE_ETH/USDT', 10000);
        const result2 = conditionEvaluator.evaluateCondition("Rule2Data");
        expect(result2).toBe(false);
    });



});

