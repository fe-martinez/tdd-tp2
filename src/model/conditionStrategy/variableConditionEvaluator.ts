import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables, InexistentVariableError } from "./conditionEvaluator";

export default class VariableConditionEvaluator implements ConditionEvaluator {
    private variableName: string;
    constructor(variableName: string) {
        this.variableName = variableName;
    }
    evaluate(variables: ConditionEvaluatorVariables): ConditionEvaluatorType {
        const value = variables.get(this.variableName);
        if (!value) {
            throw new InexistentVariableError(`Variable ${this.variableName} not found`);
        }
        return value;
    }
}