export type ConditionEvaluatorVariables = Map<string, number>;
export type ConditionEvaluatorType = number | boolean | string;

export class InexistentVariableError extends Error {
    constructor(variableName: string) {
        super(`Variable ${variableName} not found`);
    }
}

export interface ConditionEvaluator {
    evaluate(variables: ConditionEvaluatorVariables): ConditionEvaluatorType;
}