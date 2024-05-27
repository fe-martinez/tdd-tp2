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

    it('should throw error if operation not found', () => {
        const args = [new ConstantConditionEvaluator(5000), new ConstantConditionEvaluator(5000)];
        const evaluator = new CallConditionEvaluator('==:', args);
        expect(() => evaluator.evaluate(variables)).toThrow(Error);
    });

    it('should throw error if json has not "name" property', () => {
        expect(() => CallConditionEvaluator.fromJson({})).toThrow(Error);
    });

    it('should throw error if json has not "arguments" property', () => {
        expect(() => CallConditionEvaluator.fromJson({ name: '=='})).toThrow(Error);
    });

    it('should throw error if json "name" property is not string', () => {
        expect(() => CallConditionEvaluator.fromJson({ name: 1, arguments: [] })).toThrow(Error);
    });

    it('should throw error if json "arguments" property is not array', () => {
        expect(() => CallConditionEvaluator.fromJson({ name: '==', arguments: 1 })).toThrow(Error);
    });

    it('should create a call condition evaluator from json', () => {
        const json = {
            name: "==",
            arguments: [
                {
                    type: "CONSTANT",
                    value: 1
                },
                {
                    type: "CONSTANT",
                    value: 2
                }
            ]
        };
        const evaluator = CallConditionEvaluator.fromJson(json);
        expect(evaluator).toBeInstanceOf(CallConditionEvaluator);
    });
});