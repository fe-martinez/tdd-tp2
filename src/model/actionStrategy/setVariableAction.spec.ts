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

});