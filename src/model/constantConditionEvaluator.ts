import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables } from "./conditionEvaluator";

export default class ConstantConditionEvaluator implements ConditionEvaluator {
    private value: ConditionEvaluatorType;
    constructor(value: ConditionEvaluatorType) {
        this.value = value;
    }
    evaluate(variables: ConditionEvaluatorVariables): ConditionEvaluatorType {
        return this.value;
    }
}