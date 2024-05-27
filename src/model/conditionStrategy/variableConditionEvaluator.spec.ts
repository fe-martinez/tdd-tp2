import { InexistentVariableError } from './conditionEvaluator';
import VariableConditionEvaluator from './variableConditionEvaluator';

describe('VariableConditionEvaluator', () => {
    const variables = new Map();
    variables.set("MY_VARIABLE_NAME", 5000);

    const updateVariable = (variables: Map<string, number>, variableName: string, value: number) => variables.set(variableName, value); 

    it('should return a value after created', async () => {
        const evaluator = new VariableConditionEvaluator("MY_VARIABLE_NAME");
        expect(await evaluator.evaluate(variables)).toBe(5000);
    });
    
    it('should return always same value if variable not updated', async () => {
        const evaluator = new VariableConditionEvaluator("MY_VARIABLE_NAME");
        expect(await evaluator.evaluate(variables)).toBe(5000);
        expect(await evaluator.evaluate(variables)).toBe(5000);
    });

    it('should return updated value if variable updated', async () => {
        const evaluator = new VariableConditionEvaluator("MY_VARIABLE_NAME");
        expect(await evaluator.evaluate(variables)).toBe(5000);
        updateVariable(variables, "MY_VARIABLE_NAME", 10000);
        expect(await evaluator.evaluate(variables)).toBe(10000);
    });

    it('should throw error if variable not found', async () => {
        const evaluator = new VariableConditionEvaluator("MY_INEXISTENT_VARIABLE_NAME");
        expect(() => evaluator.evaluate(variables)).toThrow(InexistentVariableError);
    });

    it('should throw error if json does not have "name" property', () => {
        expect(() => VariableConditionEvaluator.fromJson({})).toThrow(Error);
    });

    it('should throw error if json "name" property is not string', () => {
        expect(() => VariableConditionEvaluator.fromJson({ name: 1 })).toThrow(Error);
    });

    it('should create a variable condition evaluator from json', async () => {
        const json = {
            name: "MY_VARIABLE_NAME"
        };
        const evaluator = VariableConditionEvaluator.fromJson(json);
        expect(await evaluator.evaluate(variables)).toBe(10000);
    });
});