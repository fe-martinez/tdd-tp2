import { getOperation } from "../../dynamic-evaluator/operations";
import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables } from "./conditionEvaluator";


export default class CallConditionEvaluator implements ConditionEvaluator {
    private operation: Function;
    private args: ConditionEvaluator[];
    constructor(operation: string, args: ConditionEvaluator[]) {
        this.operation = getOperation(operation);
        this.args = args;
    }
    evaluate(variables: ConditionEvaluatorVariables): ConditionEvaluatorType {
        const args = this.args.map(arg => arg.evaluate(variables));
        return this.operation(args);
    }
}