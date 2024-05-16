import { createPairRules, extractExchangePairs } from './parser';
import { Rule } from './types';
import { ConditionType } from './conditionTypeEnum';

// Mock rules for testing
const mockRule1: Rule[] = [
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
];

const mockRule2: Rule[] = [
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
];

const mockRule3: Rule[] = [
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
];

// Mock fs module
jest.mock('fs', () => ({
  readFileSync: jest.fn((filePath) => {
    switch (filePath) {
      case 'src/rules.json':
        return JSON.stringify({ rules: mockRule1 });
      case 'src/rules2.json':
        return JSON.stringify({ rules: mockRule2 })
      default:
        return null;
      case 'src/rules3.json':
        return JSON.stringify({ rules: mockRule3})
    }
  }),
}));

describe('Parser module', () => {
  it('should correctly extract exchange pairs from a rule', () => {
    const rule = mockRule1[0];
    const pairs = extractExchangePairs(rule);
    expect(pairs).toEqual(["BTC/USD", "ETH/USD"]);

    const rule2 = mockRule1[1];
    const pairs2 = extractExchangePairs(rule2);
    expect(pairs2).toEqual(["BTC/USD", "BTC/USD"]);
  });

  it('should correctly match pairs with their rules', () => {
    const pairRules = createPairRules('src/rules.json');
    expect(pairRules).toEqual({
      "BTC/USD": [mockRule1[0], mockRule1[1]],
      "ETH/USD": [mockRule1[0]]
    });
    expect(Object.keys(pairRules).length).toBe(2);
  });

  it('should add the rule to both pairs when a rule has multiple pairs', () => {
    const pairRules = createPairRules('src/rules2.json');
    expect(pairRules).toEqual({
      "LTC/USD": [mockRule2[0]],
      "ETH/USD": [mockRule2[0]]
    });
  });

  it('should correctly add a rule for all the pairs present in it', () => {
    const pairRules = createPairRules('src/rules3.json');
    expect(pairRules).toEqual({
        "BTC/USD": [mockRule3[0]],
        "ETH/USD": [mockRule3[0]],
        "LTC/USD": [mockRule3[0]],
        "XRP/USD": [mockRule3[0]]
    })
  })

});
