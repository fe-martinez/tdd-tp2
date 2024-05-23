type ConstantConditionEvaluatorType = number | boolean | string;

export default class ConstantConditionEvaluator {
    private value: ConstantConditionEvaluatorType;
    constructor(value: ConstantConditionEvaluatorType) {
        this.value = value;
    }
    evaluate() {
        return this.value;
    }
}