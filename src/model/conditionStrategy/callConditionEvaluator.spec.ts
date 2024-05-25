import CallConditionEvaluator from "./callConditionEvaluator";
import ConstantConditionEvaluator from "./constantConditionEvaluator";
import VariableConditionEvaluator from "./variableConditionEvaluator";

describe('ConstatConditionEvaluator', () => {
    const variables = new Map<string, number>();
    it('should evaluate arguments and execute operation', () => {
        const args = [new ConstantConditionEvaluator(5000), new ConstantConditionEvaluator(5000)];
        const evaluator = new CallConditionEvaluator('==', args);
        expect(evaluator.evaluate(variables)).toBe(true);
    });

    it('should evaluate variable arguments and execute operation', () => {
        const variableName = "MY_VARIABLE_NAME";
        variables.set(variableName, 10000);
        const args = [new ConstantConditionEvaluator(5000), new VariableConditionEvaluator(variableName)];
        const evaluator = new CallConditionEvaluator('>', args);
        expect(evaluator.evaluate(variables)).toBe(false);
    });

    it('should evaluate recursive call arguments and execute operation', () => {
        const variableName = "MY_VARIABLE_NAME";
        variables.set(variableName, 10000);
        const args = [new ConstantConditionEvaluator(5000), new VariableConditionEvaluator(variableName)];
        const evaluator = new CallConditionEvaluator('>', args);
        
        const args2 = [evaluator, new ConstantConditionEvaluator(false)];
        const constantValueConditionEvaluator2 = new CallConditionEvaluator('AND', args2);
        expect(constantValueConditionEvaluator2.evaluate(variables)).toBe(false);
    });
});