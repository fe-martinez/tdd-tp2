import { ConditionEvaluatorVariables } from "../conditionStrategy/conditionEvaluator";

export interface Action {
    execute(variables: ConditionEvaluatorVariables): Promise<void>;
}