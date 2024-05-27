import { ConditionEvaluatorType, ConditionEvaluatorVariables } from "../conditionStrategy/conditionEvaluator";
import { Action } from "./action";

export default class SetVariableAction implements Action {
    private variableName: string;
    private value: ConditionEvaluatorType;

    constructor(variableName: string, value: ConditionEvaluatorType) {
        this.variableName = variableName;
        this.value = value;
    }
    execute(variables: ConditionEvaluatorVariables): Promise<void> {
        variables.set(this.variableName, this.value);
        return Promise.resolve();
    }
}