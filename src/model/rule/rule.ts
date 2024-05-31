import { Action } from "../actionStrategy/action";
import ActionFactory from "../actionStrategy/actionFactory";
import { ConditionEvaluator, ConditionEvaluatorVariables, ConditionResultNotBooleanError } from "../conditionStrategy/conditionEvaluator";
import ConditionEvaluatorFactory from "../conditionStrategy/conditionEvaluatorFactory";

export default class Rule {
    private name: string;
    private conditionEvaluator: ConditionEvaluator;
    private action: Action;
    
    constructor(name: string, conditionEvaluator: ConditionEvaluator, action: Action) {
        this.name = name;
        this.conditionEvaluator = conditionEvaluator;
        this.action = action;
    }

    static fromJson(json: any): Rule {
        if (!json.hasOwnProperty('name')) {
            throw new Error('Rule must have a name');
        }
        if (typeof json.name !== 'string') {
            throw new Error('Rule name must be a string');
        }
        if (!json.hasOwnProperty('condition')) {
            throw new Error('Rule must have a condition evaluator');
        }
        if (!json.hasOwnProperty('action')) {
            throw new Error('Rule must have an action');
        }
        const name = json.name;
        const conditionEvaluator = new ConditionEvaluatorFactory(json.condition).create();
        const action = new ActionFactory(json.action).create();
        return new Rule(name, conditionEvaluator, action);
    }
    
    getName(): string {
        return this.name;
    }
    
    async evaluateConditionAndExecuteActionIfTrue(variables: ConditionEvaluatorVariables): Promise<boolean> {
        const conditionResult = await this.conditionEvaluator.evaluate(variables);
        if (typeof conditionResult !== 'boolean') {
            throw new ConditionResultNotBooleanError(conditionResult);
        }

        if (conditionResult !== true) {
            return false;
        }

        await this.action.execute(variables);
        return true;
    }
}