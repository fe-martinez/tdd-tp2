import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables, isConditionEvaluatorType } from "./conditionEvaluator";

export default class ConstantConditionEvaluator implements ConditionEvaluator {
    private value: ConditionEvaluatorType;
    constructor(value: ConditionEvaluatorType) {
        this.value = value;
    }

    static fromJson(json: any): ConstantConditionEvaluator {
        if (!json.hasOwnProperty("value"))
            throw new Error("Constant condition evaluator must have a value");
        if (!isConditionEvaluatorType(json.value))
            throw new Error("Constant condition evaluator value must be a number, boolean or string");

        return new ConstantConditionEvaluator(json.value);
    }

    evaluate(variables: ConditionEvaluatorVariables): Promise<ConditionEvaluatorType> {
        return Promise.resolve(this.value);
    }
}