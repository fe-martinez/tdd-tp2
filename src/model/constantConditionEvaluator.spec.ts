import ConstantConditionEvaluator from './constantConditionEvaluator';

describe('ConstatConditionEvaluator', () => {
    const variables = new Map<string, number>();
    it('should return same value from which it was created', () => {
        const constantValueConditionEvaluator = new ConstantConditionEvaluator(5000);
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(5000);
    });

    it('should return always same value', () => {
        const constantValueConditionEvaluator = new ConstantConditionEvaluator(5000);
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(5000);
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(5000);
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(5000);
    });

    it('can store booleans', () => {
        const constantValueConditionEvaluator = new ConstantConditionEvaluator(true);
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(true);
    });

    it('can store strings', () => {
        const constantValueConditionEvaluator = new ConstantConditionEvaluator('Hello World');
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe('Hello World');
    });
});