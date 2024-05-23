import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables } from "./conditionEvaluator";

export default class VariableConditionEvaluator implements ConditionEvaluator {
    private variableName: string;
    constructor(variableName: string) {
        this.variableName = variableName;
    }
    evaluate(variables: ConditionEvaluatorVariables): ConditionEvaluatorType {
        return variables.get(this.variableName);
    }
}