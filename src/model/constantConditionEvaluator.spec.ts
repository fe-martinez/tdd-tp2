import ConstantConditionEvaluator from './constantConditionEvaluator';

describe('ConstatConditionEvaluator', () => {
    it('should return same value from which it was created', () => {
        const constantValueConditionEvaluator = new ConstantConditionEvaluator(5000);
        expect(constantValueConditionEvaluator.evaluate()).toBe(5000);
    });

    it('should return always same value', () => {
        const constantValueConditionEvaluator = new ConstantConditionEvaluator(5000);
        expect(constantValueConditionEvaluator.evaluate()).toBe(5000);
        expect(constantValueConditionEvaluator.evaluate()).toBe(5000);
        expect(constantValueConditionEvaluator.evaluate()).toBe(5000);
    });

    it('can store booleans', () => {
        const constantValueConditionEvaluator = new ConstantConditionEvaluator(true);
        expect(constantValueConditionEvaluator.evaluate()).toBe(true);
    });

    it('can store strings', () => {
        const constantValueConditionEvaluator = new ConstantConditionEvaluator('Hello World');
        expect(constantValueConditionEvaluator.evaluate()).toBe('Hello World');
    });
});