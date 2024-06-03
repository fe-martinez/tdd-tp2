export class ConditionEvaluatorFactoryError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ConditionEvaluatorFactoryError";
    }
}