import { MessageNotifier } from "../../notifier/notificationSender";
import { ConditionEvaluatorType, ConditionEvaluatorVariables } from "../conditionStrategy/conditionEvaluator";
import Rule from "../rule/rule";
import logger from "../../helpers/logger";

export default class RulesEvaluator {
    private variables: ConditionEvaluatorVariables;
    private rules: Rule[];

    constructor(variables: ConditionEvaluatorVariables, rules: Rule[]) {
        this.variables = variables;
        this.rules = rules;
    }

    async evaluateRules(notifier?: MessageNotifier): Promise<void> {
        for (const rule of this.rules) {
            const result = await rule.evaluateConditionAndExecuteActionIfTrue(this.variables);
            if (result && notifier) {
                notifier.sendNotification(`Rule ${rule.getName()} executed`);
            }
        }
        return Promise.resolve();
    }

    static fromJson(json: any): RulesEvaluator {
        if (!json.hasOwnProperty('rules')) {
            throw new Error('Rule evaluator must have rules');
        }
        if (!Array.isArray(json.rules)) {
            throw new Error('Rule evaluator rules must be an array');
        }
        if (json.rules.length === 0) {
            throw new Error('Rule evaluator rules must not be empty');
        }
        const variables = new Map<string, ConditionEvaluatorType>(Object.entries(json.variables || {}));
        const rules = json.rules.map((ruleJson: any) => Rule.fromJson(ruleJson));
        return new RulesEvaluator(variables, rules);
    }

}
