export type ConditionEvaluatorType = number | boolean | string;
export type ConditionEvaluatorVariables = Map<string, ConditionEvaluatorType>;

export class InexistentVariableError extends Error {
    constructor(variableName: string) {
        super(`Variable ${variableName} not found`);
    }
}

export interface ConditionEvaluator {
    evaluate(variables: ConditionEvaluatorVariables): ConditionEvaluatorType;
}