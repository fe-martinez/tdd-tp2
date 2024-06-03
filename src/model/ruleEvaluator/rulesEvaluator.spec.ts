import RulesEvaluator from './rulesEvaluator';

describe('RulesEvaluator', () => {
    it('should throw an error if json does not have "rules" property', () => {
        const json = {};
        expect(() => RulesEvaluator.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json rules is not an array', () => {
        const json = { rules: {} };
        expect(() => RulesEvaluator.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json rules is empty', () => {
        const json = { rules: [] };
        expect(() => RulesEvaluator.fromJson(json)).toThrow(Error);
    });

    it('should create an instance from correct json', () => {
        const ruleJson = {
            name: 'Buy always',
            condition: { type: "CONSTANT", value: true },
            action: [{ type: "SET_VARIABLE", name: 'buy', value: { type: "CONSTANT", value: true } }]
        };
        const rules = [ruleJson];
        const json = { rules, variables: {} };
        const rulesEvaluator = RulesEvaluator.fromJson(json);
        expect(rulesEvaluator).toBeInstanceOf(RulesEvaluator);
    });
});
