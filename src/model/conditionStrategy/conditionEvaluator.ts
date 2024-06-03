export type ConditionEvaluatorType = number | boolean | string;
export type ConditionEvaluatorVariables = Map<string, ConditionEvaluatorType>;

export function isConditionEvaluatorType(value: any): value is ConditionEvaluatorType {
    return typeof value === 'number' || typeof value === 'boolean' || typeof value === 'string';
}

export class InexistentVariableError extends Error {
    constructor(variableName: string) {
        super(`Variable ${variableName} not found`);
    }
}

export class ConditionResultNotBooleanError extends Error {
    constructor(result: ConditionEvaluatorType) {
        super(`Condition result is not a boolean: ${result}`);
    }
}

export interface ConditionEvaluator {
    evaluate(variables: ConditionEvaluatorVariables): Promise<ConditionEvaluatorType>;
}