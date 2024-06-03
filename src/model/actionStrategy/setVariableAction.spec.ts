import ConstantConditionEvaluator from "../conditionStrategy/constantConditionEvaluator";
import VariableConditionEvaluator from "../conditionStrategy/variableConditionEvaluator";
import SetVariableAction from "./setVariableAction";

describe('SetVariableAction', () => {
    const variables = new Map<string, number>();
    const variableName = 'testVariable';
    variables.set(variableName, 10);

    it('setVariableAction sets existent variable', async () => {
        const constantConditionEvaluator = new ConstantConditionEvaluator(20);
        const setVariableAction = new SetVariableAction(variableName, constantConditionEvaluator);

        await setVariableAction.execute(variables);
        const value = variables.get(variableName);
        expect(value).toBe(20);
    });

    it('setVariableAction sets new variable by creating it', async () => {
        const newVariableName = 'newVariable';
        const constantConditionEvaluator = new ConstantConditionEvaluator("20");
        const setVariableAction = new SetVariableAction(newVariableName, constantConditionEvaluator);

        await setVariableAction.execute(variables);
        const value = variables.get(newVariableName);
        expect(value).toBe("20");
    });

    it('should throw an error if json does not have a variable name', () => {
        const json = { value: 1 };
        expect(() => SetVariableAction.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json variable name is not a string', () => {
        const json = { name: 1, value: 1 };
        expect(() => SetVariableAction.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json does not have a value', () => {
        const json = { name: 'testVariable' };
        expect(() => SetVariableAction.fromJson(json)).toThrow(Error);
    });

    it('should throw an error if json value is not correct', () => {
        const json = { name: 'testVariable', value: { value: true } };
        expect(() => SetVariableAction.fromJson(json)).toThrow(Error);
    });

    it('should create a SetVariableAction from json', () => {
        const json = {
            type: "SET_VARIABLE",
            name: "ValorMinimoTDD",
            value: {
                type: "CONSTANT",
                value: "12"
            }
        };
        const setVariableAction = SetVariableAction.fromJson(json);
        expect(setVariableAction).toBeInstanceOf(SetVariableAction);
    });
});