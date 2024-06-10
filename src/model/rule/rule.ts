import { Action } from "../actionStrategy/action";
import ActionFactory from "../actionStrategy/actionFactory";
import { ConditionEvaluator, ConditionEvaluatorVariables, ConditionResultNotBooleanError } from "../conditionStrategy/conditionEvaluator";
import ConditionEvaluatorFactory from "../conditionStrategy/conditionEvaluatorFactory";
import logger from "../../helpers/logger";

export default class Rule {
    private name: string;
    private conditionEvaluator: ConditionEvaluator;
    private actions: Action[];
    
    constructor(name: string, conditionEvaluator: ConditionEvaluator, actions: Action[]) {
        this.name = name;
        this.conditionEvaluator = conditionEvaluator;
        this.actions = actions;
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
        
        const actions = json.action.map((action: any) => new ActionFactory(action).create());

        logger(`Rule ${name} created with json: ${JSON.stringify(json)}`);
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
            logger(`Condition not met for rule: ${this.name}`);
            return false;
        }

        logger(`Condition met for rule: ${this.name}`);
        for (const action of this.actions) {
            await action.execute(variables);
        }

        return true;
    }
}