import VariableConditionEvaluator from './variableConditionEvaluator';

describe('VariableConditionEvaluator', () => {
    const variables = new Map();
    variables.set("MY_VARIABLE_NAME", 5000);

    const updateVariable = (variables: Map<string, number>, variableName: string, value: number) => variables.set(variableName, value); 

    it('should return a value after created', () => {
        const constantValueConditionEvaluator = new VariableConditionEvaluator("MY_VARIABLE_NAME");
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(5000);
    });
    
    it('should return always same value if variable not updated', () => {
        const constantValueConditionEvaluator = new VariableConditionEvaluator("MY_VARIABLE_NAME");
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(5000);
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(5000);
    });

    it('should return updated value if variable updated', () => {
        const constantValueConditionEvaluator = new VariableConditionEvaluator("MY_VARIABLE_NAME");
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(5000);
        updateVariable(variables, "MY_VARIABLE_NAME", 10000);
        expect(constantValueConditionEvaluator.evaluate(variables)).toBe(10000);
    });
});