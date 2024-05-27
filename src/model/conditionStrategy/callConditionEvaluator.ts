import { getOperation } from "../../dynamic-evaluator/operations";
import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables } from "./conditionEvaluator";
import ConditionEvaluatorFactory from "./conditionEvaluatorFactory";

export default class CallConditionEvaluator implements ConditionEvaluator {
    private operation: Function;
    private args: ConditionEvaluator[];
    constructor(operation: string, args: ConditionEvaluator[]) {
        this.operation = getOperation(operation);
        this.args = args;
    }

    static fromJson(json: any): CallConditionEvaluator {
        if (!json.hasOwnProperty("name"))
            throw new Error("Call condition evaluator must have a name");
        if (!json.hasOwnProperty("arguments"))
            throw new Error("Call condition evaluator must have arguments");
        if (typeof json.name !== 'string')
            throw new Error("Call condition evaluator name must be a string");
        if (!Array.isArray(json.arguments))
            throw new Error("Call condition evaluator arguments must be an array");

        const args = json.arguments.map((arg: any) => new ConditionEvaluatorFactory(arg).create());
        return new CallConditionEvaluator(json.name, args);
    }

    evaluate(variables: ConditionEvaluatorVariables): ConditionEvaluatorType {
        const args = this.args.map(arg => arg.evaluate(variables));
        return this.operation(args);
    }
}