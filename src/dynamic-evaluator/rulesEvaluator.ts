import { Action, BuyMarketAction, SellMarketAction, SetVariableAction } from "../model/types";
import { ConditionEvaluator } from "./conditionEvaluator";

function executeAction(action: Action, conditionEvaluator: ConditionEvaluator): void {
    switch (action.type) {
        case 'BUY_MARKET':
            executeBuyMarketAction(action as BuyMarketAction, conditionEvaluator);
            break;
        case 'SELL_MARKET':
            executeSellMarketAction(action as SellMarketAction, conditionEvaluator);
            break;
        case 'SET_VARIABLE':
            executeSetVariableAction(action as SetVariableAction, conditionEvaluator);
            break;
        default:
            throw new Error(`Unsupported action type: ${action}`);
    }
}

function executeBuyMarketAction(action: BuyMarketAction, conditionEvaluator: ConditionEvaluator): void {
    const amount = conditionEvaluator.compileActionAmount(action)();
    console.log(`Buying ${amount} of ${action.symbol}`);
}

function executeSellMarketAction(action: SellMarketAction, conditionEvaluator: ConditionEvaluator): void {
    const amount = conditionEvaluator.compileActionAmount(action)();
    console.log(`Selling ${amount} of ${action.symbol}`);
}

function executeSetVariableAction(action: SetVariableAction, conditionEvaluator: ConditionEvaluator): void {
    const value = conditionEvaluator.compileActionValue(action)();
    conditionEvaluator.setVariable(action.name, value);
    console.log(`Setting variable ${action.name} to ${value}`);
}

export function executeRuleSet(compiledRules: ConditionEvaluator) {
    const rules = compiledRules.ruleMap;
    Object.keys(rules).forEach(ruleName => {
        const rule = rules[ruleName];
        if (rule.condition()) {
            rule.actions.forEach(action => executeAction(action, compiledRules));
        }
    });
}