import { ConditionEvaluator, ConditionEvaluatorVariables } from "../conditionStrategy/conditionEvaluator";
import { Action } from "./action";

export default class SetVariableAction implements Action {
    private variableName: string;
    private value: ConditionEvaluator;

    constructor(variableName: string, value: ConditionEvaluator) {
        this.variableName = variableName;
        this.value = value;
    }
    async execute(variables: ConditionEvaluatorVariables): Promise<void> {
        const value = await this.value.evaluate(variables);
        variables.set(this.variableName, value);
        return Promise.resolve();
    }
}