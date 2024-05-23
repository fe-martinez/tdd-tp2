export type ConditionEvaluatorVariables = Map<string, number>;
export type ConditionEvaluatorType = number | boolean | string | undefined;

export interface ConditionEvaluator {
    evaluate(variables: ConditionEvaluatorVariables): ConditionEvaluatorType;
}