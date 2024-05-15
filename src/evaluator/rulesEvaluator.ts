import { evaluateCondition } from "./conditionsEvaluator";
import { Action, RuleSet, Value } from "./types";

export function evaluateRules (ruleSet: RuleSet) {
    for (const rule of ruleSet.rules) {
        console.log(rule)
        if(evaluateCondition(rule.condition, ruleSet.variables)) {
            for (const action of rule.action) {
                executeAction(action, ruleSet.variables);
            }
        }
    }
}

export function executeAction(action: Action, variables: { [name: string]: Value }): void {
    switch (action.type) {
      case 'BUY_MARKET':
        const buyAmount = evaluateCondition(action.amount, variables);
        console.log("Compre " + action.symbol + "!")
        break;
      case 'SELL_MARKET':
        const sellAmount = evaluateCondition(action.amount, variables);
        console.log("Vendi " + action.symbol + "!")
        break;
      case 'SET_VARIABLE':
        const newValue = evaluateCondition(action.value, variables);
        variables[action.name] = newValue;
        break;
      default:
        throw new Error(`Unsupported action type`);
    }
}