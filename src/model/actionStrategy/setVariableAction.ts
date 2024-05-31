import { ConditionEvaluator, ConditionEvaluatorVariables } from "../conditionStrategy/conditionEvaluator";
import ConditionEvaluatorFactory from "../conditionStrategy/conditionEvaluatorFactory";
import { Action } from "./action";

export default class SetVariableAction implements Action {
    private variableName: string;
    private value: ConditionEvaluator;

    constructor(variableName: string, value: ConditionEvaluator) {
        this.variableName = variableName;
        this.value = value;
    }

    static fromJson(json: any): SetVariableAction {
        if (!json.hasOwnProperty('name')) {
            throw new Error('Set variable action must have a variable name');
        }
        if (typeof json.name !== 'string') {
            throw new Error('Set variable action variable name must be a string');
        }
        if (!json.hasOwnProperty('value')) {
            throw new Error('Set variable action must have a value');
        }
        try {
            const value = new ConditionEvaluatorFactory(json.value).create();
            return new SetVariableAction(json.name, value);
        } catch (error) {
            throw new Error(`Set variable action value must be a valid condition evaluator. Error: ${error}`);
        }
    }

    async execute(variables: ConditionEvaluatorVariables): Promise<void> {
        const value = await this.value.evaluate(variables);
        variables.set(this.variableName, value);
        return Promise.resolve();
    }
}