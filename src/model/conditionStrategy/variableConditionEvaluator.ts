import { ConditionEvaluator, ConditionEvaluatorType, ConditionEvaluatorVariables, InexistentVariableError } from "./conditionEvaluator";

export default class VariableConditionEvaluator implements ConditionEvaluator {
    private variableName: string;
    constructor(variableName: string) {
        this.variableName = variableName;
    }

    static fromJson(json: any): VariableConditionEvaluator {
        if (!json.hasOwnProperty("name"))
            throw new Error("Variable condition evaluator must have a name");
        if (typeof json.name !== 'string')
            throw new Error("Variable condition evaluator name must be a string");

        return new VariableConditionEvaluator(json.name);
    }

    evaluate(variables: ConditionEvaluatorVariables): Promise<ConditionEvaluatorType> {
        const value = variables.get(this.variableName);
        if (value === undefined) {
            throw new InexistentVariableError(`Variable ${this.variableName} not found`);
        }
        return Promise.resolve(value);
    }
}