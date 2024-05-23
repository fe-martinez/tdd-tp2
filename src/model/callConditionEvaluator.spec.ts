// import ConstantConditionEvaluator from './constantConditionEvaluator';
import CallConditionEvaluator from "./callConditionEvaluator";
import ConstantConditionEvaluator from "./constantConditionEvaluator";

describe('ConstatConditionEvaluator', () => {
    const variables = new Map<string, number>();
    it('should evaluate arguments and execute operation', () => {
        const args = [new ConstantConditionEvaluator(5000), new ConstantConditionEvaluator(5000)];
        const constantValueConditionEvaluator = new CallConditionEvaluator('==', args);
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(true);
    });
});