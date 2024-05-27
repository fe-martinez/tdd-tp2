import ConstantConditionEvaluator from './constantConditionEvaluator';

describe('ConstatConditionEvaluator', () => {
    const variables = new Map<string, number>();
    it('should return same value from which it was created', () => {
        const evaluator = new ConstantConditionEvaluator(5000);
        expect(evaluator.evaluate(variables)).toBe(5000);
    });

    it('should return always same value', () => {
        const evaluator = new ConstantConditionEvaluator(5000);
        expect(evaluator.evaluate(variables)).toBe(5000);
        expect(evaluator.evaluate(variables)).toBe(5000);
        expect(evaluator.evaluate(variables)).toBe(5000);
    });

    it('can store booleans', () => {
        const evaluator = new ConstantConditionEvaluator(true);
        expect(evaluator.evaluate(variables)).toBe(true);
    });

    it('can store strings', () => {
        const evaluator = new ConstantConditionEvaluator('Hello World');
        expect(evaluator.evaluate(variables)).toBe('Hello World');
    });

    it('should throw an error if the json does not have "value" property', () => {
        expect(() => ConstantConditionEvaluator.fromJson({})).toThrow(Error);
    });

    it('should throw an error if the json "value" property has an invalid type', () => {
        expect(() => ConstantConditionEvaluator.fromJson({ value: [] })).toThrow(Error);
    });
});