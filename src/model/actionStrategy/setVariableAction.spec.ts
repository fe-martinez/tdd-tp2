import SetVariableAction from "./setVariableAction";

describe('SetVariableAction', () => {
    const variables = new Map<string, number>();
    const variableName = 'testVariable';
    variables.set(variableName, 10);

    it('setVariableAction sets existent variable', async () => {
        const setVariableAction = new SetVariableAction(variableName, 20);

        setVariableAction.execute(variables);
        const value = variables.get(variableName);
        expect(value).toBe(20);
    });

    it('setVariableAction sets new variable by creating it', async () => {
        const newVariableName = 'newVariable';
        const setVariableAction = new SetVariableAction(newVariableName, "20");

        setVariableAction.execute(variables);
        const value = variables.get(newVariableName);
        expect(value).toBe("20");
    });

});